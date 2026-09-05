<script lang="ts">
	import type { WishItem } from '$lib/api';
	import Skeleton from '../ui/Skeleton.svelte';

	interface Props {
		wishes: WishItem[];
		loading?: boolean;
	}

	let { wishes, loading = false }: Props = $props();
</script>

{#if loading}
	<div class="flex flex-col gap-3">
		{#each Array(3) as _}
			<Skeleton height="4rem" />
		{/each}
	</div>
{:else if wishes.length === 0}
	<p class="text-center text-sm text-white/60">Belum ada ucapan. Jadilah yang pertama mengirim.</p>
{:else}
	<ul class="flex flex-col gap-3">
		{#each wishes as wish (wish.id)}
			<li class="rounded-xl border border-white/10 bg-white/5 p-4">
				<p class="font-medium text-white">{wish.name}</p>
				<p class="mt-1 text-sm text-white/80">{wish.message}</p>
			</li>
		{/each}
	</ul>
{/if}
