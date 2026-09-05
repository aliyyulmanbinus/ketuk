<script lang="ts">
	import type { Plan } from '@ketuk/shared';
	import { formatRupiah } from '@ketuk/shared';
	import Button from '../ui/Button.svelte';

	interface Props {
		plan: Plan;
		highlighted?: boolean;
	}

	let { plan, highlighted = false }: Props = $props();
</script>

<div
	class="flex flex-col gap-6 rounded-2xl border p-8
		{highlighted ? 'border-coral-500 bg-navy-900 text-white shadow-xl' : 'border-navy-100 bg-white'}"
>
	<div>
		<h3 class="font-display text-xl font-bold">{plan.name}</h3>
		<p class="mt-1 text-sm {highlighted ? 'text-white/70' : 'text-navy-500'}">{plan.description}</p>
	</div>
	<p class="font-display text-3xl font-bold">
		{plan.price === 0 ? 'Gratis' : formatRupiah(plan.price)}
		{#if plan.price > 0}
			<span class="text-sm font-normal {highlighted ? 'text-white/60' : 'text-navy-400'}">/acara</span>
		{/if}
	</p>
	<ul class="flex flex-1 flex-col gap-2.5 text-sm">
		{#each plan.features as feature (feature.label)}
			<li class="flex items-center gap-2 {feature.included ? '' : highlighted ? 'text-white/40' : 'text-navy-300'}">
				<span aria-hidden="true">{feature.included ? '✓' : '–'}</span>
				{feature.label}
			</li>
		{/each}
	</ul>
	<Button variant={highlighted ? 'primary' : 'secondary'} href="/daftar" fullWidth>
		{plan.price === 0 ? 'Mulai Gratis' : 'Pilih Paket'}
	</Button>
</div>
