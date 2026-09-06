import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { events } from './events';
import { guests } from './guests';

/**
 * Ucapan di feed publik undangan. Sengaja tabel terpisah dari `guests.message`
 * (RSVP) — siapa saja boleh menulis ucapan lewat form terbuka meski bukan tamu
 * yang terdaftar di link personal, ini "buku tamu", bukan respons RSVP.
 */
export const wishes = pgTable(
	'wishes',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		eventId: uuid('event_id')
			.notNull()
			.references(() => events.id, { onDelete: 'cascade' }),
		// Null kalau ucapan dikirim lewat form umum, terisi kalau lewat link personal tamu.
		guestId: uuid('guest_id').references(() => guests.id, { onDelete: 'set null' }),
		name: text('name').notNull(),
		message: text('message').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		// Untuk feed ucapan terurut terbaru dulu.
		index('wishes_event_id_created_at_idx').on(table.eventId, table.createdAt.desc()),
	],
);
