import type { Guest, RsvpInput, WishInput } from '@ketuk/shared';
import { apiFetch, type FetchCtx } from './client';

export interface CreateGuestInput {
	name: string;
	phone?: string;
	guestGroup?: string;
}

export interface GuestStat {
	status: string;
	guestCount: number;
	totalPax: number;
}

export interface WishItem {
	id: string;
	eventId: string;
	guestId: string | null;
	name: string;
	message: string;
	createdAt: string;
}

export function listGuests(eventId: string, ctx: FetchCtx = {}) {
	return apiFetch<Guest[]>(`/api/events/${eventId}/guests`, ctx);
}

export function createGuest(eventId: string, input: CreateGuestInput, ctx: FetchCtx = {}) {
	return apiFetch<Guest>(`/api/events/${eventId}/guests`, { method: 'POST', body: input, ...ctx });
}

export function importGuestsCsv(eventId: string, csv: string, ctx: FetchCtx = {}) {
	return apiFetch<Guest[]>(`/api/events/${eventId}/guests/import`, {
		method: 'POST',
		body: { csv },
		...ctx,
	});
}

export function getGuestStats(eventId: string, ctx: FetchCtx = {}) {
	return apiFetch<GuestStat[]>(`/api/events/${eventId}/guests/stats`, ctx);
}

export function updateGuest(
	eventId: string,
	guestId: string,
	input: Partial<CreateGuestInput>,
	ctx: FetchCtx = {},
) {
	return apiFetch<Guest>(`/api/events/${eventId}/guests/${guestId}`, {
		method: 'PATCH',
		body: input,
		...ctx,
	});
}

export function deleteGuest(eventId: string, guestId: string, ctx: FetchCtx = {}) {
	return apiFetch<{ id: string }>(`/api/events/${eventId}/guests/${guestId}`, {
		method: 'DELETE',
		...ctx,
	});
}

export function submitRsvp(
	input: RsvpInput & { eventSlug: string; guestSlug: string },
	ctx: FetchCtx = {},
) {
	return apiFetch<{ success: true }>('/api/rsvp', { method: 'POST', body: input, ...ctx });
}

export function submitWish(
	input: WishInput & { eventSlug: string; guestSlug?: string },
	ctx: FetchCtx = {},
) {
	return apiFetch<WishItem>('/api/wishes', { method: 'POST', body: input, ...ctx });
}

export function listWishes(eventSlug: string, ctx: FetchCtx = {}) {
	return apiFetch<WishItem[]>(`/api/events/${eventSlug}/wishes`, ctx);
}
