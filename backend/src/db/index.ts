import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../env';
import * as relations from './relations';
import * as schema from './schema';

// Koneksi dibuat sekali di level module dan dipakai ulang di seluruh request —
// postgres-js sudah punya connection pooling internal, jangan buat client baru per request.
const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema: { ...schema, ...relations } });
