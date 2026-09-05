import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../env';
import * as relations from './relations';
import * as schema from './schema';

// Koneksi dibuat sekali di level module dan dipakai ulang di seluruh request.
// `prepare: false` WAJIB kalau DATABASE_URL mengarah ke Supabase connection
// pooler (Supavisor/PgBouncer mode transaction, port 6543) — pooler jenis itu
// tidak mendukung prepared statement, dan tanpa opsi ini query akan gagal
// dengan error aneh soal statement yang "sudah ada". Aman dipakai juga untuk
// koneksi langsung (port 5432), jadi dibiarkan aktif selalu.
const client = postgres(env.DATABASE_URL, { prepare: false });

export const db = drizzle(client, { schema: { ...schema, ...relations } });
