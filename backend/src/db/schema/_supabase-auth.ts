import { pgSchema, uuid } from 'drizzle-orm/pg-core';

/**
 * Referensi ke `auth.users` milik Supabase — tabel ini sudah ada dan dikelola
 * penuh oleh Supabase Auth. Didefinisikan ulang di sini HANYA supaya Drizzle
 * bisa bikin foreign key ke sana dari kode TypeScript kita.
 *
 * File ini SENGAJA tidak di-export lewat schema/index.ts (nama diawali `_`
 * sebagai penanda). drizzle-kit generate memuat schema lewat barrel itu — kalau
 * `authUsers` ikut ter-export di sana, drizzle-kit akan mengira ini tabel yang
 * perlu di-CREATE olehnya, padahal tabelnya sudah ada. Import langsung dari
 * file ini (bukan dari '../schema') kalau butuh referensinya.
 */
const authSchema = pgSchema('auth');

export const authUsers = authSchema.table('users', {
	id: uuid('id').primaryKey(),
});
