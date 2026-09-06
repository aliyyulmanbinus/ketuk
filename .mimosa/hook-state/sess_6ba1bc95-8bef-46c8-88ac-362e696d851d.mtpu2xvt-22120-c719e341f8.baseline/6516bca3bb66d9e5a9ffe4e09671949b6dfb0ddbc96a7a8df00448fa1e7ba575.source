import { z } from 'zod';

/**
 * Payload untuk memulai transaksi Duitku. `paymentMethod` sengaja divalidasi cuma
 * sebagai string non-kosong di sini — pengecekan kode itu benar-benar terdaftar di
 * constants/payment-methods.ts dilakukan di layer backend, supaya package ini tidak
 * perlu tahu detail integrasi Duitku.
 */
export const createPaymentSchema = z.object({
	/** Rupiah utuh sebagai integer, harus > 0. */
	amount: z.number().int().positive('Jumlah pembayaran harus lebih dari 0'),
	paymentMethod: z.string().min(1, 'Metode pembayaran wajib dipilih'),
	customerName: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100),
	customerEmail: z.string().trim().email('Email tidak valid').optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
