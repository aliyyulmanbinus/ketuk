<script lang="ts">
	import type { Event } from '@ketuk/shared';
	import { EVENT_TYPE_CONFIGS, formatEventDate } from '@ketuk/shared';
	import Badge from '../ui/Badge.svelte';

	interface Props {
		event: Event;
	}

	let { event }: Props = $props();

	const config = $derived(EVENT_TYPE_CONFIGS.find((c) => c.value === event.type));
</script>

<a
	href="/undangan/{event.id}"
	class="flex flex-col gap-3 rounded-xl border border-navy-100 bg-white p-5 transition-shadow hover:shadow-md"
>
	<div class="flex items-start justify-between gap-2">
		<div>
			<p class="text-2xl" aria-hidden="true">{config?.emoji ?? '✨'}</p>
			<h3 class="mt-1 font-display text-lg font-semibold text-navy-900">{event.title}</h3>
		</div>
		<Badge tone={event.isPublished ? 'success' : 'neutral'}>
			{event.isPublished ? 'Terbit' : 'Draf'}
		</Badge>
	</div>
	<p class="text-sm text-navy-500">
		{event.date ? formatEventDate(event.date) : 'Tanggal belum diatur'}
	</p>
	<p class="text-xs text-navy-400">ketuk.id/{event.slug}</p>
</a>
