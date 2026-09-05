import { createClient } from '@supabase/supabase-js';
import { env } from '../env';

/**
 * Client dengan service role key — melewati RLS sepenuhnya. Hanya dipakai untuk:
 * memverifikasi JWT user (auth.getUser), dan operasi yang memang butuh privilese
 * penuh (webhook Duitku, proses order hadiah). Tidak pernah diekspos ke response
 * atau dipakai untuk query yang seharusnya tunduk ke RLS.
 */
export const supabaseAdmin = createClient(env.PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
});
