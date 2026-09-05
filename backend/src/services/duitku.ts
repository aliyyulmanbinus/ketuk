import { createHash, timingSafeEqual } from 'node:crypto';
import { env } from '../env';
import { PaymentError } from '../lib/errors';

// TODO: verifikasi base URL sandbox & production dengan dokumentasi resmi Duitku
// (docs.duitku.com) — ini nilai yang paling umum dipakai di contoh integrasi mereka,
// bukan hasil pengecekan langsung.
const DUITKU_BASE_URL = {
	sandbox: 'https://sandbox.duitku.com/webapi/api/merchant',
	production: 'https://passport.duitku.com/webapi/api/merchant',
} as const;

function getBaseUrl(): string {
	return env.DUITKU_ENV === 'production' ? DUITKU_BASE_URL.production : DUITKU_BASE_URL.sandbox;
}

function md5(input: string): string {
	return createHash('md5').update(input).digest('hex');
}

/** Bandingkan dua signature tanpa membocorkan durasi (hindari timing attack). */
function signaturesMatch(a: string, b: string): boolean {
	const bufA = Buffer.from(a);
	const bufB = Buffer.from(b);
	if (bufA.length !== bufB.length) return false;
	return timingSafeEqual(bufA, bufB);
}

export interface CreateTransactionParams {
	merchantOrderId: string;
	/** Rupiah utuh sebagai integer — dihitung server, jangan pernah ambil dari client. */
	amount: number;
	productDetails: string;
	paymentMethod: string;
	customerName: string;
	customerEmail?: string;
	customerPhone?: string;
}

/** Bentuk body request ke endpoint inquiry Duitku. Jangan pakai `any` — field yang tidak dikirim tetap harus terlihat di tipe. */
export interface DuitkuCreateTransactionRequestBody {
	merchantCode: string;
	paymentAmount: number;
	merchantOrderId: string;
	productDetails: string;
	email: string;
	paymentMethod: string;
	customerVaName: string;
	phoneNumber?: string;
	callbackUrl: string;
	returnUrl: string;
	signature: string;
}

export interface DuitkuCreateTransactionResponse {
	merchantCode: string;
	reference: string;
	paymentUrl: string;
	vaNumber?: string;
	qrString?: string;
	amount: string;
	statusCode: string;
	statusMessage: string;
}

export interface DuitkuCallbackPayload {
	merchantCode: string;
	amount: string;
	merchantOrderId: string;
	productDetail?: string;
	additionalParam?: string;
	paymentCode: string;
	resultCode: string;
	merchantUserId?: string;
	reference: string;
	signature: string;
	publisherOrderId?: string;
	spUserHash?: string;
	settlementDate?: string;
	issuerCode?: string;
}

export interface DuitkuTransactionStatusResponse {
	merchantOrderId: string;
	reference: string;
	amount: string;
	fee?: string;
	statusCode: string;
	statusMessage: string;
}

/**
 * Signature untuk request PEMBUATAN transaksi.
 * Urutan: merchantCode + merchantOrderId + amount + apiKey (MD5).
 * Sengaja dipisah dari signature callback — urutannya beda dan gampang salah pakai kalau digabung.
 */
export function generateTransactionSignature(params: {
	merchantCode: string;
	merchantOrderId: string;
	amount: number;
	apiKey: string;
}): string {
	return md5(`${params.merchantCode}${params.merchantOrderId}${params.amount}${params.apiKey}`);
}

/**
 * Signature untuk verifikasi CALLBACK pembayaran.
 * Urutan: merchantCode + amount + merchantOrderId + apiKey (MD5).
 */
export function generateCallbackSignature(params: {
	merchantCode: string;
	amount: string;
	merchantOrderId: string;
	apiKey: string;
}): string {
	return md5(`${params.merchantCode}${params.amount}${params.merchantOrderId}${params.apiKey}`);
}

/**
 * Verifikasi wajib sebelum callback diproses — ini vektor serangan langsung ke
 * sistem pembayaran. Callback dengan signature tidak valid harus ditolak, tidak
 * pernah diproses meski isinya "kelihatan" benar.
 */
export function verifyCallbackSignature(payload: DuitkuCallbackPayload): boolean {
	const expected = generateCallbackSignature({
		merchantCode: payload.merchantCode,
		amount: payload.amount,
		merchantOrderId: payload.merchantOrderId,
		apiKey: env.DUITKU_API_KEY,
	});
	return signaturesMatch(expected, payload.signature);
}

/**
 * Buat transaksi baru di Duitku. `amount` di sini harus sudah dihitung ulang
 * dari harga di database — fungsi ini tidak melakukan validasi harga, itu
 * tanggung jawab pemanggil (lihat services/gift-order.ts dan services/event.ts).
 */
export async function createTransaction(
	params: CreateTransactionParams,
): Promise<DuitkuCreateTransactionResponse> {
	const signature = generateTransactionSignature({
		merchantCode: env.DUITKU_MERCHANT_CODE,
		merchantOrderId: params.merchantOrderId,
		amount: params.amount,
		apiKey: env.DUITKU_API_KEY,
	});

	const body: DuitkuCreateTransactionRequestBody = {
		merchantCode: env.DUITKU_MERCHANT_CODE,
		paymentAmount: params.amount,
		merchantOrderId: params.merchantOrderId,
		productDetails: params.productDetails,
		email: params.customerEmail ?? 'guest@ketuk.id',
		paymentMethod: params.paymentMethod,
		customerVaName: params.customerName,
		phoneNumber: params.customerPhone,
		callbackUrl: env.DUITKU_CALLBACK_URL,
		returnUrl: env.DUITKU_RETURN_URL,
		signature,
	};

	// TODO: verifikasi path endpoint ("/v2/inquiry") dan nama-nama field body ini
	// persis dengan dokumentasi resmi Duitku sebelum dipakai ke production.
	const response = await fetch(`${getBaseUrl()}/v2/inquiry`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		throw new PaymentError(`Duitku createTransaction gagal: HTTP ${response.status}`);
	}

	const data = (await response.json()) as DuitkuCreateTransactionResponse;

	if (data.statusCode !== '00') {
		throw new PaymentError(`Duitku menolak transaksi: ${data.statusMessage}`, data);
	}

	return data;
}

/**
 * Cek status transaksi ke Duitku — dipakai sebagai fallback kalau callback
 * tidak kunjung masuk (mis. user tanya "kok belum lunas" padahal sudah bayar).
 */
export async function checkTransactionStatus(
	merchantOrderId: string,
): Promise<DuitkuTransactionStatusResponse> {
	// TODO: verifikasi urutan komponen signature ini (merchantCode + merchantOrderId + apiKey)
	// dan path endpoint ("/transactionStatus") dengan dokumentasi resmi Duitku.
	const signature = md5(`${env.DUITKU_MERCHANT_CODE}${merchantOrderId}${env.DUITKU_API_KEY}`);

	const response = await fetch(`${getBaseUrl()}/transactionStatus`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			merchantCode: env.DUITKU_MERCHANT_CODE,
			merchantOrderId,
			signature,
		}),
	});

	if (!response.ok) {
		throw new PaymentError(`Duitku checkTransactionStatus gagal: HTTP ${response.status}`);
	}

	return (await response.json()) as DuitkuTransactionStatusResponse;
}
