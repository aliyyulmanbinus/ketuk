import type { CreateEventInput, Event, Invitation, UpdateEventInput } from '@ketuk/shared';
import { apiFetch, type FetchCtx } from './client';

export interface EventWithInvitation extends Event {
	invitation: Invitation | null;
	/**
	 * Kolom `events.view_count` ada di database (backend/src/db/schema/events.ts)
	 * tapi sengaja tidak masuk tipe `Event` di @ketuk/shared — itu murni detail
	 * database, bukan bagian dari tipe domain yang dipakai FE & BE. Backend tetap
	 * mengembalikannya di response, jadi ditambahkan di sini saja untuk halaman
	 * yang benar-benar menampilkannya (ringkasan event).
	 */
	viewCount: number;
}

/** Sama seperti CreateEventInput di @ketuk/shared, tapi cuma slug/type/title yang wajib — lihat backend services/event.ts. */
export type CreateEventPayload = Pick<CreateEventInput, 'slug' | 'type' | 'title'> &
	Partial<Omit<CreateEventInput, 'slug' | 'type' | 'title'>>;

export function listMyEvents(ctx: FetchCtx = {}) {
	return apiFetch<Event[]>('/api/events', ctx);
}

export function getEvent(idOrSlug: string, ctx: FetchCtx = {}) {
	return apiFetch<EventWithInvitation>(`/api/events/${idOrSlug}`, ctx);
}

export function createEvent(input: CreateEventPayload, ctx: FetchCtx = {}) {
	return apiFetch<Event>('/api/events', { method: 'POST', body: input, ...ctx });
}

export function updateEvent(id: string, input: UpdateEventInput, ctx: FetchCtx = {}) {
	return apiFetch<Event>(`/api/events/${id}`, { method: 'PATCH', body: input, ...ctx });
}

export function deleteEvent(id: string, ctx: FetchCtx = {}) {
	return apiFetch<{ id: string }>(`/api/events/${id}`, { method: 'DELETE', ...ctx });
}

export function publishEvent(id: string, ctx: FetchCtx = {}) {
	return apiFetch<Event>(`/api/events/${id}/publish`, { method: 'POST', ...ctx });
}
