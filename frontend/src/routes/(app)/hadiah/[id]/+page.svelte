<script lang="ts">
	import { formatRupiah } from '@ketuk/shared';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Detail Hadiah — Ketuk.id</title>
</svelte:head>

<a href="/hadiah" class="text-sm text-navy-400 hover:text-navy-700">← Semua Hadiah</a>

<div class="mt-4 flex flex-col gap-4 rounded-2xl border border-navy-100 bg-white p-8">
	<h1 class="font-display text-xl font-bold text-navy-900">Hadiah dari {data.order.sender_name}</h1>
	<dl class="grid gap-4 text-sm sm:grid-cols-2">
		<div>
			<dt class="text-navy-400">Penerima</dt>
			<dd class="text-navy-900">{data.order.recipient_name}</dd>
		</div>
		<div>
			<dt class="text-navy-400">Alamat</dt>
			<dd class="text-navy-900">{data.order.recipient_address}</dd>
		</div>
		<div>
			<dt class="text-navy-400">Jumlah</dt>
			<dd class="text-navy-900">{data.order.quantity}x</dd>
		</div>
		<div>
			<dt class="text-navy-400">Total</dt>
			<dd class="text-navy-900">{formatRupiah(data.order.total_amount)}</dd>
		</div>
		<div>
			<dt class="text-navy-400">Status</dt>
			<dd class="text-navy-900">{data.order.status}</dd>
		</div>
	</dl>
	{#if data.order.message}
		<div>
			<p class="text-sm text-navy-400">Pesan</p>
			<p class="mt-1 text-navy-700">{data.order.message}</p>
		</div>
	{/if}
</div>
