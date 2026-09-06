import type { MiddlewareHandler } from 'hono';
import { AppError } from '../lib/errors';

/**
 * Abstraksi store supaya implementasi in-memory di bawah gampang diganti Redis
 * nanti tanpa menyentuh middleware-nya — cukup buat class baru yang implement ini.
 */
export interface RateLimitStore {
	/** Tambah hit untuk `key`, kembalikan jumlah hit dalam window berjalan. */
	increment(key: string, windowMs: number): number;
}

class InMemoryRateLimitStore implements RateLimitStore {
	private readonly hits = new Map<string, { count: number; resetAt: number }>();

	increment(key: string, windowMs: number): number {
		const now = Date.now();
		const entry = this.hits.get(key);

		if (!entry || entry.resetAt <= now) {
			this.hits.set(key, { count: 1, resetAt: now + windowMs });
			return 1;
		}

		entry.count += 1;
		return entry.count;
	}
}

// Satu instance dibagi seluruh middleware yang dibuat dari factory ini —
// cukup untuk single-process deployment sekarang. Kalau backend nanti scale
// ke banyak instance, ganti jadi RedisRateLimitStore lewat parameter `store`.
const defaultStore = new InMemoryRateLimitStore();

interface RateLimitOptions {
	windowMs: number;
	max: number;
	store?: RateLimitStore;
}

function getClientIp(headers: Headers): string {
	const forwardedFor = headers.get('x-forwarded-for');
	if (forwardedFor) return forwardedFor.split(',')[0]?.trim() ?? 'unknown';
	return headers.get('x-real-ip') ?? 'unknown';
}

export function rateLimit({
	windowMs,
	max,
	store = defaultStore,
}: RateLimitOptions): MiddlewareHandler {
	return async (c, next) => {
		const ip = getClientIp(c.req.raw.headers);
		const key = `${c.req.path}:${ip}`;
		const count = store.increment(key, windowMs);

		if (count > max) {
			throw new AppError('Terlalu banyak permintaan, coba lagi sebentar lagi', 429, 'RATE_LIMITED');
		}

		await next();
	};
}

/** 10 request/menit per IP — untuk RSVP dan kirim ucapan. */
export const publicWriteRateLimit = rateLimit({ windowMs: 60_000, max: 10 });

/** 5 request/menit per IP — untuk pembuatan order (gift order, transaksi pembayaran). */
export const orderRateLimit = rateLimit({ windowMs: 60_000, max: 5 });
