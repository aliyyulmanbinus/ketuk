import { z } from 'zod';

/**
 * Buang tag HTML dasar dari input bebas tamu (nama, ucapan). Ini bukan sanitasi HTML
 * lengkap — hanya jaring pengaman pertama supaya markup mentah tidak ikut tersimpan
 * di database. Output tetap harus di-escape lagi saat dirender di frontend.
 */
function stripHtmlTags(value: string): string {
	return value.replace(/<[^>]*>/g, '');
}

export const rsvpSchema = z.object({
	name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100).transform(stripHtmlTags),
	/**
	 * `pending` sengaja tidak termasuk di sini — itu status default sebelum tamu
	 * merespons, bukan sesuatu yang bisa dikirim tamu lewat form RSVP.
	 */
	status: z.enum(['attending', 'not_attending']),
	/** Jumlah orang yang hadir termasuk tamu itu sendiri, dibatasi wajar 1–10 per link undangan. */
	pax: z.number().int().min(1, 'Minimal 1 orang').max(10, 'Maksimal 10 orang per link'),
	message: z.string().trim().max(500).transform(stripHtmlTags).optional(),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

export const wishSchema = z.object({
	name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100).transform(stripHtmlTags),
	message: z
		.string()
		.trim()
		.min(1, 'Ucapan tidak boleh kosong')
		.max(500, 'Ucapan maksimal 500 karakter')
		.transform(stripHtmlTags),
});

export type WishInput = z.infer<typeof wishSchema>;
