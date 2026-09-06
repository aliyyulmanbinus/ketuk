/** Produk yang bisa dikirim sebagai hadiah ke penyelenggara acara (hampers, bouquet, kue, dll). */
export interface GiftProduct {
	id: string;
	/** Null kalau produk dijual langsung oleh Ketuk.id, bukan vendor pihak ketiga. */
	vendorId: string | null;
	name: string;
	description: string | null;
	/** Rupiah utuh sebagai integer. */
	price: number;
	images: string[];
	category: string;
	isAvailable: boolean;
}

export type GiftOrderStatus =
	| 'pending'
	| 'paid'
	| 'processing'
	| 'shipped'
	| 'delivered'
	| 'cancelled';

/**
 * Satu transaksi kirim hadiah. Sengaja menyimpan snapshot nama/alamat pengirim & penerima
 * di order itu sendiri (bukan hanya referensi ke Guest), karena pengirim gift boleh
 * tidak punya akun sama sekali dan datanya harus tetap utuh meski Guest terkait dihapus.
 */
export interface GiftOrder {
	id: string;
	eventId: string;
	productId: string;
	senderName: string;
	/** Sudah dinormalisasi ke format 62xxxxxxxxxx, lihat normalizeIndonesianPhone di schemas/gift.ts. */
	senderPhone: string;
	recipientName: string;
	recipientAddress: string;
	quantity: number;
	/** Rupiah utuh sebagai integer — total harga produk dikali quantity, belum termasuk ongkir kalau ada. */
	totalAmount: number;
	message: string | null;
	status: GiftOrderStatus;
	createdAt: string;
}
