export type RsvpStatus = 'pending' | 'attending' | 'not_attending';

/**
 * Satu tamu yang diundang ke sebuah event. Guest bukan User — tamu tidak perlu akun
 * untuk RSVP atau mengirim ucapan, hanya butuh link personalnya sendiri.
 */
export interface Guest {
	id: string;
	eventId: string;
	name: string;
	phone: string | null;
	/** Pengelompokan bebas oleh host, mis. "Keluarga Mempelai Pria", "Teman Kantor". */
	guestGroup: string | null;
	rsvpStatus: RsvpStatus;
	/** Jumlah orang yang akan hadir (termasuk tamu itu sendiri), bukan jumlah undangan yang dikirim. */
	pax: number;
	/** Slug unik untuk link personal per tamu: ketuk.id/{eventSlug}/tamu/{slug}. */
	slug: string;
	/** Ucapan yang ditulis tamu saat RSVP, ditampilkan di halaman undangan. */
	message: string | null;
	/** ISO 8601, null selama status masih `pending`. */
	respondedAt: string | null;
	createdAt: string;
}
