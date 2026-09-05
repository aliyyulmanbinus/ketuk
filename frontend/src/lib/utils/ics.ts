export interface IcsEventInput {
	title: string;
	description?: string;
	location?: string;
	/** ISO 8601 datetime lengkap (tanggal + jam) — bukan cuma tanggal. */
	start: string;
	end?: string;
}

function toIcsDate(iso: string): string {
	return `${new Date(iso).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
}

function escapeIcsText(text: string): string {
	return text.replace(/[\\;,]/g, (match) => `\\${match}`).replace(/\n/g, '\\n');
}

/** Generate isi file .ics minimal (VCALENDAR/VEVENT) untuk tombol "Tambah ke Kalender". */
export function generateIcs(input: IcsEventInput): string {
	const start = toIcsDate(input.start);
	const end = toIcsDate(input.end ?? input.start);

	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Ketuk.id//Undangan//ID',
		'BEGIN:VEVENT',
		`UID:${crypto.randomUUID()}@ketuk.id`,
		`DTSTAMP:${toIcsDate(new Date().toISOString())}`,
		`DTSTART:${start}`,
		`DTEND:${end}`,
		`SUMMARY:${escapeIcsText(input.title)}`,
		input.description ? `DESCRIPTION:${escapeIcsText(input.description)}` : undefined,
		input.location ? `LOCATION:${escapeIcsText(input.location)}` : undefined,
		'END:VEVENT',
		'END:VCALENDAR',
	].filter((line): line is string => line !== undefined);

	return lines.join('\r\n');
}

export function downloadIcsFile(filename: string, content: string) {
	const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}
