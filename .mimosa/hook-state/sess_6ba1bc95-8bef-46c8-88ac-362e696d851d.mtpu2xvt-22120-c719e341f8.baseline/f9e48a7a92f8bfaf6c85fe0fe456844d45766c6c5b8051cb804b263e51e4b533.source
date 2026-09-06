import {
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from 'drizzle-orm/pg-core';
import { events } from './events';

export const rsvpStatusEnum = pgEnum('rsvp_status', ['pending', 'attending', 'not_attending']);

export const guests = pgTable(
	'guests',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		eventId: uuid('event_id')
			.notNull()
			.references(() => events.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		phone: text('phone'),
		guestGroup: text('guest_group'),
		rsvpStatus: rsvpStatusEnum('rsvp_status').notNull().default('pending'),
		pax: integer('pax').notNull().default(1),
		slug: text('slug').notNull(),
		message: text('message'),
		respondedAt: timestamp('responded_at', { withTimezone: true }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		// Link personal tamu (ketuk.id/{eventSlug}/tamu/{slug}) — slug hanya unik per event.
		unique('guests_event_id_slug_key').on(table.eventId, table.slug),
		// Untuk daftar tamu dan agregasi RSVP per event.
		index('guests_event_id_idx').on(table.eventId),
	],
);
