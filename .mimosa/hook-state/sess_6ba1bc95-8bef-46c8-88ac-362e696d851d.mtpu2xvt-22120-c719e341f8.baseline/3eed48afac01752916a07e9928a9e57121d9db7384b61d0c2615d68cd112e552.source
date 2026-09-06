/** Satu baris anggaran acara. */
export interface BudgetItem {
	id: string;
	eventId: string;
	category: string;
	name: string;
	/** Rupiah utuh sebagai integer — jangan pakai float, presisi pecahan tidak dibutuhkan dan bikin bug. */
	estimated: number;
	/** Rupiah utuh sebagai integer, null selama belum ada pengeluaran nyata. */
	actual: number | null;
	isPaid: boolean;
	vendorId: string | null;
	createdAt: string;
}

/** Satu item checklist persiapan acara. Dibuat otomatis dari template di constants/event-types.ts. */
export interface ChecklistItem {
	id: string;
	eventId: string;
	title: string;
	isDone: boolean;
	/** ISO 8601, opsional — sebagian item checklist tidak butuh tenggat spesifik. */
	dueDate: string | null;
	createdAt: string;
}

/** Satu baris di rundown/susunan acara hari-H. */
export interface TimelineItem {
	id: string;
	eventId: string;
	title: string;
	/** Format HH:mm dalam waktu lokal venue, bukan timestamp — hari-H rundown tidak butuh tanggal. */
	time: string;
	/** Perkiraan durasi dalam menit, null kalau belum diperkirakan. */
	duration: number | null;
	/** Penanggung jawab item ini, mis. "MC" atau nama vendor. */
	pic: string | null;
	notes: string | null;
}
