import type { EventType } from './event';

/** Satu momen dalam kisah cinta — dipakai untuk seksi "love story" di undangan pernikahan/lamaran. */
export interface LoveStoryItem {
	/** ISO 8601. Boleh cuma tahun-bulan kasar untuk kenangan lama; tetap disimpan sebagai string ISO. */
	date: string;
	title: string;
	description: string;
}

interface InvitationBase {
	id: string;
	eventId: string;
	openingText: string | null;
	closingText: string | null;
	musicUrl: string | null;
	gallery: string[];
	loveStory: LoveStoryItem[] | null;
	/**
	 * Field tambahan yang bentuknya beda-beda per template undangan (mis. link livestream,
	 * kode dress code, atau field custom lain). Sengaja `Record<string, unknown>`, bukan `any`,
	 * supaya pemakainya tetap dipaksa melakukan type-narrowing sebelum membaca isinya.
	 */
	customData: Record<string, unknown>;
}

/**
 * Undangan untuk acara yang punya "mempelai" — pernikahan dan lamaran.
 * Dipisah dari GeneralInvitation karena brideName/groomName tidak masuk akal
 * untuk ulang tahun atau acara korporat.
 */
export interface WeddingInvitation extends InvitationBase {
	eventType: 'wedding' | 'engagement';
	groomName: string;
	brideName: string;
	groomParents: string | null;
	brideParents: string | null;
}

/**
 * Undangan untuk acara non-pernikahan. Pakai `hostName` sebagai fallback universal
 * (tuan rumah ulang tahun, penyelenggara syukuran, panitia acara korporat, dst)
 * alih-alih memaksakan field brideName/groomName yang tidak relevan.
 */
export interface GeneralInvitation extends InvitationBase {
	eventType: Exclude<EventType, 'wedding' | 'engagement'>;
	hostName: string;
}

/**
 * Discriminated union berdasarkan `eventType` — TypeScript bisa mempersempit
 * ke WeddingInvitation atau GeneralInvitation begitu `eventType` dicek,
 * tanpa perlu optional field yang canggung di kedua sisi.
 */
export type Invitation = WeddingInvitation | GeneralInvitation;
