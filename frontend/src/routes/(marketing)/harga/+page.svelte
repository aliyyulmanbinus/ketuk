<script lang="ts">
	import { PLANS } from '@ketuk/shared';
	import { PlanCard } from '$lib/components/domain';
</script>

<svelte:head>
	<title>Harga — Ketuk.id</title>
	<meta name="description" content="Harga Ketuk.id per acara, bukan langganan bulanan. Mulai gratis, upgrade kapan saja." />
</svelte:head>

<section class="py-20">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<h1 class="text-center font-display text-4xl font-bold text-navy-900">Harga per acara, bukan langganan</h1>
		<p class="mx-auto mt-3 max-w-xl text-center text-navy-500">
			Sekali bayar untuk satu acara. Tidak ada biaya bulanan yang jalan terus meski acaranya sudah lewat.
		</p>
		<div class="mt-12 grid gap-6 md:grid-cols-3">
			{#each PLANS as plan (plan.id)}
				<PlanCard {plan} highlighted={plan.id === 'pro'} />
			{/each}
		</div>
	</div>
</section>
