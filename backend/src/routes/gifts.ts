import { createGiftOrderSchema } from '@ketuk/shared';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { giftCategoryEnum, giftProducts } from '../db/schema';
import { NotFoundError } from '../lib/errors';
import { ok } from '../lib/response';
import { orderRateLimit } from '../middleware/rate-limit';
import { createGiftOrder } from '../services/gift-order';

const listProductsQuerySchema = z.object({
	category: z.enum(giftCategoryEnum.enumValues).optional(),
	limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const giftsRoutes = new Hono();

giftsRoutes.get('/products', async (c) => {
	const query = listProductsQuerySchema.parse(Object.fromEntries(new URL(c.req.url).searchParams));

	const conditions = [eq(giftProducts.isAvailable, true)];
	if (query.category) conditions.push(eq(giftProducts.category, query.category));

	const rows = await db
		.select()
		.from(giftProducts)
		.where(and(...conditions))
		.limit(query.limit);

	return ok(c, rows);
});

giftsRoutes.get('/products/:id', async (c) => {
	const id = c.req.param('id');
	const [product] = await db
		.select()
		.from(giftProducts)
		.where(and(eq(giftProducts.id, id), eq(giftProducts.isAvailable, true)))
		.limit(1);

	if (!product) throw new NotFoundError('Produk tidak ditemukan');
	return ok(c, product);
});

const createOrderBodySchema = createGiftOrderSchema.extend({
	eventSlug: z.string().min(1, 'eventSlug wajib diisi'),
	paymentMethod: z.string().min(1, 'Metode pembayaran wajib dipilih'),
});

/**
 * Publik (pengirim hadiah tidak perlu akun) tapi dibatasi rate limit —
 * ini endpoint yang benar-benar membuat transaksi uang lewat Duitku.
 */
giftsRoutes.post('/orders', orderRateLimit, async (c) => {
	const { eventSlug, ...input } = createOrderBodySchema.parse(await c.req.json());
	const result = await createGiftOrder(eventSlug, input);
	return ok(c, result, 201);
});
