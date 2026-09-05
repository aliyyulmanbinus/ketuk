import { serve } from '@hono/node-server';
import { app } from './app';
import { env } from './env';

/** Entry point Node biasa — dipakai untuk dev lokal (`bun run dev`) dan hosting Node tradisional. */
serve({ fetch: app.fetch, port: env.BACKEND_PORT }, (info) => {
	console.log(`Ketuk.id API jalan di http://localhost:${info.port}`);
});
