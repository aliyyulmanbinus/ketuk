import { z } from 'zod';
import { EVENT_TYPES } from '../types/event';

/**
 * Kata-kata yang tidak boleh dipakai sebagai slug event karena bentrok dengan
 * route aplikasi sendiri (mis. ketuk.id/admin akan menabrak dashboard admin,
 * bukan halaman undangan bernama "admin").
 */
export const RESERVED_SLUGS = [
	'app',
	'api',
	'admin',
	'dashboard',
	'undangan',
	'planner',
	'vendor',
	'hadiah',
	'masuk',
	'daftar',
	'keluar',
	'blog',
	'docs',
	'help',
	'support',
	'about',
	'tentang',
	'harga',
	'pricing',
	'www',
	'mail',
	'assets',
	'static',
	'cdn',
] as const;

export const slugSchema = z
	.string()
	.min(3, 'Slug minimal 3 karakter')
	.max(50, 'Slug maksimal 50 karakter')
	.regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung')
	.refine(
		(value) => !(RESERVED_SLUGS as readonly string[]).includes(value),
		'Slug ini dipakai sistem dan tidak bisa digunakan',
	);

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format jam harus HH:mm');

export const createEventSchema = z.object({
	slug: slugSchema,
	type: z.enum(EVENT_TYPES),
	title: z.string().trim().min(3, 'Judul minimal 3 karakter').max(150),
	/** Format YYYY-MM-DD, bukan datetime penuh — jam disimpan terpisah di timeStart/timeEnd. */
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
	timeStart: timeSchema.nullable().optional(),
	timeEnd: timeSchema.nullable().optional(),
	venue: z.string().trim().max(200).nullable().optional(),
	location: z.string().trim().max(300).nullable().optional(),
	locationUrl: z.string().url('URL lokasi tidak valid').nullable().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

/**
 * Update tidak boleh mengganti slug lewat endpoint yang sama seperti create —
 * ganti slug event yang sudah dipublikasikan dan dibagikan berisiko merusak link
 * yang sudah beredar, jadi sengaja dikeluarkan dari skema ini.
 */
export const updateEventSchema = createEventSchema.omit({ slug: true }).partial();

export type UpdateEventInput = z.infer<typeof updateEventSchema>;
