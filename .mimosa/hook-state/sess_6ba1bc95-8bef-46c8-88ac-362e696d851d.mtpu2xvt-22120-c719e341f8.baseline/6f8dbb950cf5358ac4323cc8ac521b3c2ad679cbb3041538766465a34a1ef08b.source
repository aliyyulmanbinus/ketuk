import type { CreateGiftOrderInput } from '@ketuk/shared';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { events, giftOrders, giftProducts, payments } from '../db/schema';
import { NotFoundError, ValidationError } from '../lib/errors';
import { createTransaction } from './duitku';

export interface CreateGiftOrderParams extends CreateGiftOrderInput {
	paymentMethod: string;
}

/**
 * Alur: validasi event & produk -> hitung total dari harga produk di database
 * (bukan dari request) -> simpan order berstatus `pending` -> buat transaksi
 * Duitku -> simpan hasilnya sebagai baris `payments` -> tautkan balik ke order.
 *
 * Kalau `createTransaction` melempar error di tengah jalan, order tetap
 * tersimpan berstatus `pending` tanpa `paymentId` — ini disengaja supaya
 * pengirim bisa retry pembayaran untuk order yang sama alih-alih membuat
 * order duplikat, dan tim bisa investigasi order yang "nyangkut" tanpa pembayaran.
 */
export async function createGiftOrder(eventSlug: string, input: CreateGiftOrderParams) {
	const [event] = await db.select().from(events).where(eq(events.slug, eventSlug)).limit(1);
	if (!event?.isPublished) {
		throw new NotFoundError('Event tidak ditemukan');
	}

	const [product] = await db
		.select()
		.from(giftProducts)
		.where(eq(giftProducts.id, input.productId))
		.limit(1);

	if (!product?.isAvailable) {
		throw new ValidationError('Produk tidak tersedia');
	}

	// Uang tidak boleh dipercayakan ke client — total selalu dihitung ulang di
	// server dari harga produk yang tersimpan di database, bukan dari request body.
	const totalAmount = product.price * input.quantity;

	const [order] = await db
		.insert(giftOrders)
		.values({
			eventId: event.id,
			productId: product.id,
			senderName: input.senderName,
			senderPhone: input.senderPhone,
			recipientName: input.recipientName,
			recipientAddress: input.recipientAddress,
			quantity: input.quantity,
			totalAmount,
			message: input.message,
		})
		.returning();

	if (!order) {
		throw new ValidationError('Gagal membuat order hadiah');
	}

	const merchantOrderId = `GIFT-${order.id}`;

	const duitkuTransaction = await createTransaction({
		merchantOrderId,
		amount: totalAmount,
		productDetails: `${product.name} x${input.quantity}`,
		paymentMethod: input.paymentMethod,
		customerName: input.senderName,
		customerPhone: input.senderPhone,
	});

	const [payment] = await db
		.insert(payments)
		.values({
			merchantOrderId,
			reference: duitkuTransaction.reference,
			amount: totalAmount,
			paymentMethod: input.paymentMethod,
			paymentUrl: duitkuTransaction.paymentUrl,
			vaNumber: duitkuTransaction.vaNumber,
			qrString: duitkuTransaction.qrString,
		})
		.returning();

	if (!payment) {
		throw new ValidationError('Gagal membuat transaksi pembayaran');
	}

	await db.update(giftOrders).set({ paymentId: payment.id }).where(eq(giftOrders.id, order.id));

	return { order: { ...order, paymentId: payment.id }, payment };
}
