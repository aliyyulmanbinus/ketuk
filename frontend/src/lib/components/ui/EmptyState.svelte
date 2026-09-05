<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		icon?: string;
		title: string;
		description?: string;
		action?: Snippet;
	}

	let { icon = '📭', title, description, action }: Props = $props();
</script>

<div
	class="flex flex-col items-center gap-3 rounded-xl border border-dashed border-navy-200 px-6 py-12 text-center"
>
	<span class="text-4xl" aria-hidden="true">{icon}</span>
	<p class="font-display text-lg font-semibold text-navy-900">{title}</p>
	{#if description}
		<p class="max-w-sm text-sm text-navy-500">{description}</p>
	{/if}
	{#if action}
		<div class="mt-2">{@render action()}</div>
	{/if}
</div>
