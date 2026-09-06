<script lang="ts">
	import type { BudgetItem } from '@ketuk/shared';
	import { formatRupiah } from '@ketuk/shared';
	import { Wallet } from '@lucide/svelte';
	import Badge from '../ui/Badge.svelte';
	import EmptyState from '../ui/EmptyState.svelte';

	interface Props {
		items: BudgetItem[];
		onEdit?: (item: BudgetItem) => void;
		onDelete?: (item: BudgetItem) => void;
	}

	let { items, onEdit, onDelete }: Props = $props();
</script>

{#if items.length === 0}
	<EmptyState icon={Wallet} title="Belum ada rencana anggaran" description="Tambah item budget pertamamu." />
{:else}
	<div class="overflow-x-auto rounded-xl border border-navy-100">
		<table class="w-full min-w-[600px] text-sm">
			<thead class="bg-navy-50 text-left text-navy-500">
				<tr>
					<th class="px-4 py-3 font-medium">Item</th>
					<th class="px-4 py-3 font-medium">Kategori</th>
					<th class="px-4 py-3 font-medium">Estimasi</th>
					<th class="px-4 py-3 font-medium">Aktual</th>
					<th class="px-4 py-3 font-medium">Status</th>
					<th class="px-4 py-3 font-medium"><span class="sr-only">Aksi</span></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-navy-100">
				{#each items as item (item.id)}
					<tr>
						<td class="px-4 py-3 font-medium text-navy-900">{item.name}</td>
						<td class="px-4 py-3 text-navy-500">{item.category}</td>
						<td class="px-4 py-3 text-navy-700">{formatRupiah(item.estimated)}</td>
						<td class="px-4 py-3 text-navy-700">
							{item.actual !== null ? formatRupiah(item.actual) : '–'}
						</td>
						<td class="px-4 py-3">
							<Badge tone={item.isPaid ? 'success' : 'warning'}>{item.isPaid ? 'Lunas' : 'Belum'}</Badge>
						</td>
						<td class="px-4 py-3 text-right whitespace-nowrap">
							<button type="button" class="text-navy-400 hover:text-navy-700" onclick={() => onEdit?.(item)}>
								Ubah
							</button>
							<button
								type="button"
								class="ml-3 text-navy-400 hover:text-red-600"
								onclick={() => onDelete?.(item)}
							>
								Hapus
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
