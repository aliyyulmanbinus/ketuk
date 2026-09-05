/**
 * Ubah teks bebas jadi slug URL-safe, mis. "Budi & Sinta" -> "budi-sinta".
 * Normalisasi Unicode (NFKD) dijalankan dulu untuk melepas diakritik (mis. "é" -> "e")
 * sebelum karakter non-ASCII dibuang, supaya nama dengan aksen tidak hilang total.
 */
export function generateSlug(text: string): string {
	return text
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/**
 * Tambahkan sufiks angka kalau slug dasar sudah dipakai, mis. "budi-sinta-2".
 * Dipakai saat event baru dibuat supaya slug tetap unik tanpa host perlu memikirkannya sendiri.
 */
export function generateUniqueSlug(base: string, existingSlugs: readonly string[]): string {
	const slug = generateSlug(base);
	if (!existingSlugs.includes(slug)) return slug;

	let suffix = 2;
	let candidate = `${slug}-${suffix}`;
	while (existingSlugs.includes(candidate)) {
		suffix += 1;
		candidate = `${slug}-${suffix}`;
	}
	return candidate;
}
