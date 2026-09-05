<script lang="ts">
	import { dismissToast, getToasts } from '$lib/stores/toast.svelte';

	const toasts = $derived(getToasts());

	const toneClasses = {
		success: 'bg-vendor-600',
		error: 'bg-red-600',
		info: 'bg-navy-900',
	} as const;
</script>

<div class="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4">
	{#each toasts as toast (toast.id)}
		<div
			class="pointer-events-auto flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg {toneClasses[
				toast.type
			]}"
			role="status"
		>
			<span>{toast.message}</span>
			<button
				type="button"
				onclick={() => dismissToast(toast.id)}
				class="text-white/70 hover:text-white"
				aria-label="Tutup notifikasi"
			>
				✕
			</button>
		</div>
	{/each}
</div>
