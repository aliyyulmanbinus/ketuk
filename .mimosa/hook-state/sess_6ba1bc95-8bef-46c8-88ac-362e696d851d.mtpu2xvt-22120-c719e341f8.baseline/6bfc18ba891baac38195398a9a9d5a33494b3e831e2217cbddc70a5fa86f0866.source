import { env } from '../env';

/**
 * Purge cache Cloudflare untuk path tertentu — dipanggil setelah update invitation
 * atau publish event, supaya perubahan langsung terlihat meski halaman undangan
 * di-cache agresif di edge (lihat docs/ARCHITECTURE.md).
 *
 * No-op kalau env Cloudflare tidak diisi, bukan error — supaya development lokal
 * (yang biasanya tidak punya akses Cloudflare) tidak terganggu.
 */
export async function purgeCloudflareCache(paths: string[]): Promise<void> {
	if (!env.CLOUDFLARE_ZONE_ID || !env.CLOUDFLARE_API_TOKEN) {
		console.warn(
			'[cache] CLOUDFLARE_ZONE_ID/CLOUDFLARE_API_TOKEN tidak diisi, purge cache dilewati (no-op).',
		);
		return;
	}

	const urls = paths.map((path) => `${env.PUBLIC_APP_URL}${path}`);

	const response = await fetch(
		`https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/purge_cache`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ files: urls }),
		},
	);

	if (!response.ok) {
		// Gagal purge cache bukan alasan untuk gagalkan operasi utama (mis. publish event) —
		// cukup di-log, cache akan expire sendiri sesuai TTL kalau purge manual ini gagal.
		console.error(`[cache] Gagal purge Cloudflare cache: HTTP ${response.status}`);
	}
}
