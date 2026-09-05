import type { CreateEventInput } from '@ketuk/shared';
import { eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { events } from '../db/schema';
import { NotFoundError, ValidationError } from '../lib/errors';
import { purgeCloudflareCache } from './cache';

/**
 * Sama seperti CreateEventInput dari @ketuk/shared, tapi semua field kecuali
 * slug/type/title boleh kosong — event boleh dibuat sebagai draft dulu tanpa
 * tanggal/lokasi (lihat createEventBodySchema di routes/events.ts, ini tipenya
 * di sisi service).
 */
type CreateEventServiceInput = Pick<CreateEventInput, 'slug' | 'type' | 'title'> &
	Partial<Omit<CreateEventInput, 'slug' | 'type' | 'title'>>;

/**
 * Buat event baru sebagai draft, lalu isi checklist default berdasarkan jenis
 * acara lewat fungsi Postgres `create_default_checklist` (sql/functions.sql) —
 * datanya diambil dari sumber yang sama dengan EVENT_TYPE_CONFIGS di @ketuk/shared,
 * jadi tidak ada dua daftar checklist yang bisa saling tidak sinkron.
 */
export async function createEvent(ownerId: string, input: CreateEventServiceInput) {
	const [event] = await db
		.insert(events)
		.values({
			ownerId,
			slug: input.slug,
			type: input.type,
			title: input.title,
			date: input.date ?? null,
			timeStart: input.timeStart ?? null,
			timeEnd: input.timeEnd ?? null,
			venue: input.venue ?? null,
			location: input.location ?? null,
			locationUrl: input.locationUrl ?? null,
		})
		.returning();

	if (!event) {
		throw new ValidationError('Gagal membuat event');
	}

	await db.execute(sql`select create_default_checklist(${event.id}, ${event.type})`);

	return event;
}

/**
 * Event tanpa tanggal atau lokasi/venue tidak boleh dipublish — halaman
 * undangan yang belum lengkap datanya cuma akan membingungkan tamu.
 */
export async function publishEvent(eventId: string, ownerId: string) {
	const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);

	if (!event || event.ownerId !== ownerId) {
		throw new NotFoundError('Event tidak ditemukan');
	}

	const missingFields: string[] = [];
	if (!event.date) missingFields.push('date');
	if (!event.location && !event.venue) missingFields.push('location atau venue');

	if (missingFields.length > 0) {
		throw new ValidationError('Event belum lengkap untuk dipublish', { missingFields });
	}

	const [updated] = await db
		.update(events)
		.set({
			isPublished: true,
			publishedAt: event.publishedAt ?? new Date(),
			updatedAt: new Date(),
		})
		.where(eq(events.id, eventId))
		.returning();

	await purgeCloudflareCache([`/${event.slug}`]);

	return updated;
}
