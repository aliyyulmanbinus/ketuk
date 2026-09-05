<script lang="ts">
	import type { VendorListItem } from '$lib/api';
	import { formatRupiah, VENDOR_CATEGORY_CONFIGS } from '@ketuk/shared';
	import Badge from '../ui/Badge.svelte';

	interface Props {
		vendor: VendorListItem;
	}

	let { vendor }: Props = $props();
	const config = $derived(VENDOR_CATEGORY_CONFIGS.find((c) => c.value === vendor.category));
</script>

<a
	href="/vendor/{vendor.slug}"
	class="flex flex-col gap-3 rounded-xl border border-navy-100 bg-white p-5 transition-shadow hover:shadow-md"
>
	<div class="flex items-start justify-between gap-2">
		<div>
			<p class="text-2xl" aria-hidden="true">{config?.emoji ?? '🏷️'}</p>
			<h3 class="mt-1 font-display text-lg font-semibold text-navy-900">{vendor.name}</h3>
			<p class="text-sm text-navy-500">{config?.label ?? vendor.category} · {vendor.city ?? 'Lokasi belum diatur'}</p>
		</div>
		{#if vendor.isVerified}
			<Badge tone="vendor">Terverifikasi</Badge>
		{/if}
	</div>
	<p class="text-sm text-navy-700">{formatRupiah(vendor.priceMin)} – {formatRupiah(vendor.priceMax)}</p>
	<p class="text-xs text-navy-400">⭐ {vendor.rating.toFixed(1)} ({vendor.reviewCount} ulasan)</p>
</a>
