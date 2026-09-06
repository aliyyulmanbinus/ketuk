/**
 * Daftar tipe acara yang didukung. Dijadikan array (bukan cuma union type) supaya
 * bisa dipakai langsung sebagai sumber kebenaran untuk `z.enum()` di schemas/event.ts
 * tanpa duplikasi daftar nilai di dua tempat.
 */
export const EVENT_TYPES = [
	'wedding',
	'engagement',
	'birthday',
	'khitanan',
	'aqiqah',
	'reunion',
	'corporate',
	'syukuran',
	'graduation',
	'other',
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

/**
 * ID paket berlangganan. Harus sinkron dengan `Plan['id']` di constants/plans.ts —
 * dipisah di sini (bukan di-import dari constants) supaya types/ tidak bergantung ke constants/.
 */
export type EventPlan = 'gratis' | 'pro' | 'lengkap';

/**
 * Entitas pusat Ketuk.id. Satu event bisa punya undangan, daftar tamu, budget, dan order hadiah.
 */
export interface Event {
	id: string;
	/** Identitas publik di URL, mis. `ketuk.id/budi-sinta`. Divalidasi lewat slugSchema. */
	slug: string;
	/** ID user (host) pemilik event, merujuk ke User.id / auth.users Supabase. */
	ownerId: string;
	type: EventType;
	title: string;
	/** Tanggal acara, format ISO 8601 (YYYY-MM-DD) — bukan objek Date karena melintasi batas JSON. */
	date: string;
	/** Jam mulai format HH:mm dalam waktu lokal venue, bukan timestamp — venue tidak selalu di WIB. */
	timeStart: string | null;
	timeEnd: string | null;
	venue: string | null;
	location: string | null;
	locationUrl: string | null;
	coverImage: string | null;
	/** Paket yang dibeli untuk event ini — menentukan fitur apa yang aktif, lihat constants/plans.ts. */
	plan: EventPlan;
	isPublished: boolean;
	/** ISO 8601, null selama masih draft. */
	publishedAt: string | null;
	createdAt: string;
	updatedAt: string;
}
