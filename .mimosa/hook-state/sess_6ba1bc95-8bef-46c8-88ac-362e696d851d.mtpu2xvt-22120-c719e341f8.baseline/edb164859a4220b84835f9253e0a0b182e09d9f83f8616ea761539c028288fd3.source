import type { LoveStoryItem } from '@ketuk/shared';
import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { events } from './events';

/**
 * Field mempelai (groomName/brideName/...) dan hostName sama-sama nullable di sini —
 * kolomnya cuma boleh punya salah satu terisi, konsisten dengan tipe union
 * WeddingInvitation/GeneralInvitation di @ketuk/shared. Validasi "yang mana yang wajib"
 * dilakukan di layer aplikasi berdasarkan events.type, bukan di database.
 */
export const invitations = pgTable('invitations', {
	id: uuid('id').primaryKey().defaultRandom(),
	eventId: uuid('event_id')
		.notNull()
		.unique()
		.references(() => events.id, { onDelete: 'cascade' }),
	openingText: text('opening_text'),
	closingText: text('closing_text'),
	musicUrl: text('music_url'),
	gallery: jsonb('gallery').$type<string[]>().notNull().default([]),
	loveStory: jsonb('love_story').$type<LoveStoryItem[]>(),
	customData: jsonb('custom_data').$type<Record<string, unknown>>().notNull().default({}),
	groomName: text('groom_name'),
	brideName: text('bride_name'),
	groomParents: text('groom_parents'),
	brideParents: text('bride_parents'),
	hostName: text('host_name'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
