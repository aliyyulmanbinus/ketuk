<script lang="ts">
	import { EVENT_TYPE_CONFIGS } from '@ketuk/shared';
	import { Button } from '$lib/components/ui';
</script>

<svelte:head>
	<title>Template Undangan — Ketuk.id</title>
	<meta name="description" content="Galeri template undangan digital Ketuk.id untuk berbagai jenis acara." />
</svelte:head>

<section class="py-20">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<h1 class="text-center font-display text-4xl font-bold text-navy-900">Template untuk setiap acara</h1>
		<p class="mx-auto mt-3 max-w-xl text-center text-navy-500">
			Setiap jenis acara punya nuansa yang beda. Pilih jenis acaramu, template awal akan menyesuaikan.
		</p>
		<div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each EVENT_TYPE_CONFIGS as type (type.value)}
				<a
					href="/daftar"
					class="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 transition-shadow hover:shadow-lg"
				>
					<div class="flex aspect-[4/3] items-center justify-center bg-navy-900 text-5xl">
						{type.emoji}
					</div>
					<div class="p-5">
						<h3 class="font-display font-semibold text-navy-900">{type.label}</h3>
						<p class="mt-1 text-sm text-navy-500">Mulai dari template dasar, bisa dikustom sepenuhnya.</p>
					</div>
				</a>
			{/each}
		</div>
		<div class="mt-12 text-center">
			<Button href="/daftar" size="lg">Coba Sekarang</Button>
		</div>
	</div>
</section>
