<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-navy-50 px-4">
	<div class="w-full max-w-sm">
		<a href="/" class="mb-8 block text-center font-display text-2xl font-bold text-navy-900">
			Ketuk<span class="text-coral-500">.id</span>
		</a>
		<div class="rounded-2xl border border-navy-100 bg-white p-8 shadow-sm">
			{@render children()}
		</div>
	</div>
</div>
