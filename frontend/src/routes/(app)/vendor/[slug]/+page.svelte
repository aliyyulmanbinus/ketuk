<script lang="ts">
	import { Badge } from '$lib/components/ui';
	import { formatRupiah, VENDOR_CATEGORY_CONFIGS } from '@ketuk/shared';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const config = $derived(VENDOR_CATEGORY_CONFIGS.find((c) => c.value === data.vendor.category));
</script>

<svelte:head>
	<title>{data.vendor.name} — Ketuk.id</title>
</svelte:head>

<a href="/vendor" class="text-sm text-navy-400 hover:text-navy-700">← Semua Vendor</a>

<div class="mt-4 flex flex-col gap-6 rounded-2xl border border-navy-100 bg-white p-8">
	<div class="flex items-start justify-between gap-4">
		<div>
			<p class="text-3xl" aria-hidden="true">{config?.emoji ?? '🏷️'}</p>
			<h1 class="mt-2 font-display text-2xl font-bold text-navy-900">{data.vendor.name}</h1>
			<p class="text-navy-500">
				{config?.label ?? data.vendor.category} · {data.vendor.city ?? 'Lokasi belum diatur'}
			</p>
		</div>
		{#if data.vendor.isVerified}
			<Badge tone="vendor">Terverifikasi</Badge>
		{/if}
	</div>
	{#if data.vendor.description}
		<p class="text-navy-700">{data.vendor.description}</p>
	{/if}
	<p class="font-display text-xl font-semibold text-navy-900">
		{formatRupiah(data.vendor.priceMin)} – {formatRupiah(data.vendor.priceMax)}
	</p>
	<p class="text-sm text-navy-500">⭐ {data.vendor.rating.toFixed(1)} ({data.vendor.reviewCount} ulasan)</p>
	{#if data.vendor.phone}
		<p class="text-sm text-navy-700">📞 {data.vendor.phone}</p>
	{/if}
</div>
