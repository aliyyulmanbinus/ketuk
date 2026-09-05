/**
 * Format rupiah utuh dengan pemisah ribuan, mis. 1250000 -> "Rp1.250.000".
 * Input harus rupiah utuh sebagai integer — jangan pakai float atau sen.
 */
export function formatRupiah(amount: number): string {
	const formatted = new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
	// ICU menyisipkan non-breaking space antara "Rp" dan angka di sebagian environment —
	// dibuang supaya hasilnya konsisten "Rp1.250.000" tanpa spasi di semua runtime.
	return formatted.replace(/\s/g, '');
}

/** Format angka dengan pembulatan 2 desimal ala id-ID (koma sebagai pemisah desimal). */
function formatCompactNumber(value: number): string {
	return new Intl.NumberFormat('id-ID', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(value);
}

/**
 * Format rupiah ringkas untuk tampilan padat (mis. kartu ringkasan budget),
 * mis. 1250000 -> "Rp1,25jt". Ambang batas sengaja pakai istilah lokal
 * (rb/jt/M) alih-alih notasi kompak bawaan Intl yang formatnya bahasa Inggris.
 */
export function formatRupiahShort(amount: number): string {
	const sign = amount < 0 ? '-' : '';
	const abs = Math.abs(amount);

	if (abs >= 1_000_000_000) {
		return `${sign}Rp${formatCompactNumber(abs / 1_000_000_000)}M`;
	}
	if (abs >= 1_000_000) {
		return `${sign}Rp${formatCompactNumber(abs / 1_000_000)}jt`;
	}
	if (abs >= 1_000) {
		return `${sign}Rp${formatCompactNumber(abs / 1_000)}rb`;
	}
	return formatRupiah(amount);
}
