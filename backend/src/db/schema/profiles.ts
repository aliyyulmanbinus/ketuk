import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { authUsers } from './_supabase-auth';

/**
 * Profil aplikasi yang melengkapi `auth.users`. `id` sengaja sama dengan
 * `auth.users.id` (relasi satu-ke-satu), bukan primary key sendiri.
 */
export const profiles = pgTable('profiles', {
	id: uuid('id')
		.primaryKey()
		.references(() => authUsers.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	phone: text('phone'),
	avatarUrl: text('avatar_url'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
