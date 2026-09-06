export type PaymentMethodType = 'qris' | 'va' | 'ewallet';

export interface PaymentMethodConfig {
	/** Kode resmi dari dokumentasi Duitku, dikirim sebagai paymentMethod saat create transaction. */
	code: string;
	label: string;
	type: PaymentMethodType;
	/** Path ke asset logo, boleh placeholder sampai asset final tersedia. */
	logo: string;
}

// TODO: verifikasi seluruh kode berikut dengan dokumentasi resmi Duitku (docs.duitku.com)
// sebelum dipakai untuk request createTransaction — kode di bawah adalah dugaan
// berdasarkan konvensi umum Duitku, bukan hasil pengecekan langsung ke dokumentasi.
export const PAYMENT_METHODS: PaymentMethodConfig[] = [
	{ code: 'SP', label: 'QRIS', type: 'qris', logo: '/images/payment/qris.svg' },
	{ code: 'BC', label: 'BCA Virtual Account', type: 'va', logo: '/images/payment/bca-va.svg' },
	{ code: 'I1', label: 'BNI Virtual Account', type: 'va', logo: '/images/payment/bni-va.svg' },
	{ code: 'BR', label: 'BRI Virtual Account', type: 'va', logo: '/images/payment/bri-va.svg' },
	{
		code: 'M2',
		label: 'Mandiri Virtual Account',
		type: 'va',
		logo: '/images/payment/mandiri-va.svg',
	},
	{
		code: 'BT',
		label: 'Permata Virtual Account',
		type: 'va',
		logo: '/images/payment/permata-va.svg',
	},
	{ code: 'OV', label: 'OVO', type: 'ewallet', logo: '/images/payment/ovo.svg' },
	{ code: 'SA', label: 'ShopeePay', type: 'ewallet', logo: '/images/payment/shopeepay.svg' },
	{ code: 'DA', label: 'DANA', type: 'ewallet', logo: '/images/payment/dana.svg' },
];
