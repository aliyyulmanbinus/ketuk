import { createPaymentSchema } from '@ketuk/shared';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { db } from '../db';
import { payments } from '../db/schema';
import { NotFoundError } from '../lib/errors';
import { ok } from '../lib/response';
import type { AuthUser } from '../middleware/auth';
import { requireAuth } from '../middleware/auth';
import { createTransaction } from '../services/duitku';

export const paymentsRoutes = new Hono<{ Variables: { user: AuthUser } }>();

paymentsRoutes.use('*', requireAuth);

/**
 * Untuk pembayaran yang tidak lewat gift order (mis. upgrade paket event) —
 * order hadiah punya alurnya sendiri lewat services/gift-order.ts karena
 * pengirimnya tidak perlu login.
 */
paymentsRoutes.post('/', async (c) => {
	const user = c.get('user');
	const input = createPaymentSchema.parse(await c.req.json());

	const merchantOrderId = `PLAN-${user.id.slice(0, 8)}-${Date.now()}`;

	const transaction = await createTransaction({
		merchantOrderId,
		amount: input.amount,
		productDetails: 'Upgrade paket Ketuk.id',
		paymentMethod: input.paymentMethod,
		customerName: input.customerName,
		customerEmail: input.customerEmail,
	});

	const [payment] = await db
		.insert(payments)
		.values({
			merchantOrderId,
			reference: transaction.reference,
			amount: input.amount,
			paymentMethod: input.paymentMethod,
			paymentUrl: transaction.paymentUrl,
			vaNumber: transaction.vaNumber,
			qrString: transaction.qrString,
		})
		.returning();

	return ok(c, payment, 201);
});

/**
 * Status dibaca dari salinan lokal (diupdate oleh webhook Duitku), bukan
 * ditanyakan langsung ke Duitku setiap request — lebih cepat dan tidak
 * menambah beban ke API mereka. Kalau butuh cross-check manual, pakai
 * services/duitku.ts#checkTransactionStatus lewat tooling terpisah.
 */
paymentsRoutes.get('/:merchantOrderId', async (c) => {
	const merchantOrderId = c.req.param('merchantOrderId');
	const [payment] = await db
		.select()
		.from(payments)
		.where(eq(payments.merchantOrderId, merchantOrderId))
		.limit(1);

	if (!payment) throw new NotFoundError('Transaksi tidak ditemukan');
	return ok(c, payment);
});
