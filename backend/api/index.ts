import { handle } from 'hono/vercel';
import { app } from '../src/app';

/**
 * Entry point Vercel Serverless Function. Vercel memetakan folder `api/` di
 * root project ini (Root Directory-nya sudah diset ke `backend` di dashboard
 * Vercel) sebagai function — `vercel.json` di sebelah file ini me-rewrite
 * SEMUA path ke function ini, jadi Hono yang urus routing internalnya sendiri
 * persis seperti saat jalan di Node biasa.
 */
export const runtime = 'nodejs';

export default handle(app);
