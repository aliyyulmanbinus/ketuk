import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { env } from './env';
import { errorHandler } from './middleware/error';
import { apiRoutes } from './routes';

const app = new Hono();

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

serve({ fetch: app.fetch, port: env.BACKEND_PORT }, (info) => {
	console.log(`Ketuk.id API jalan di http://localhost:${info.port}`);
});
