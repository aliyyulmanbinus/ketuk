import {
	boolean,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';
import { events } from './events';
import { payments } from './payments';
import { vendors } from './vendors';

/**
 * Tidak ada di @ketuk/shared (GiftProduct.category di sana cuma `string` bebas).
 * Dijadikan enum di database sesuai instruksi tahap ini — daftar kategori dipilih
 * berdasarkan konteks produk (hampers, bouquet, kue, dst), lihat catatan di laporan.
 */
export const giftCategoryEnum = pgEnum('gift_category', [
	'hampers',
	'bouquet',
	'kue',
	'makanan',
	'souvenir',
	'uang_digital',
	'lainnya',
]);

export const orderStatusEnum = pgEnum('order_status', [
	'pending',
	'paid',
	'processing',
	'shipped',
	'delivered',
	'cancelled',
]);

export const giftProducts = pgTable('gift_products', {
	id: uuid('id').primaryKey().defaultRandom(),
	vendorId: uuid('vendor_id').references(() => vendors.id, { onDelete: 'set null' }),
	name: text('name').notNull(),
	description: text('description'),
	// Rupiah utuh sebagai integer — jangan pakai float, presisi pecahan tidak dibutuhkan dan bikin bug.
	price: integer('price').notNull(),
	images: jsonb('images').$type<string[]>().notNull().default([]),
	category: giftCategoryEnum('category').notNull(),
	isAvailable: boolean('is_available').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const giftOrders = pgTable(
	'gift_orders',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		// `restrict`, bukan `cascade` seperti tabel lain milik event — order hadiah
		// adalah catatan finansial. Event yang sudah pernah menerima order tidak
		// boleh dihapus begitu saja sampai order-nya ditangani (arsip/refund) dulu.
		eventId: uuid('event_id')
			.notNull()
			.references(() => events.id, { onDelete: 'restrict' }),
		// Produk dengan riwayat order tidak boleh dihapus, hanya bisa dinonaktifkan
		// lewat isAvailable — histori transaksi tidak boleh kehilangan konteks produknya.
		productId: uuid('product_id')
			.notNull()
			.references(() => giftProducts.id, { onDelete: 'restrict' }),
		senderName: text('sender_name').notNull(),
		// Sudah dinormalisasi ke format 62xxxxxxxxxx oleh normalizeIndonesianPhone di @ketuk/shared.
		senderPhone: text('sender_phone').notNull(),
		recipientName: text('recipient_name').notNull(),
		recipientAddress: text('recipient_address').notNull(),
		quantity: integer('quantity').notNull(),
		// Rupiah utuh sebagai integer, dihitung ulang di server dari harga produk — tidak pernah dipercaya dari client.
		totalAmount: integer('total_amount').notNull(),
		message: text('message'),
		status: orderStatusEnum('status').notNull().default('pending'),
		paymentId: uuid('payment_id').references(() => payments.id, { onDelete: 'set null' }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [index('gift_orders_event_id_idx').on(table.eventId)],
);
