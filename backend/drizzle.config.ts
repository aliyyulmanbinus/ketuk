import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error(
		'DATABASE_URL tidak diset. Isi dulu di .env sebelum menjalankan drizzle-kit — lihat .env.example.',
	);
}

export default defineConfig({
	schema: './src/db/schema/index.ts',
	out: './migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: databaseUrl,
	},
	// `authUsers` di schema/profiles.ts cuma referensi ke `auth.users` milik
	// Supabase (untuk foreign key), bukan tabel yang kita kelola — schemaFilter
	// mencegah drizzle-kit ikut men-generate CREATE TABLE untuk schema `auth`.
	schemaFilter: ['public'],
	strict: true,
	verbose: true,
});
