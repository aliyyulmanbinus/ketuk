import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { env } from './env';
import { errorHandler } from './middleware/error';
import { apiRoutes } from './routes';

/**
 * App Hono murni — tidak memanggil `serve()` di sini supaya file ini bisa
 * dipakai ulang oleh dua entry point berbeda: `index.ts` (Node server biasa,
 * dev lokal / hosting Node tradisional) dan `api/index.ts` (Vercel Serverless
 * Function, lewat adapter `hono/vercel`).
 */
export const app = new Hono();

app.use('*', logger());
app.use(
	'/api/*',
	cors({
		origin: env.PUBLIC_APP_URL,
		allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
	}),
);

app.get('/', (c) => c.text('Ketuk.id API'));
app.get('/api/health', (c) => c.json({ success: true, data: { status: 'ok' } }));

app.route('/api', apiRoutes);

app.onError(errorHandler);
