<script lang="ts">
	import { EVENT_TYPE_CONFIGS } from '@ketuk/shared';
	import { Button } from '$lib/components/ui';
	import { getEventIcon } from '$lib/icons';

	const templates = EVENT_TYPE_CONFIGS.map((c) => ({
		...c,
		Icon: getEventIcon(c.value),
	}));
</script>

<svelte:head>
	<title>Template Undangan | Ketuk.id</title>
	<meta
		name="description"
		content="Galeri template undangan digital Ketuk.id untuk berbagai jenis acara."
	/>
</svelte:head>

<section class="py-16 sm:py-24">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="mx-auto max-w-2xl text-center">
			<h1 class="font-display text-3xl font-bold text-navy-900 sm:text-4xl">
				Template untuk setiap acara
			</h1>
			<p class="mt-3 text-navy-500">
				Setiap jenis acara punya nuansa yang beda. Pilih jenis acaramu, template awal akan
				menyesuaikan.
			</p>
		</div>
		<div class="mt-10 grid gap-4 sm:mt-12 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each templates as type (type.value)}
				<a
					href="/daftar"
					class="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white transition-all hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-lg"
				>
					<div
						class="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-navy-800 to-navy-900"
					>
						<div
							class="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,107,90,0.18),transparent_65%)]"
						></div>
						<type.Icon size={56} class="relative text-white/85" strokeWidth={1.5} />
					</div>
					<div class="p-5">
						<h3 class="font-display font-semibold text-navy-900">{type.label}</h3>
						<p class="mt-1 text-sm text-navy-500">
							Mulai dari template dasar, bisa dikustom sepenuhnya.
						</p>
					</div>
				</a>
			{/each}
		</div>
		<div class="mt-12 text-center">
			<Button href="/daftar" size="lg">Coba Sekarang</Button>
		</div>
	</div>
</section>
