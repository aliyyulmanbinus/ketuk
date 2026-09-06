export type PaymentStatus = 'pending' | 'paid' | 'expired' | 'failed' | 'refunded';

/**
 * Transaksi pembayaran lewat Duitku. Satu baris bisa merepresentasikan pembayaran
 * untuk pembelian plan event maupun gift order — dibedakan lewat referensi terpisah
 * di tabel yang memilikinya, bukan di sini, supaya tipe ini tetap generik untuk semua jenis transaksi.
 */
export interface PaymentTransaction {
	id: string;
	/** ID unik yang dikirim ke Duitku, harus unik di sisi kita sendiri. */
	merchantOrderId: string;
	/** Reference ID dari Duitku, null sebelum transaksi berhasil dibuat di sisi mereka. */
	reference: string | null;
	/** Rupiah utuh sebagai integer — jangan pakai float, presisi pecahan tidak dibutuhkan dan bikin bug. */
	amount: number;
	/** Kode metode pembayaran Duitku, lihat constants/payment-methods.ts. */
	paymentMethod: string;
	status: PaymentStatus;
	/** URL redirect untuk metode yang butuh halaman pembayaran (mis. e-wallet), null untuk VA/QRIS statis. */
	paymentUrl: string | null;
	/** Nomor virtual account, null kalau metodenya bukan VA. */
	vaNumber: string | null;
	/** String mentah untuk digenerate jadi QR code, null kalau metodenya bukan QRIS. */
	qrString: string | null;
	/** ISO 8601 — kapan transaksi ini kedaluwarsa kalau belum dibayar. */
	expiredAt: string | null;
	createdAt: string;
}
