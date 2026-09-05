import { createBrowserClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

/** Client Supabase sisi browser — session-nya disimpan di cookie (via @supabase/ssr), bukan localStorage. */
export function createSupabaseBrowserClient() {
	return createBrowserClient(env.PUBLIC_SUPABASE_URL ?? '', env.PUBLIC_SUPABASE_ANON_KEY ?? '');
}
