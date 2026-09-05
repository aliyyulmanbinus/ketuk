<script lang="ts">
	interface Props {
		images: string[];
		alt?: string;
	}

	let { images, alt = 'Galeri foto' }: Props = $props();
	let activeIndex = $state<number | null>(null);
</script>

{#if images.length > 0}
	<div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
		{#each images as src, index (src)}
			<button type="button" class="aspect-square overflow-hidden rounded-lg" onclick={() => (activeIndex = index)}>
				<img
					{src}
					loading="lazy"
					alt="{alt} {index + 1}"
					class="h-full w-full object-cover transition-transform hover:scale-105"
				/>
			</button>
		{/each}
	</div>

	{#if activeIndex !== null}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
			<button
				type="button"
				class="absolute inset-0"
				aria-label="Tutup galeri"
				onclick={() => (activeIndex = null)}
			></button>
			<img
				src={images[activeIndex]}
				alt="{alt} {activeIndex + 1}"
				class="relative z-10 max-h-full max-w-full rounded-lg object-contain"
			/>
		</div>
	{/if}
{/if}
