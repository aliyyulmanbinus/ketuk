import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { giftOrders, payments } from '../db/schema';
import { verifyCallbackSignature } from '../services/duitku';

// TODO: verifikasi nama-nama field callback ini persis dengan dokumentasi resmi
// Duitku (docs.duitku.com) — `.passthrough()` sengaja dipakai supaya field lain
// yang belum kita ketahui tidak bikin request ditolak, tapi field yang dipakai
// untuk verifikasi signature & update status harus tetap divalidasi ada.
const duitkuCallbackSchema = z
	.object({
		merchantCode: z.string(),
		amount: z.string(),
		merchantOrderId: z.string(),
		productDetail: z.string().optional(),
		paymentCode: z.string(),
		resultCode: z.string(),
		reference: z.string(),
		signature: z.string(),
	})
	.passthrough();

export const webhooksRoutes = new Hono();

/**
 * Alur wajib: (1) verifikasi signature dulu sebelum apa pun diproses — ini
 * vektor serangan langsung ke sistem pembayaran; (2) simpan payload mentah
 * apa adanya untuk audit; (3) cek idempoten (kalau sudah `paid`, jangan
 * diproses ulang — Duitku bisa kirim callback yang sama dua kali dan tanpa
 * pengecekan ini gift order bisa terkirim dua kali); (4) balas 200 cepat,
 * baru jalankan efek samping (update status order) tanpa membuat Duitku menunggu.
 */
webhooksRoutes.post('/duitku', async (c) => {
	const body: unknown = await c.req.json();
	const parsed = duitkuCallbackSchema.safeParse(body);

	if (!parsed.success) {
		console.error(
			'[webhooks/duitku] Payload callback tidak sesuai bentuk yang diharapkan',
			parsed.error.flatten(),
		);
		return c.text('Bad request', 400);
	}

	const payload = parsed.data;

	if (!verifyCallbackSignature(payload)) {
		console.error('[webhooks/duitku] Signature tidak valid, callback ditolak', {
			merchantOrderId: payload.merchantOrderId,
		});
		return c.text('Invalid signature', 400);
	}

	const [existing] = await db
		.select()
		.from(payments)
		.where(eq(payments.merchantOrderId, payload.merchantOrderId))
		.limit(1);

	if (!existing) {
		console.error('[webhooks/duitku] merchantOrderId tidak dikenal:', payload.merchantOrderId);
		// Tetap balas 200 — kalau balas error, Duitku akan terus retry untuk
		// order yang memang tidak pernah ada di sisi kita.
		return c.text('OK', 200);
	}

	if (existing.status === 'paid') {
		return c.text('OK', 200);
	}

	const newStatus = payload.resultCode === '00' ? 'paid' : 'failed';

	await db
		.update(payments)
		.set({ status: newStatus, rawCallback: payload, updatedAt: new Date() })
		.where(eq(payments.id, existing.id));

	// Balas cepat dulu; efek samping (update status gift order, notifikasi)
	// dijalankan tanpa di-await supaya Duitku tidak menunggu pekerjaan berat ini.
	void applyPaymentSideEffects(existing.id, newStatus).catch((err: unknown) => {
		console.error('[webhooks/duitku] Gagal memproses efek samping pembayaran', err);
	});

	return c.text('OK', 200);
});

async function applyPaymentSideEffects(paymentId: string, status: 'paid' | 'failed') {
	await db
		.update(giftOrders)
		.set({ status: status === 'paid' ? 'processing' : 'cancelled' })
		.where(eq(giftOrders.paymentId, paymentId));

	// TODO: kirim notifikasi WhatsApp/email ke host & vendor saat status === 'paid'.
}
