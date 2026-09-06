import {
	boolean,
	date,
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	time,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';
import { profiles } from './profiles';

export const eventTypeEnum = pgEnum('event_type', [
	'wedding',
	'engagement',
	'birthday',
	'khitanan',
	'aqiqah',
	'reunion',
	'corporate',
	'syukuran',
	'graduation',
	'other',
]);

export const planTypeEnum = pgEnum('plan_type', ['gratis', 'pro', 'lengkap']);

export const events = pgTable(
	'events',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		slug: text('slug').notNull().unique(),
		ownerId: uuid('owner_id')
			.notNull()
			.references(() => profiles.id, { onDelete: 'cascade' }),
		type: eventTypeEnum('type').notNull(),
		title: text('title').notNull(),
		// Nullable secara sengaja — event boleh dibuat sebagai draft tanpa tanggal
		// dulu. Kelengkapan (tanggal + lokasi/venue) baru diwajibkan saat publish,
		// lihat services/event.ts.
		date: date('date'),
		timeStart: time('time_start'),
		timeEnd: time('time_end'),
		venue: text('venue'),
		location: text('location'),
		locationUrl: text('location_url'),
		coverImage: text('cover_image'),
		plan: planTypeEnum('plan').notNull().default('gratis'),
		isPublished: boolean('is_published').notNull().default(false),
		// Kapan pertama kali dipublish — bukan bagian dari tipe Event di shared,
		// dibutuhkan database untuk audit/analitik ("kapan event ini live pertama kali").
		publishedAt: timestamp('published_at', { withTimezone: true }),
		// Statistik sederhana untuk host, diupdate lewat fungsi increment_event_view()
		// (SECURITY DEFINER) supaya tidak butuh policy UPDATE publik yang terbuka.
		viewCount: integer('view_count').notNull().default(0),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		// Dipakai di dashboard host untuk daftar event miliknya. Index untuk
		// `slug` sendiri sudah otomatis terbentuk dari `.unique()` di atas —
		// itu yang dipakai setiap load halaman undangan.
		index('events_owner_id_idx').on(table.ownerId),
	],
);
