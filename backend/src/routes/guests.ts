import { generateUniqueSlug, rsvpSchema, wishSchema } from '@ketuk/shared';
import { and, eq, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { events, guests, wishes } from '../db/schema';
import { ForbiddenError, NotFoundError, UnauthorizedError, ValidationError } from '../lib/errors';
import { ok } from '../lib/response';
import type { AuthUser } from '../middleware/auth';
import { optionalAuth } from '../middleware/auth';
import { publicWriteRateLimit } from '../middleware/rate-limit';

function requireUser(user: AuthUser | null): AuthUser {
	if (!user) throw new UnauthorizedError();
	return user;
}

async function assertEventOwnership(eventId: string, userId: string) {
	const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
	if (!event) throw new NotFoundError('Event tidak ditemukan');
	if (event.ownerId !== userId) throw new ForbiddenError();
	return event;
}

/**
 * Parser CSV sengaja sederhana — tidak menangani nilai yang mengandung koma
 * atau newline di dalam quote. Cukup untuk import daftar tamu standar
 * (name, phone, guestGroup); kalau format sumbernya lebih kompleks, tim perlu
 * ganti ini dengan library CSV parser yang tervalidasi.
 */
function parseGuestCsv(csv: string): { name: string; phone?: string; guestGroup?: string }[] {
	const lines = csv
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean);
	if (lines.length === 0) return [];

	const header = lines[0];
	if (!header) return [];

	const columns = header.split(',').map((col) => col.trim().toLowerCase());
	const nameIdx = columns.indexOf('name');
	const phoneIdx = columns.indexOf('phone');
	const groupIdx = columns.indexOf('guestgroup');
	if (nameIdx === -1) return [];

	return lines
		.slice(1)
		.map((line) => line.split(','))
		.filter((cols) => cols[nameIdx]?.trim())
		.map((cols) => ({
			name: (cols[nameIdx] ?? '').trim(),
			phone: phoneIdx !== -1 ? cols[phoneIdx]?.trim() || undefined : undefined,
			guestGroup: groupIdx !== -1 ? cols[groupIdx]?.trim() || undefined : undefined,
		}));
}

const createGuestSchema = z.object({
	name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100),
	phone: z.string().trim().max(20).optional(),
	guestGroup: z.string().trim().max(100).optional(),
});

const updateGuestSchema = createGuestSchema.partial();

export const guestsRoutes = new Hono<{ Variables: { user: AuthUser | null } }>();

guestsRoutes.use('*', optionalAuth);

// ── Owner-only: kelola daftar tamu ──────────────────────────────────────────

guestsRoutes.get('/events/:eventId/guests', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	await assertEventOwnership(eventId, user.id);

	const rows = await db.select().from(guests).where(eq(guests.eventId, eventId)).limit(1000);
	return ok(c, rows);
});

guestsRoutes.post('/events/:eventId/guests', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	await assertEventOwnership(eventId, user.id);

	const input = createGuestSchema.parse(await c.req.json());
	const existing = await db
		.select({ slug: guests.slug })
		.from(guests)
		.where(eq(guests.eventId, eventId));
	const slug = generateUniqueSlug(
		input.name,
		existing.map((row) => row.slug),
	);

	const [guest] = await db
		.insert(guests)
		.values({
			eventId,
			name: input.name,
			phone: input.phone ?? null,
			guestGroup: input.guestGroup ?? null,
			slug,
		})
		.returning();

	return ok(c, guest, 201);
});

guestsRoutes.post('/events/:eventId/guests/import', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	await assertEventOwnership(eventId, user.id);

	const { csv } = z.object({ csv: z.string().min(1, 'File CSV kosong') }).parse(await c.req.json());
	const rows = parseGuestCsv(csv);
	if (rows.length === 0) {
		throw new ValidationError('CSV tidak berisi data tamu yang valid (butuh kolom "name")');
	}

	const existing = await db
		.select({ slug: guests.slug })
		.from(guests)
		.where(eq(guests.eventId, eventId));
	const usedSlugs = existing.map((row) => row.slug);

	const toInsert = rows.map((row) => {
		const slug = generateUniqueSlug(row.name, usedSlugs);
		usedSlugs.push(slug);
		return {
			eventId,
			name: row.name,
			phone: row.phone ?? null,
			guestGroup: row.guestGroup ?? null,
			slug,
		};
	});

	const inserted = await db.insert(guests).values(toInsert).returning();
	return ok(c, inserted, 201);
});

guestsRoutes.get('/events/:eventId/guests/stats', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	await assertEventOwnership(eventId, user.id);

	const rows = await db
		.select({
			status: guests.rsvpStatus,
			guestCount: sql<number>`count(*)::int`,
			totalPax: sql<number>`coalesce(sum(${guests.pax}), 0)::int`,
		})
		.from(guests)
		.where(eq(guests.eventId, eventId))
		.groupBy(guests.rsvpStatus);

	return ok(c, rows);
});

guestsRoutes.patch('/events/:eventId/guests/:guestId', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	const guestId = c.req.param('guestId');
	await assertEventOwnership(eventId, user.id);

	const input = updateGuestSchema.parse(await c.req.json());
	const [updated] = await db
		.update(guests)
		.set(input)
		.where(and(eq(guests.id, guestId), eq(guests.eventId, eventId)))
		.returning();

	if (!updated) throw new NotFoundError('Tamu tidak ditemukan');
	return ok(c, updated);
});

guestsRoutes.delete('/events/:eventId/guests/:guestId', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	const guestId = c.req.param('guestId');
	await assertEventOwnership(eventId, user.id);

	await db.delete(guests).where(and(eq(guests.id, guestId), eq(guests.eventId, eventId)));
	return ok(c, { id: guestId });
});

// ── Publik: RSVP & ucapan ────────────────────────────────────────────────────

const rsvpBodySchema = rsvpSchema.extend({
	eventSlug: z.string().min(1),
	guestSlug: z.string().min(1),
});

/**
 * Tidak ada policy UPDATE terbuka untuk tamu publik — endpoint ini cuma
 * meneruskan input tervalidasi ke fungsi Postgres `submit_rsvp` (SECURITY DEFINER,
 * lihat sql/functions.sql), yang jadi satu-satunya jalan mengubah kolom RSVP.
 */
guestsRoutes.post('/rsvp', publicWriteRateLimit, async (c) => {
	const body = rsvpBodySchema.parse(await c.req.json());

	try {
		await db.execute(
			sql`select submit_rsvp(${body.guestSlug}, ${body.eventSlug}, ${body.status}, ${body.pax}, ${body.message ?? null})`,
		);
	} catch {
		throw new NotFoundError('Tamu atau event tidak ditemukan');
	}

	return ok(c, { success: true });
});

const wishBodySchema = wishSchema.extend({
	eventSlug: z.string().min(1),
	guestSlug: z.string().min(1).optional(),
});

guestsRoutes.post('/wishes', publicWriteRateLimit, async (c) => {
	const body = wishBodySchema.parse(await c.req.json());

	const [event] = await db
		.select()
		.from(events)
		.where(and(eq(events.slug, body.eventSlug), eq(events.isPublished, true)))
		.limit(1);
	if (!event) throw new NotFoundError('Event tidak ditemukan');

	let guestId: string | null = null;
	if (body.guestSlug) {
		const [guest] = await db
			.select({ id: guests.id })
			.from(guests)
			.where(and(eq(guests.eventId, event.id), eq(guests.slug, body.guestSlug)))
			.limit(1);
		guestId = guest?.id ?? null;
	}

	const [wish] = await db
		.insert(wishes)
		.values({ eventId: event.id, guestId, name: body.name, message: body.message })
		.returning();

	return ok(c, wish, 201);
});

guestsRoutes.get('/events/:eventSlug/wishes', async (c) => {
	const eventSlug = c.req.param('eventSlug');
	const [event] = await db
		.select()
		.from(events)
		.where(and(eq(events.slug, eventSlug), eq(events.isPublished, true)))
		.limit(1);
	if (!event) throw new NotFoundError('Event tidak ditemukan');

	const rows = await db
		.select()
		.from(wishes)
		.where(eq(wishes.eventId, event.id))
		.orderBy(sql`${wishes.createdAt} desc`)
		.limit(100);

	return ok(c, rows);
});
