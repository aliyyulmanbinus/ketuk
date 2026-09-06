import {
	boolean,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	real,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';
import { profiles } from './profiles';

export const vendorCategoryEnum = pgEnum('vendor_category', [
	'katering',
	'dekorasi',
	'fotografi',
	'videografi',
	'florist',
	'kue',
	'souvenir',
	'wo',
	'mc',
	'hiburan',
	'mua',
	'venue',
	'cetak_undangan',
	'busana',
	'transportasi',
]);

export const vendors = pgTable(
	'vendors',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		// Null kalau vendor di-seed manual oleh admin tanpa akun sendiri. Kalau akun
		// pemiliknya dihapus, listing tetap ada (set null) — bukan ikut terhapus.
		ownerId: uuid('owner_id').references(() => profiles.id, { onDelete: 'set null' }),
		name: text('name').notNull(),
		category: vendorCategoryEnum('category').notNull(),
		description: text('description'),
		// Rupiah utuh sebagai integer — jangan pakai float, presisi pecahan tidak dibutuhkan dan bikin bug.
		priceMin: integer('price_min').notNull(),
		priceMax: integer('price_max').notNull(),
		rating: real('rating').notNull().default(0),
		reviewCount: integer('review_count').notNull().default(0),
		isVerified: boolean('is_verified').notNull().default(false),
		// Kolom tambahan di luar tipe Vendor di @ketuk/shared, dibutuhkan RLS
		// ("publik bisa baca yang is_active") — lihat catatan di laporan tahap ini.
		isActive: boolean('is_active').notNull().default(true),
		images: jsonb('images').$type<string[]>().notNull().default([]),
		// Juga di luar tipe shared — dibutuhkan untuk halaman detail vendor publik.
		slug: text('slug').notNull().unique(),
		city: text('city'),
		phone: text('phone'),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		// Dipakai untuk filter listing marketplace per kategori. Index `slug`
		// sendiri sudah otomatis terbentuk dari `.unique()` di atas.
		index('vendors_category_idx').on(table.category),
	],
);
