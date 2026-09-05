import type { BudgetItem, ChecklistItem, TimelineItem } from '@ketuk/shared';
import { apiFetch, type FetchCtx } from './client';

export interface PlannerSummary {
	budget: { totalEstimated: number; totalActual: number };
	checklist: { total: number; done: number };
}

export interface BudgetItemInput {
	category: string;
	name: string;
	estimated: number;
	actual?: number | null;
	isPaid?: boolean;
	vendorId?: string | null;
}

export interface ChecklistItemInput {
	title: string;
	isDone?: boolean;
	dueDate?: string | null;
}

export interface TimelineItemInput {
	title: string;
	time: string;
	duration?: number | null;
	pic?: string | null;
	notes?: string | null;
}

export function getPlannerSummary(eventId: string, ctx: FetchCtx = {}) {
	return apiFetch<PlannerSummary>(`/api/events/${eventId}/planner/summary`, ctx);
}

export function listBudgetItems(eventId: string, ctx: FetchCtx = {}) {
	return apiFetch<BudgetItem[]>(`/api/events/${eventId}/planner/budget`, ctx);
}

export function createBudgetItem(eventId: string, input: BudgetItemInput, ctx: FetchCtx = {}) {
	return apiFetch<BudgetItem>(`/api/events/${eventId}/planner/budget`, {
		method: 'POST',
		body: input,
		...ctx,
	});
}

export function updateBudgetItem(
	eventId: string,
	itemId: string,
	input: Partial<BudgetItemInput>,
	ctx: FetchCtx = {},
) {
	return apiFetch<BudgetItem>(`/api/events/${eventId}/planner/budget/${itemId}`, {
		method: 'PATCH',
		body: input,
		...ctx,
	});
}

export function deleteBudgetItem(eventId: string, itemId: string, ctx: FetchCtx = {}) {
	return apiFetch<{ id: string }>(`/api/events/${eventId}/planner/budget/${itemId}`, {
		method: 'DELETE',
		...ctx,
	});
}

export function listChecklistItems(eventId: string, ctx: FetchCtx = {}) {
	return apiFetch<ChecklistItem[]>(`/api/events/${eventId}/planner/checklist`, ctx);
}

export function createChecklistItem(
	eventId: string,
	input: ChecklistItemInput,
	ctx: FetchCtx = {},
) {
	return apiFetch<ChecklistItem>(`/api/events/${eventId}/planner/checklist`, {
		method: 'POST',
		body: input,
		...ctx,
	});
}

export function updateChecklistItem(
	eventId: string,
	itemId: string,
	input: Partial<ChecklistItemInput>,
	ctx: FetchCtx = {},
) {
	return apiFetch<ChecklistItem>(`/api/events/${eventId}/planner/checklist/${itemId}`, {
		method: 'PATCH',
		body: input,
		...ctx,
	});
}

export function deleteChecklistItem(eventId: string, itemId: string, ctx: FetchCtx = {}) {
	return apiFetch<{ id: string }>(`/api/events/${eventId}/planner/checklist/${itemId}`, {
		method: 'DELETE',
		...ctx,
	});
}

export function listTimelineItems(eventId: string, ctx: FetchCtx = {}) {
	return apiFetch<TimelineItem[]>(`/api/events/${eventId}/planner/timeline`, ctx);
}

export function createTimelineItem(eventId: string, input: TimelineItemInput, ctx: FetchCtx = {}) {
	return apiFetch<TimelineItem>(`/api/events/${eventId}/planner/timeline`, {
		method: 'POST',
		body: input,
		...ctx,
	});
}

export function updateTimelineItem(
	eventId: string,
	itemId: string,
	input: Partial<TimelineItemInput>,
	ctx: FetchCtx = {},
) {
	return apiFetch<TimelineItem>(`/api/events/${eventId}/planner/timeline/${itemId}`, {
		method: 'PATCH',
		body: input,
		...ctx,
	});
}

export function deleteTimelineItem(eventId: string, itemId: string, ctx: FetchCtx = {}) {
	return apiFetch<{ id: string }>(`/api/events/${eventId}/planner/timeline/${itemId}`, {
		method: 'DELETE',
		...ctx,
	});
}
