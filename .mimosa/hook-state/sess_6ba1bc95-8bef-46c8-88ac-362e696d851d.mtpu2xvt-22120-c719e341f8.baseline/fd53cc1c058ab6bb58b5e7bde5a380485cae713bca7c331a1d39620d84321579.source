/**
 * Kelas error kustom yang dipetakan ke HTTP status & kode error standar oleh
 * middleware/error.ts. Handler cukup `throw new XxxError(...)`, tidak perlu
 * tahu detail format response — itu tanggung jawab error handler.
 */
export class AppError extends Error {
	constructor(
		message: string,
		public readonly statusCode: number,
		public readonly code: string,
		public readonly details?: unknown,
	) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class NotFoundError extends AppError {
	constructor(message = 'Data tidak ditemukan', details?: unknown) {
		super(message, 404, 'NOT_FOUND', details);
	}
}

export class ValidationError extends AppError {
	constructor(message = 'Input tidak valid', details?: unknown) {
		super(message, 400, 'VALIDATION_ERROR', details);
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = 'Autentikasi dibutuhkan', details?: unknown) {
		super(message, 401, 'UNAUTHORIZED', details);
	}
}

export class ForbiddenError extends AppError {
	constructor(message = 'Tidak punya akses ke resource ini', details?: unknown) {
		super(message, 403, 'FORBIDDEN', details);
	}
}

/** Untuk kegagalan yang berhubungan dengan pembayaran — signature invalid, Duitku error, dsb. */
export class PaymentError extends AppError {
	constructor(message = 'Terjadi kesalahan pada proses pembayaran', details?: unknown) {
		super(message, 402, 'PAYMENT_ERROR', details);
	}
}
