import { createServerClient } from '@supabase/ssr';
import type { Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

/** Client Supabase sisi server — baca/tulis session lewat cookie request/response SvelteKit. */
export function createSupabaseServerClient(cookies: Cookies) {
	return createServerClient(env.PUBLIC_SUPABASE_URL ?? '', env.PUBLIC_SUPABASE_ANON_KEY ?? '', {
		cookies: {
			getAll: () => cookies.getAll(),
			setAll: (cookiesToSet) => {
				for (const { name, value, options } of cookiesToSet) {
					cookies.set(name, value, { ...options, path: options.path ?? '/' });
				}
			},
		},
	});
}
