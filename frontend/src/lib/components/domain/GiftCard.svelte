<script lang="ts">
	import type { GiftProduct } from '@ketuk/shared';
	import { formatRupiah } from '@ketuk/shared';
	import Button from '../ui/Button.svelte';

	interface Props {
		product: GiftProduct;
		onSelect?: (product: GiftProduct) => void;
	}

	let { product, onSelect }: Props = $props();
</script>

<div class="flex flex-col gap-3 rounded-xl border border-navy-100 bg-white p-4">
	<div class="aspect-square overflow-hidden rounded-lg bg-navy-50">
		{#if product.images[0]}
			<img src={product.images[0]} alt={product.name} loading="lazy" class="h-full w-full object-cover" />
		{:else}
			<div class="flex h-full items-center justify-center text-3xl" aria-hidden="true">🎁</div>
		{/if}
	</div>
	<div>
		<h3 class="font-medium text-navy-900">{product.name}</h3>
		<p class="text-sm text-navy-500">{formatRupiah(product.price)}</p>
	</div>
	<Button size="sm" onclick={() => onSelect?.(product)}>Kirim Ini</Button>
</div>
