import type {
	CreateGiftOrderInput,
	GiftOrder,
	GiftProduct,
	PaymentTransaction,
} from '@ketuk/shared';
import { apiFetch, type FetchCtx } from './client';

export interface CreateGiftOrderResult {
	order: GiftOrder;
	payment: PaymentTransaction;
}

export function listGiftProducts(category?: string, ctx: FetchCtx = {}) {
	return apiFetch<GiftProduct[]>('/api/gifts/products', { searchParams: { category }, ...ctx });
}

export function getGiftProduct(id: string, ctx: FetchCtx = {}) {
	return apiFetch<GiftProduct>(`/api/gifts/products/${id}`, ctx);
}

export function createGiftOrder(
	eventSlug: string,
	input: CreateGiftOrderInput & { paymentMethod: string },
	ctx: FetchCtx = {},
) {
	return apiFetch<CreateGiftOrderResult>('/api/gifts/orders', {
		method: 'POST',
		body: { eventSlug, ...input },
		...ctx,
	});
}
