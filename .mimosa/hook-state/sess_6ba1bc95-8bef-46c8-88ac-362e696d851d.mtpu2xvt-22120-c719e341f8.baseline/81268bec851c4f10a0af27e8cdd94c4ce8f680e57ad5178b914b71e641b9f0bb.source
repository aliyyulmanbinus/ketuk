import type { ErrorHandler } from 'hono';
import { ZodError } from 'zod';
import { env } from '../env';
import { AppError } from '../lib/errors';
import { fail } from '../lib/response';

/**
 * Satu handler error untuk seluruh app (didaftarkan lewat `app.onError`).
 * Tidak pernah membocorkan stack trace atau pesan error database ke client
 * di production — hanya kode dan pesan generik.
 */
export const errorHandler: ErrorHandler = (err, c) => {
	if (err instanceof AppError) {
		if (err.statusCode >= 500) {
			console.error(`[${err.code}]`, err.message, err.details ?? '');
		}
		return fail(c, err.code, err.message, err.statusCode, err.details);
	}

	if (err instanceof ZodError) {
		return fail(c, 'VALIDATION_ERROR', 'Input tidak valid', 400, err.flatten());
	}

	console.error('Unhandled error:', err);

	const message = env.NODE_ENV === 'production' ? 'Terjadi kesalahan pada server' : err.message;
	return fail(c, 'INTERNAL_ERROR', message, 500);
};
