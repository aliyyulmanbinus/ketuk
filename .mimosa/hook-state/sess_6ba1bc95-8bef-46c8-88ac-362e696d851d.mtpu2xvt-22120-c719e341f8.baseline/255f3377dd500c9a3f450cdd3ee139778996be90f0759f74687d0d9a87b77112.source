import type { Vendor, VendorCategory } from '@ketuk/shared';
import { apiFetch, type FetchCtx } from './client';

/**
 * `slug` ada di kolom database (backend/src/db/schema/vendors.ts) tapi sengaja
 * tidak masuk tipe `Vendor` di @ketuk/shared — sama seperti `viewCount` di
 * events.ts, itu detail database untuk kebutuhan halaman detail vendor publik,
 * bukan bagian dari tipe domain inti.
 */
export interface VendorListItem extends Vendor {
	slug: string;
}

export interface ListVendorsParams {
	category?: VendorCategory;
	city?: string;
	priceMin?: number;
	priceMax?: number;
	cursor?: string;
	limit?: number;
}

export interface ListVendorsResult {
	items: VendorListItem[];
	nextCursor: string | null;
}

export function listVendors(params: ListVendorsParams = {}, ctx: FetchCtx = {}) {
	return apiFetch<ListVendorsResult>('/api/vendors', { searchParams: { ...params }, ...ctx });
}

export function getVendor(slug: string, ctx: FetchCtx = {}) {
	return apiFetch<VendorListItem>(`/api/vendors/${slug}`, ctx);
}
