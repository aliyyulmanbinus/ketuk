import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const paymentStatusEnum = pgEnum('payment_status', [
	'pending',
	'paid',
	'expired',
	'failed',
	'refunded',
]);

export const payments = pgTable('payments', {
	id: uuid('id').primaryKey().defaultRandom(),
	// unique() di bawah sekaligus jadi index yang dipakai saat callback Duitku masuk.
	merchantOrderId: text('merchant_order_id').notNull().unique(),
	reference: text('reference'),
	// Rupiah utuh sebagai integer — jangan pakai float, presisi pecahan tidak dibutuhkan dan bikin bug.
	amount: integer('amount').notNull(),
	paymentMethod: text('payment_method').notNull(),
	status: paymentStatusEnum('status').notNull().default('pending'),
	paymentUrl: text('payment_url'),
	vaNumber: text('va_number'),
	qrString: text('qr_string'),
	expiredAt: timestamp('expired_at', { withTimezone: true }),
	// Payload mentah callback Duitku, disimpan sebelum diproses — satu-satunya
	// sumber kebenaran kalau ada sengketa atau bug di parsing.
	rawCallback: jsonb('raw_callback').$type<unknown>(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
