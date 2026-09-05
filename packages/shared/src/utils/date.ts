const JAKARTA_TIMEZONE = 'Asia/Jakarta';

/** Format tanggal acara jadi bentuk panjang berbahasa Indonesia, mis. "Sabtu, 15 Maret 2027". */
export function formatEventDate(iso: string): string {
	return new Intl.DateTimeFormat('id-ID', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: JAKARTA_TIMEZONE,
	}).format(new Date(iso));
}

/**
 * Format jam acara, mis. "14:00" -> "14.00 WIB". Input berupa string jam lokal
 * venue (bukan timestamp), jadi tidak ada konversi timezone di sini — venue di luar
 * Jakarta tetap ditampilkan sesuai jam yang diinput host, dengan label WIB sebagai
 * konvensi produk untuk saat ini.
 */
export function formatEventTime(time: string): string {
	const [hour, minute] = time.split(':');
	return `${hour}.${minute} WIB`;
}

export interface Countdown {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	isPast: boolean;
}

/**
 * Hitung mundur ke tanggal ISO tertentu. `isPast` jadi true begitu waktunya lewat,
 * supaya UI bisa ganti tampilan dari "countdown" ke "acara sudah berlangsung"
 * tanpa harus menangani angka negatif yang membingungkan.
 */
export function getCountdown(iso: string): Countdown {
	const target = new Date(iso).getTime();
	const now = Date.now();
	const diff = target - now;

	if (diff <= 0) {
		return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
	}

	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
	const minutes = Math.floor((diff / (1000 * 60)) % 60);
	const seconds = Math.floor((diff / 1000) % 60);

	return { days, hours, minutes, seconds, isPast: false };
}
