import { z } from 'zod';

/**
 * Semua env var yang dibutuhkan backend, divalidasi sekali saat startup.
 * Kalau ada yang hilang atau salah bentuk, aplikasi gagal langsung dengan pesan
 * jelas — bukan crash belakangan saat request pertama menyentuh kode yang butuh env itu.
 */
const envSchema = z.object({
	PUBLIC_SUPABASE_URL: z.string().url('PUBLIC_SUPABASE_URL harus berupa URL valid'),
	PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'PUBLIC_SUPABASE_ANON_KEY wajib diisi'),
	// Service role key melewati RLS sepenuhnya — hanya boleh dipakai di backend, tidak pernah di response.
	SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY wajib diisi'),
	DATABASE_URL: z.string().min(1, 'DATABASE_URL wajib diisi'),

	DUITKU_MERCHANT_CODE: z.string().min(1, 'DUITKU_MERCHANT_CODE wajib diisi'),
	DUITKU_API_KEY: z.string().min(1, 'DUITKU_API_KEY wajib diisi'),
	DUITKU_ENV: z.enum(['sandbox', 'production']).default('sandbox'),
	DUITKU_CALLBACK_URL: z.string().url('DUITKU_CALLBACK_URL harus berupa URL valid'),
	DUITKU_RETURN_URL: z.string().url('DUITKU_RETURN_URL harus berupa URL valid'),

	PUBLIC_APP_URL: z.string().url('PUBLIC_APP_URL harus berupa URL valid'),
	PUBLIC_API_URL: z.string().url('PUBLIC_API_URL harus berupa URL valid'),
	BACKEND_PORT: z.coerce.number().int().positive().default(3000),
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

	// Opsional — kalau kosong, services/cache.ts jadi no-op (lihat komentar di file itu).
	CLOUDFLARE_ZONE_ID: z.string().optional(),
	CLOUDFLARE_API_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
	const result = envSchema.safeParse(process.env);

	if (!result.success) {
		const missing = result.error.issues
			.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
			.join('\n');
		// Sengaja console.error + exit manual (bukan throw) supaya pesannya jelas
		// terlihat di log startup tanpa tertutup stack trace panjang.
		console.error(`Konfigurasi environment tidak valid, aplikasi tidak bisa jalan:\n${missing}`);
		process.exit(1);
	}

	return result.data;
}

export const env = loadEnv();
