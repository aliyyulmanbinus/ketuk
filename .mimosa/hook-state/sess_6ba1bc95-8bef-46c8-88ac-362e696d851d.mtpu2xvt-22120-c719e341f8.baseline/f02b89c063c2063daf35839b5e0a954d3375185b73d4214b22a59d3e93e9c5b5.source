import type { MiddlewareHandler } from 'hono';
import { UnauthorizedError } from '../lib/errors';
import { supabaseAdmin } from '../lib/supabase';

export interface AuthUser {
	id: string;
	email: string | null;
}

async function resolveUser(authHeader: string | undefined): Promise<AuthUser | null> {
	if (!authHeader?.startsWith('Bearer ')) return null;

	const token = authHeader.slice('Bearer '.length).trim();
	if (!token) return null;

	const { data, error } = await supabaseAdmin.auth.getUser(token);
	if (error || !data.user) return null;

	return { id: data.user.id, email: data.user.email ?? null };
}

/** Menolak request tanpa token valid dengan 401 sebelum handler jalan. */
export const requireAuth: MiddlewareHandler<{ Variables: { user: AuthUser } }> = async (
	c,
	next,
) => {
	const user = await resolveUser(c.req.header('Authorization'));
	if (!user) {
		throw new UnauthorizedError('Token tidak valid atau sudah kedaluwarsa');
	}
	c.set('user', user);
	await next();
};

/** Meneruskan request tanpa token — `user` bisa null, dipakai endpoint publik yang punya perilaku beda kalau login. */
export const optionalAuth: MiddlewareHandler<{ Variables: { user: AuthUser | null } }> = async (
	c,
	next,
) => {
	const user = await resolveUser(c.req.header('Authorization'));
	c.set('user', user);
	await next();
};
