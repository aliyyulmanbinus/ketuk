import type { CreatePaymentInput, PaymentTransaction } from '@ketuk/shared';
import { apiFetch, type FetchCtx } from './client';

export function createPayment(input: CreatePaymentInput, ctx: FetchCtx = {}) {
	return apiFetch<PaymentTransaction>('/api/payments', { method: 'POST', body: input, ...ctx });
}

export function getPaymentStatus(merchantOrderId: string, ctx: FetchCtx = {}) {
	return apiFetch<PaymentTransaction>(`/api/payments/${merchantOrderId}`, ctx);
}
