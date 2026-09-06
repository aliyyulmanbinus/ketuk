import { Hono } from 'hono';
import { eventsRoutes } from './events';
import { giftsRoutes } from './gifts';
import { guestsRoutes } from './guests';
import { paymentsRoutes } from './payments';
import { plannerRoutes } from './planner';
import { vendorsRoutes } from './vendors';
import { webhooksRoutes } from './webhooks';

export const apiRoutes = new Hono();

apiRoutes.route('/events', eventsRoutes);
// guests.ts & planner.ts sudah mendeklarasikan path lengkapnya sendiri
// (mis. '/events/:eventId/guests', '/rsvp', '/wishes') karena butuh nested
// di bawah event tapi juga punya endpoint publik di luar itu — dipasang di root.
apiRoutes.route('/', guestsRoutes);
apiRoutes.route('/', plannerRoutes);
apiRoutes.route('/vendors', vendorsRoutes);
apiRoutes.route('/gifts', giftsRoutes);
apiRoutes.route('/payments', paymentsRoutes);
apiRoutes.route('/webhooks', webhooksRoutes);
