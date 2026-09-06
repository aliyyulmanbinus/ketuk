<script lang="ts">
	import type { ChecklistItem } from '@ketuk/shared';
	import { ListChecks, X } from '@lucide/svelte';
	import EmptyState from '../ui/EmptyState.svelte';

	interface Props {
		items: ChecklistItem[];
		onToggle?: (item: ChecklistItem) => void;
		onDelete?: (item: ChecklistItem) => void;
	}

	let { items, onToggle, onDelete }: Props = $props();
</script>

{#if items.length === 0}
	<EmptyState
		icon={ListChecks}
		title="Belum ada checklist"
		description="Checklist default otomatis dibuat sesuai jenis acara saat event dibuat."
	/>
{:else}
	<ul class="flex flex-col divide-y divide-navy-100 overflow-hidden rounded-xl border border-navy-100 bg-white">
		{#each items as item (item.id)}
			<li class="flex items-center gap-3 px-4 py-3">
				<input
					type="checkbox"
					checked={item.isDone}
					onchange={() => onToggle?.(item)}
					class="h-4 w-4 shrink-0 rounded border-navy-300 text-coral-500 focus-visible:outline-2"
				/>
				<span class="flex-1 text-sm {item.isDone ? 'text-navy-400 line-through' : 'text-navy-900'}">
					{item.title}
				</span>
				{#if item.dueDate}
					<span class="text-xs text-navy-400">{item.dueDate}</span>
				{/if}
				<button
					type="button"
					class="inline-flex h-7 w-7 items-center justify-center rounded-md text-navy-300 hover:bg-red-50 hover:text-red-600"
					onclick={() => onDelete?.(item)}
					aria-label="Hapus item checklist"
				>
					<X size={14} />
				</button>
			</li>
		{/each}
	</ul>
{/if}
