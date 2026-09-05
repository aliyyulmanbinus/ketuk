import { generateUniqueSlug, VENDOR_CATEGORIES } from '@ketuk/shared';
import { and, eq, gte, ilike, lte, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { vendors } from '../db/schema';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../lib/errors';
import { ok } from '../lib/response';
import type { AuthUser } from '../middleware/auth';
import { optionalAuth } from '../middleware/auth';

function requireUser(user: AuthUser | null): AuthUser {
	if (!user) throw new UnauthorizedError();
	return user;
}

interface VendorCursor {
	createdAt: string;
	id: string;
}

/**
 * Cursor pagination, bukan offset — offset jadi lambat begitu tabel vendor
 * besar (perlu skip N baris tiap request). Cursor-nya pasangan (createdAt, id)
 * supaya tetap stabil walau ada baris baru masuk di antara dua request.
 */
function encodeCursor(row: { createdAt: Date; id: string }): string {
	return Buffer.from(
		JSON.stringify({ createdAt: row.createdAt.toISOString(), id: row.id }),
	).toString('base64url');
}

function decodeCursor(raw: string | undefined): VendorCursor | null {
	if (!raw) return null;
	try {
		const parsed: unknown = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
		if (
			typeof parsed === 'object' &&
			parsed !== null &&
			typeof (parsed as VendorCursor).createdAt === 'string' &&
			typeof (parsed as VendorCursor).id === 'string'
		) {
			return parsed as VendorCursor;
		}
	} catch {
		// cursor rusak/di-tempering — perlakukan seperti tidak ada cursor sama sekali
	}
	return null;
}

const listVendorsQuerySchema = z.object({
	category: z.enum(VENDOR_CATEGORIES).optional(),
	city: z.string().trim().min(1).optional(),
	priceMin: z.coerce.number().int().min(0).optional(),
	priceMax: z.coerce.number().int().min(0).optional(),
	cursor: z.string().optional(),
	limit: z.coerce.number().int().min(1).max(50).default(20),
});

const vendorInputSchema = z.object({
	name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(150),
	category: z.enum(VENDOR_CATEGORIES),
	description: z.string().trim().max(2000).optional(),
	priceMin: z.number().int().min(0),
	priceMax: z.number().int().min(0),
	images: z.array(z.string().url()).max(20).optional(),
	city: z.string().trim().max(100).optional(),
	phone: z.string().trim().max(20).optional(),
});

async function assertVendorOwnership(vendorId: string, userId: string) {
	const [vendor] = await db.select().from(vendors).where(eq(vendors.id, vendorId)).limit(1);
	if (!vendor) throw new NotFoundError('Vendor tidak ditemukan');
	if (vendor.ownerId !== userId) throw new ForbiddenError();
	return vendor;
}

export const vendorsRoutes = new Hono<{ Variables: { user: AuthUser | null } }>();

vendorsRoutes.use('*', optionalAuth);

vendorsRoutes.get('/', async (c) => {
	const query = listVendorsQuerySchema.parse(Object.fromEntries(new URL(c.req.url).searchParams));
	const cursor = decodeCursor(query.cursor);

	const conditions = [eq(vendors.isActive, true)];
	if (query.category) conditions.push(eq(vendors.category, query.category));
	if (query.city) conditions.push(ilike(vendors.city, `%${query.city}%`));
	// Filter rentang harga: vendor dianggap cocok kalau rentang harganya beririsan
	// dengan rentang yang dicari, bukan harus sama persis.
	if (query.priceMin !== undefined) conditions.push(gte(vendors.priceMax, query.priceMin));
	if (query.priceMax !== undefined) conditions.push(lte(vendors.priceMin, query.priceMax));
	if (cursor) {
		conditions.push(
			sql`(${vendors.createdAt}, ${vendors.id}) < (${cursor.createdAt}::timestamptz, ${cursor.id})`,
		);
	}

	const rows = await db
		.select()
		.from(vendors)
		.where(and(...conditions))
		.orderBy(sql`${vendors.createdAt} desc`, sql`${vendors.id} desc`)
		.limit(query.limit);

	const last = rows[rows.length - 1];
	const nextCursor = rows.length === query.limit && last ? encodeCursor(last) : null;

	return ok(c, { items: rows, nextCursor });
});

vendorsRoutes.get('/:slug', async (c) => {
	const slug = c.req.param('slug');
	const [vendor] = await db
		.select()
		.from(vendors)
		.where(and(eq(vendors.slug, slug), eq(vendors.isActive, true)))
		.limit(1);
	if (!vendor) throw new NotFoundError('Vendor tidak ditemukan');
	return ok(c, vendor);
});

vendorsRoutes.post('/', async (c) => {
	const user = requireUser(c.get('user'));
	const input = vendorInputSchema.parse(await c.req.json());

	const existing = await db.select({ slug: vendors.slug }).from(vendors);
	const slug = generateUniqueSlug(
		input.name,
		existing.map((row) => row.slug),
	);

	const [vendor] = await db
		.insert(vendors)
		.values({ ownerId: user.id, slug, ...input })
		.returning();

	return ok(c, vendor, 201);
});

vendorsRoutes.patch('/:id', async (c) => {
	const user = requireUser(c.get('user'));
	const id = c.req.param('id');
	await assertVendorOwnership(id, user.id);

	const input = vendorInputSchema.partial().parse(await c.req.json());
	const [updated] = await db
		.update(vendors)
		.set({ ...input, updatedAt: new Date() })
		.where(eq(vendors.id, id))
		.returning();

	return ok(c, updated);
});

vendorsRoutes.delete('/:id', async (c) => {
	const user = requireUser(c.get('user'));
	const id = c.req.param('id');
	await assertVendorOwnership(id, user.id);

	await db.delete(vendors).where(eq(vendors.id, id));
	return ok(c, { id });
});
