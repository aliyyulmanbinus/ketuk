import { error } from '@sveltejs/kit';
import type { EventWithInvitation } from '$lib/api';
import { getEvent, listGiftProducts } from '$lib/api';
import type { PageServerLoad } from './$types';

/**
 * Halaman paling rawan spike traffic di seluruh produk — setelah host blast
 * link ke grup WhatsApp, ratusan tamu bisa buka dalam hitungan menit.
 * Cache lama di CDN (s-maxage) menyerap lonjakan itu; browser cache pendek
 * (max-age) supaya host sendiri masih lihat perubahan cepat kalau buka ulang.
 *
 * PENTING: load ini tidak boleh menyentuh `locals.safeGetSession()` atau apa
 * pun yang bergantung pada cookie — begitu itu terjadi, response jadi spesifik
 * per pengguna dan tidak aman dibagi lewat cache bersama.
 */
export const load: PageServerLoad = async ({ fetch, params, setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400',
	});

	let event: EventWithInvitation;
	try {
		event = await getEvent(params.slug, { fetch });
	} catch {
		throw error(404, 'Undangan tidak ditemukan');
	}

	if (!event.isPublished) {
		throw error(404, 'Undangan tidak ditemukan');
	}

	const giftProducts = await listGiftProducts(undefined, { fetch }).catch(() => []);

	return { event, giftProducts };
};
