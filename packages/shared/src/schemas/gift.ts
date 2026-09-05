import { z } from 'zod';

/**
 * Normalisasi nomor HP Indonesia ke satu format tunggal (62xxxxxxxxxx, tanpa "+"
 * dan tanpa "0" di depan). Dipakai sebagai titik normalisasi tunggal supaya
 * "08123..." dan "+62812..." yang sebenarnya sama tidak dianggap dua nomor berbeda.
 */
export function normalizeIndonesianPhone(phone: string): string {
	const digitsAndPlus = phone.replace(/[^\d+]/g, '');
	if (digitsAndPlus.startsWith('+62')) return digitsAndPlus.slice(1);
	if (digitsAndPlus.startsWith('62')) return digitsAndPlus;
	if (digitsAndPlus.startsWith('0')) return `62${digitsAndPlus.slice(1)}`;
	return digitsAndPlus;
}

const indonesianPhoneSchema = z
	.string()
	.trim()
	.regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, 'Nomor HP tidak valid')
	.transform(normalizeIndonesianPhone);

export const createGiftOrderSchema = z.object({
	productId: z.string().min(1, 'Produk wajib dipilih'),
	senderName: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100),
	senderPhone: indonesianPhoneSchema,
	recipientName: z.string().trim().min(2, 'Nama penerima minimal 2 karakter').max(100),
	/** Minimal 10 karakter — cukup untuk menolak alamat kosong/asal tanpa memaksakan format tertentu. */
	recipientAddress: z.string().trim().min(10, 'Alamat terlalu singkat').max(500),
	quantity: z.number().int().min(1, 'Minimal 1 item').max(50, 'Maksimal 50 item per order'),
	message: z.string().trim().max(300).optional(),
});

export type CreateGiftOrderInput = z.infer<typeof createGiftOrderSchema>;
