<script lang="ts">
	import { Badge, EmptyState } from '$lib/components/ui';
	import { formatRupiah } from '@ketuk/shared';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const statusLabel: Record<string, string> = {
		pending: 'Menunggu Bayar',
		paid: 'Dibayar',
		processing: 'Diproses',
		shipped: 'Dikirim',
		delivered: 'Sampai',
		cancelled: 'Dibatalkan',
	};

	function statusTone(status: string): 'neutral' | 'success' | 'danger' {
		if (status === 'delivered') return 'success';
		if (status === 'cancelled') return 'danger';
		return 'neutral';
	}
</script>

<svelte:head>
	<title>Hadiah — Ketuk.id</title>
</svelte:head>

<h1 class="font-display text-2xl font-bold text-navy-900">Hadiah Masuk</h1>
<p class="mt-1 text-navy-500">Semua hadiah yang dikirim tamu ke acaramu.</p>

<div class="mt-8">
	{#if data.error}
		<p class="rounded-lg bg-red-50 p-4 text-sm text-red-600">{data.error}</p>
	{:else if data.orders.length === 0}
		<EmptyState icon="🎁" title="Belum ada hadiah masuk" description="Hadiah yang dikirim tamu akan muncul di sini." />
	{:else}
		<ul class="flex flex-col gap-3">
			{#each data.orders as order (order.id)}
				<li>
					<a
						href="/hadiah/{order.id}"
						class="flex items-center justify-between gap-4 rounded-xl border border-navy-100 bg-white p-4 transition-shadow hover:shadow-md"
					>
						<div>
							<p class="font-medium text-navy-900">{order.sender_name} → {order.recipient_name}</p>
							<p class="text-sm text-navy-500">{formatRupiah(order.total_amount)} · {order.quantity}x</p>
						</div>
						<Badge tone={statusTone(order.status)}>{statusLabel[order.status] ?? order.status}</Badge>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>
