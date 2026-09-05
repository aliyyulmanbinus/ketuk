import { createEventSchema, updateEventSchema } from '@ketuk/shared';
import { and, eq, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { db } from '../db';
import { events, invitations } from '../db/schema';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../lib/errors';
import { ok } from '../lib/response';
import type { AuthUser } from '../middleware/auth';
import { optionalAuth } from '../middleware/auth';
import { createEvent, publishEvent } from '../services/event';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Body pembuatan event boleh belum punya tanggal/lokasi — itu baru diwajibkan
 * saat publish (lihat services/event.ts). Dasarnya tetap createEventSchema dari
 * @ketuk/shared, cuma field yang belum tentu diisi saat draft dilonggarkan di sini.
 */
const createEventBodySchema = createEventSchema.partial({
	date: true,
	timeStart: true,
	timeEnd: true,
	venue: true,
	location: true,
	locationUrl: true,
});

function requireUser(user: AuthUser | null): AuthUser {
	if (!user) throw new UnauthorizedError();
	return user;
}

export const eventsRoutes = new Hono<{ Variables: { user: AuthUser | null } }>();

eventsRoutes.use('*', optionalAuth);

/** Daftar event milik user yang login. */
eventsRoutes.get('/', async (c) => {
	const user = requireUser(c.get('user'));
	const rows = await db
		.select()
		.from(events)
		.where(eq(events.ownerId, user.id))
		.orderBy(sql`${events.createdAt} desc`)
		.limit(100);
	return ok(c, rows);
});

/** Buat event baru sebagai draft. */
eventsRoutes.post('/', async (c) => {
	const user = requireUser(c.get('user'));
	const input = createEventBodySchema.parse(await c.req.json());
	const event = await createEvent(user.id, input);
	return ok(c, event, 201);
});

/**
 * Satu handler untuk dua kebutuhan: owner mengedit draft-nya sendiri (lookup by
 * id ATAU slug), dan publik membuka halaman undangan (lookup by slug, hanya yang published).
 * Ini kenapa path-nya `/:idOrSlug`, bukan dipisah `/:id` vs `/:slug` — keduanya
 * sama-sama string dan Hono tidak bisa membedakan pola di level routing.
 */
eventsRoutes.get('/:idOrSlug', async (c) => {
	const idOrSlug = c.req.param('idOrSlug');
	const user = c.get('user');
	const isUuid = UUID_RE.test(idOrSlug);

	if (user) {
		const [own] = await db
			.select()
			.from(events)
			.where(
				and(
					isUuid ? eq(events.id, idOrSlug) : eq(events.slug, idOrSlug),
					eq(events.ownerId, user.id),
				),
			)
			.limit(1);

		if (own) {
			const [invitation] = await db
				.select()
				.from(invitations)
				.where(eq(invitations.eventId, own.id))
				.limit(1);
			return ok(c, { ...own, invitation: invitation ?? null });
		}
	}

	const [publicEvent] = await db
		.select()
		.from(events)
		.where(and(eq(events.slug, idOrSlug), eq(events.isPublished, true)))
		.limit(1);

	if (!publicEvent) {
		throw new NotFoundError('Event tidak ditemukan');
	}

	// Statistik tampilan halaman undangan — lewat fungsi SECURITY DEFINER supaya
	// tidak perlu policy UPDATE terbuka untuk publik hanya demi satu counter.
	await db.execute(sql`select increment_event_view(${publicEvent.slug})`);

	const [invitation] = await db
		.select()
		.from(invitations)
		.where(eq(invitations.eventId, publicEvent.id))
		.limit(1);

	return ok(c, { ...publicEvent, invitation: invitation ?? null });
});

async function assertOwnership(eventId: string, userId: string) {
	const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
	if (!event) throw new NotFoundError('Event tidak ditemukan');
	if (event.ownerId !== userId) throw new ForbiddenError();
	return event;
}

eventsRoutes.patch('/:id', async (c) => {
	const user = requireUser(c.get('user'));
	const id = c.req.param('id');
	await assertOwnership(id, user.id);

	const input = updateEventSchema.parse(await c.req.json());
	const [updated] = await db
		.update(events)
		.set({ ...input, updatedAt: new Date() })
		.where(eq(events.id, id))
		.returning();

	return ok(c, updated);
});

eventsRoutes.delete('/:id', async (c) => {
	const user = requireUser(c.get('user'));
	const id = c.req.param('id');
	await assertOwnership(id, user.id);

	await db.delete(events).where(eq(events.id, id));
	return ok(c, { id });
});

eventsRoutes.post('/:id/publish', async (c) => {
	const user = requireUser(c.get('user'));
	const id = c.req.param('id');
	const updated = await publishEvent(id, user.id);
	return ok(c, updated);
});
