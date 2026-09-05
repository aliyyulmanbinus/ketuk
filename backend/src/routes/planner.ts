import { and, eq, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { budgetItems, checklistItems, events, timelineItems } from '../db/schema';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../lib/errors';
import { ok } from '../lib/response';
import type { AuthUser } from '../middleware/auth';
import { optionalAuth } from '../middleware/auth';

function requireUser(user: AuthUser | null): AuthUser {
	if (!user) throw new UnauthorizedError();
	return user;
}

async function assertEventOwnership(eventId: string, userId: string) {
	const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
	if (!event) throw new NotFoundError('Event tidak ditemukan');
	if (event.ownerId !== userId) throw new ForbiddenError();
	return event;
}

const budgetItemSchema = z.object({
	category: z.string().trim().min(1).max(100),
	name: z.string().trim().min(1).max(150),
	estimated: z.number().int().min(0),
	actual: z.number().int().min(0).nullable().optional(),
	isPaid: z.boolean().optional(),
	vendorId: z.string().uuid().nullable().optional(),
});

const checklistItemSchema = z.object({
	title: z.string().trim().min(1).max(200),
	isDone: z.boolean().optional(),
	dueDate: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
		.nullable()
		.optional(),
});

const timelineItemSchema = z.object({
	title: z.string().trim().min(1).max(200),
	time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format jam harus HH:mm'),
	duration: z.number().int().min(0).nullable().optional(),
	pic: z.string().trim().max(100).nullable().optional(),
	notes: z.string().trim().max(500).nullable().optional(),
});

export const plannerRoutes = new Hono<{ Variables: { user: AuthUser | null } }>();

plannerRoutes.use('*', optionalAuth);

/** Total estimasi, total aktual, dan progress checklist dalam satu panggilan — dashboard tidak perlu 3 request terpisah. */
plannerRoutes.get('/events/:eventId/planner/summary', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	await assertEventOwnership(eventId, user.id);

	const [budgetTotals] = await db
		.select({
			totalEstimated: sql<number>`coalesce(sum(${budgetItems.estimated}), 0)::int`,
			totalActual: sql<number>`coalesce(sum(${budgetItems.actual}), 0)::int`,
		})
		.from(budgetItems)
		.where(eq(budgetItems.eventId, eventId));

	const [checklistTotals] = await db
		.select({
			total: sql<number>`count(*)::int`,
			done: sql<number>`count(*) filter (where ${checklistItems.isDone})::int`,
		})
		.from(checklistItems)
		.where(eq(checklistItems.eventId, eventId));

	return ok(c, {
		budget: budgetTotals ?? { totalEstimated: 0, totalActual: 0 },
		checklist: checklistTotals ?? { total: 0, done: 0 },
	});
});

// ── Budget ───────────────────────────────────────────────────────────────────

plannerRoutes.get('/events/:eventId/planner/budget', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	await assertEventOwnership(eventId, user.id);

	const rows = await db
		.select()
		.from(budgetItems)
		.where(eq(budgetItems.eventId, eventId))
		.limit(500);
	return ok(c, rows);
});

plannerRoutes.post('/events/:eventId/planner/budget', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	await assertEventOwnership(eventId, user.id);

	const input = budgetItemSchema.parse(await c.req.json());
	const [item] = await db
		.insert(budgetItems)
		.values({ eventId, ...input })
		.returning();
	return ok(c, item, 201);
});

plannerRoutes.patch('/events/:eventId/planner/budget/:itemId', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	const itemId = c.req.param('itemId');
	await assertEventOwnership(eventId, user.id);

	const input = budgetItemSchema.partial().parse(await c.req.json());
	const [updated] = await db
		.update(budgetItems)
		.set(input)
		.where(and(eq(budgetItems.id, itemId), eq(budgetItems.eventId, eventId)))
		.returning();

	if (!updated) throw new NotFoundError('Item budget tidak ditemukan');
	return ok(c, updated);
});

plannerRoutes.delete('/events/:eventId/planner/budget/:itemId', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	const itemId = c.req.param('itemId');
	await assertEventOwnership(eventId, user.id);

	await db
		.delete(budgetItems)
		.where(and(eq(budgetItems.id, itemId), eq(budgetItems.eventId, eventId)));
	return ok(c, { id: itemId });
});

// ── Checklist ────────────────────────────────────────────────────────────────

plannerRoutes.get('/events/:eventId/planner/checklist', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	await assertEventOwnership(eventId, user.id);

	const rows = await db
		.select()
		.from(checklistItems)
		.where(eq(checklistItems.eventId, eventId))
		.limit(500);
	return ok(c, rows);
});

plannerRoutes.post('/events/:eventId/planner/checklist', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	await assertEventOwnership(eventId, user.id);

	const input = checklistItemSchema.parse(await c.req.json());
	const [item] = await db
		.insert(checklistItems)
		.values({ eventId, ...input })
		.returning();
	return ok(c, item, 201);
});

plannerRoutes.patch('/events/:eventId/planner/checklist/:itemId', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	const itemId = c.req.param('itemId');
	await assertEventOwnership(eventId, user.id);

	const input = checklistItemSchema.partial().parse(await c.req.json());
	const [updated] = await db
		.update(checklistItems)
		.set(input)
		.where(and(eq(checklistItems.id, itemId), eq(checklistItems.eventId, eventId)))
		.returning();

	if (!updated) throw new NotFoundError('Item checklist tidak ditemukan');
	return ok(c, updated);
});

plannerRoutes.delete('/events/:eventId/planner/checklist/:itemId', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	const itemId = c.req.param('itemId');
	await assertEventOwnership(eventId, user.id);

	await db
		.delete(checklistItems)
		.where(and(eq(checklistItems.id, itemId), eq(checklistItems.eventId, eventId)));
	return ok(c, { id: itemId });
});

// ── Timeline ─────────────────────────────────────────────────────────────────

plannerRoutes.get('/events/:eventId/planner/timeline', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	await assertEventOwnership(eventId, user.id);

	const rows = await db
		.select()
		.from(timelineItems)
		.where(eq(timelineItems.eventId, eventId))
		.limit(500);
	return ok(c, rows);
});

plannerRoutes.post('/events/:eventId/planner/timeline', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	await assertEventOwnership(eventId, user.id);

	const input = timelineItemSchema.parse(await c.req.json());
	const [item] = await db
		.insert(timelineItems)
		.values({ eventId, ...input })
		.returning();
	return ok(c, item, 201);
});

plannerRoutes.patch('/events/:eventId/planner/timeline/:itemId', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	const itemId = c.req.param('itemId');
	await assertEventOwnership(eventId, user.id);

	const input = timelineItemSchema.partial().parse(await c.req.json());
	const [updated] = await db
		.update(timelineItems)
		.set(input)
		.where(and(eq(timelineItems.id, itemId), eq(timelineItems.eventId, eventId)))
		.returning();

	if (!updated) throw new NotFoundError('Item timeline tidak ditemukan');
	return ok(c, updated);
});

plannerRoutes.delete('/events/:eventId/planner/timeline/:itemId', async (c) => {
	const user = requireUser(c.get('user'));
	const eventId = c.req.param('eventId');
	const itemId = c.req.param('itemId');
	await assertEventOwnership(eventId, user.id);

	await db
		.delete(timelineItems)
		.where(and(eq(timelineItems.id, itemId), eq(timelineItems.eventId, eventId)));
	return ok(c, { id: itemId });
});
