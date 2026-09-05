<script lang="ts">
	import { EventCard } from '$lib/components/domain';
	import { Button, EmptyState } from '$lib/components/ui';
	import { formatRupiah } from '@ketuk/shared';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const currentEvent = $derived(data.events.find((e) => e.id === data.eventId));
</script>

<svelte:head>
	<title>Planner — Ketuk.id</title>
</svelte:head>

{#if !data.eventId}
	<h1 class="font-display text-2xl font-bold text-navy-900">Planner</h1>
	<p class="mt-1 text-navy-500">Pilih acara yang mau dikelola.</p>
	{#if data.events.length === 0}
		<div class="mt-8">
			<EmptyState
				icon="📋"
				title="Belum ada undangan"
				description="Buat undangan dulu sebelum mengatur planner."
			>
				{#snippet action()}
					<Button href="/undangan/baru">Buat Undangan</Button>
				{/snippet}
			</EmptyState>
		</div>
	{:else}
		<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.events as event (event.id)}
				<a href="/planner?event={event.id}" class="block">
					<EventCard {event} />
				</a>
			{/each}
		</div>
	{/if}
{:else}
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-navy-900">Planner — {currentEvent?.title ?? ''}</h1>
			<a href="/planner" class="text-sm text-navy-400 hover:text-navy-700">Ganti acara</a>
		</div>
	</div>

	{#if data.error}
		<p class="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{data.error}</p>
	{:else if data.summary}
		<div class="mt-6 grid gap-4 sm:grid-cols-2">
			<a
				href="/planner/budget?event={data.eventId}"
				class="rounded-xl border border-navy-100 bg-white p-6 transition-shadow hover:shadow-md"
			>
				<p class="text-sm text-navy-400">Budget</p>
				<p class="mt-1 font-display text-2xl font-bold text-navy-900">
					{formatRupiah(data.summary.budget.totalActual)}
				</p>
				<p class="text-sm text-navy-500">dari estimasi {formatRupiah(data.summary.budget.totalEstimated)}</p>
			</a>
			<a
				href="/planner/checklist?event={data.eventId}"
				class="rounded-xl border border-navy-100 bg-white p-6 transition-shadow hover:shadow-md"
			>
				<p class="text-sm text-navy-400">Checklist</p>
				<p class="mt-1 font-display text-2xl font-bold text-navy-900">
					{data.summary.checklist.done}/{data.summary.checklist.total}
				</p>
				<p class="text-sm text-navy-500">item selesai</p>
			</a>
		</div>
		<div class="mt-4">
			<a
				href="/planner/timeline?event={data.eventId}"
				class="block rounded-xl border border-navy-100 bg-white p-6 transition-shadow hover:shadow-md"
			>
				<p class="font-display font-semibold text-navy-900">Timeline / Rundown Acara →</p>
			</a>
		</div>
	{/if}
{/if}
