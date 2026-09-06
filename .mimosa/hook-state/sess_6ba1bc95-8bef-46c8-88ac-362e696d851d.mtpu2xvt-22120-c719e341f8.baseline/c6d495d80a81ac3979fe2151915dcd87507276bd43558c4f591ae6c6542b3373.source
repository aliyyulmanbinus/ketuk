export const VENDOR_CATEGORIES = [
	'katering',
	'dekorasi',
	'fotografi',
	'videografi',
	'florist',
	'kue',
	'souvenir',
	'wo',
	'mc',
	'hiburan',
	'mua',
	'venue',
	'cetak_undangan',
	'busana',
	'transportasi',
] as const;

export type VendorCategory = (typeof VENDOR_CATEGORIES)[number];

/** Penyedia jasa/produk di marketplace modul Vendor. */
export interface Vendor {
	id: string;
	ownerId: string;
	name: string;
	category: VendorCategory;
	description: string | null;
	/** Rupiah utuh sebagai integer — batas bawah rentang harga yang ditawarkan vendor. */
	priceMin: number;
	/** Rupiah utuh sebagai integer — batas atas rentang harga yang ditawarkan vendor. */
	priceMax: number;
	/** Rata-rata rating 0–5, boleh pecahan (mis. 4.8) — ini bukan nilai uang jadi float aman dipakai. */
	rating: number;
	reviewCount: number;
	/** True kalau tim Ketuk.id sudah verifikasi legalitas/kualitas vendor secara manual. */
	isVerified: boolean;
	images: string[];
	city: string | null;
	phone: string | null;
	createdAt: string;
}
