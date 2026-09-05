import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			/** Ambil session dengan aman — memvalidasi JWT ke server Supabase, bukan cuma baca cookie mentah. */
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
		}
		interface PageData {
			/**
			 * Ketiga field ini opsional dengan sengaja — cuma diisi oleh
			 * (auth)/+layout.server.ts dan (app)/+layout.server.ts lewat `$page.data`.
			 * Route (marketing) dan (public) tidak pernah menyentuh session sama
			 * sekali (lihat catatan di hooks.server.ts & laporan tahap ini), jadi
			 * PageData mereka tidak punya field-field ini.
			 */
			session?: Session | null;
			user?: User;
			accessToken?: string;
		}
	}
}
