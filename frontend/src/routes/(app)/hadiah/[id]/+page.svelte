<script lang="ts">
	import { formatRupiah } from '@ketuk/shared';
	import { ArrowLeft } from '@lucide/svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Detail Hadiah | Ketuk.id</title>
</svelte:head>

<div class="mx-auto max-w-3xl">
	<a
		href="/hadiah"
		class="inline-flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-900"
	>
		<ArrowLeft size={14} />
		Semua Hadiah
	</a>

	<div class="mt-4 flex flex-col gap-6 rounded-2xl border border-navy-100 bg-white p-6 sm:p-8">
		<h1 class="font-display text-xl font-bold text-navy-900 sm:text-2xl">
			Hadiah dari {data.order.sender_name}
		</h1>
		<dl class="grid gap-4 text-sm sm:grid-cols-2">
			<div>
				<dt class="text-navy-400">Penerima</dt>
				<dd class="mt-1 text-navy-900">{data.order.recipient_name}</dd>
			</div>
			<div>
				<dt class="text-navy-400">Alamat</dt>
				<dd class="mt-1 text-navy-900">{data.order.recipient_address}</dd>
			</div>
			<div>
				<dt class="text-navy-400">Jumlah</dt>
				<dd class="mt-1 text-navy-900">{data.order.quantity}x</dd>
			</div>
			<div>
				<dt class="text-navy-400">Total</dt>
				<dd class="mt-1 font-medium text-navy-900">{formatRupiah(data.order.total_amount)}</dd>
			</div>
			<div>
				<dt class="text-navy-400">Status</dt>
				<dd class="mt-1 text-navy-900">{data.order.status}</dd>
			</div>
		</dl>
		{#if data.order.message}
			<div class="border-t border-navy-100 pt-4">
				<p class="text-sm text-navy-400">Pesan</p>
				<p class="mt-1.5 text-navy-700">{data.order.message}</p>
			</div>
		{/if}
	</div>
</div>
