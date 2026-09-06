import { boolean, date, integer, pgTable, text, time, timestamp, uuid } from 'drizzle-orm/pg-core';
import { events } from './events';
import { vendors } from './vendors';

export const budgetItems = pgTable('budget_items', {
	id: uuid('id').primaryKey().defaultRandom(),
	eventId: uuid('event_id')
		.notNull()
		.references(() => events.id, { onDelete: 'cascade' }),
	category: text('category').notNull(),
	name: text('name').notNull(),
	// Rupiah utuh sebagai integer — jangan pakai float, presisi pecahan tidak dibutuhkan dan bikin bug.
	estimated: integer('estimated').notNull(),
	actual: integer('actual'),
	isPaid: boolean('is_paid').notNull().default(false),
	// Vendor dihapus tidak boleh menghilangkan riwayat budget — set null, bukan cascade.
	vendorId: uuid('vendor_id').references(() => vendors.id, { onDelete: 'set null' }),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const checklistItems = pgTable('checklist_items', {
	id: uuid('id').primaryKey().defaultRandom(),
	eventId: uuid('event_id')
		.notNull()
		.references(() => events.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	isDone: boolean('is_done').notNull().default(false),
	dueDate: date('due_date'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const timelineItems = pgTable('timeline_items', {
	id: uuid('id').primaryKey().defaultRandom(),
	eventId: uuid('event_id')
		.notNull()
		.references(() => events.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	// Jam lokal venue di hari-H, bukan timestamp — rundown tidak butuh tanggal.
	time: time('time').notNull(),
	duration: integer('duration'),
	pic: text('pic'),
	notes: text('notes'),
});
