import { env } from '$env/dynamic/public';

// Dynamic (bukan static) env sengaja dipakai di sini — nilainya dibaca saat
// runtime, bukan di-bake ke bundle saat build. Ini penting untuk adapter-node:
// env var bisa diganti saat deploy tanpa perlu build ulang frontend-nya.
const PUBLIC_API_URL = env.PUBLIC_API_URL ?? '';

export interface ApiSuccess<T> {
	success: true;
	data: T;
}

export interface ApiErrorBody {
	success: false;
	error: { code: string; message: string; details?: unknown };
}

/** Dilempar setiap kali backend membalas `{ success: false }` — bawa kode & pesan aslinya. */
export class ApiRequestError extends Error {
	constructor(
		public readonly code: string,
		message: string,
		public readonly status: number,
		public readonly details?: unknown,
	) {
		super(message);
		this.name = 'ApiRequestError';
	}
}

export interface FetchCtx {
	/** Teruskan `event.fetch` di load function supaya cookie & kredensial ikut terkirim saat SSR. */
	fetch?: typeof fetch;
	accessToken?: string | null;
}

interface ApiFetchOptions extends FetchCtx {
	method?: string;
	body?: unknown;
	searchParams?: Record<string, string | number | undefined>;
}

/**
 * Satu-satunya jalan memanggil backend — semua fungsi di lib/api/*.ts lewat sini,
 * supaya tidak ada `fetch()` mentah tersebar di komponen dan bentuk response
 * `{ success, data }` / `{ success, error }` ditangani konsisten di satu tempat.
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
	const { method = 'GET', body, accessToken, searchParams, fetch: fetchImpl = fetch } = options;

	let url = `${PUBLIC_API_URL}${path}`;
	if (searchParams) {
		const qs = new URLSearchParams();
		for (const [key, value] of Object.entries(searchParams)) {
			if (value !== undefined) qs.set(key, String(value));
		}
		const qsString = qs.toString();
		if (qsString) url += `?${qsString}`;
	}

	const response = await fetchImpl(url, {
		method,
		headers: {
			'Content-Type': 'application/json',
			...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
		},
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});

	const json = (await response.json()) as ApiSuccess<T> | ApiErrorBody;

	if (!json.success) {
		throw new ApiRequestError(
			json.error.code,
			json.error.message,
			response.status,
			json.error.details,
		);
	}

	return json.data;
}
