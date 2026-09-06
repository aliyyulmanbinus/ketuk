import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

/**
 * AppError.statusCode disimpan sebagai `number` biasa (bukan union literal Hono),
 * cast tunggal di sini. Semua response kita selalu punya body JSON, jadi
 * `ContentfulStatusCode` (bukan `StatusCode` yang juga mencakup 204/304 tanpa body).
 */
function asStatusCode(status: number): ContentfulStatusCode {
	return status as ContentfulStatusCode;
}

export interface SuccessResponse<T> {
	success: true;
	data: T;
}

export interface ErrorResponse {
	success: false;
	error: {
		code: string;
		message: string;
		details?: unknown;
	};
}

/**
 * Satu-satunya cara handler boleh membalas sukses — supaya bentuk response
 * konsisten di seluruh API dan tidak ada yang menulis `{ data: ... }` manual.
 */
export function ok<T>(c: Context, data: T, status: number = 200) {
	const body: SuccessResponse<T> = { success: true, data };
	return c.json(body, asStatusCode(status));
}

/** Dipakai langsung oleh middleware/error.ts. Handler biasanya cukup `throw` AppError. */
export function fail(
	c: Context,
	code: string,
	message: string,
	status: number = 400,
	details?: unknown,
) {
	const body: ErrorResponse = { success: false, error: { code, message, details } };
	return c.json(body, asStatusCode(status));
}
