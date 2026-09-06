<script lang="ts">
	import { X } from '@lucide/svelte';
	import type { TemplateItem } from '$lib/data/templates';
	import EnvelopeCard from './EnvelopeCard.svelte';

	interface Props {
		open: boolean;
		template: TemplateItem;
		onclose: () => void;
	}

	let { open, template, onclose }: Props = $props();

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onclose();
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onclose();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if open}
	<!-- Lightbox Backdrop (Exactly like Screenshot 2) -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-espresso-950/80 p-4 sm:p-6 backdrop-blur-md transition-opacity duration-300"
		onclick={handleBackdropClick}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') onclose();
		}}
		role="dialog"
		aria-modal="true"
		aria-label="Expanded View Undangan {template.title}"
		tabindex="-1"
	>
		<!-- Top-Right Close Button -->
		<button
			type="button"
			class="absolute top-5 right-5 sm:top-8 sm:right-8 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white text-espresso-900 shadow-xl transition-transform duration-200 hover:scale-110 active:scale-90"
			onclick={onclose}
			aria-label="Tutup tampilan penuh"
		>
			<X size={20} strokeWidth={2.5} />
		</button>

		<!-- Centered High-Res Envelope Presentation -->
		<div class="relative max-h-[92vh] max-w-full overflow-y-auto p-2 scrollbar-none">
			<EnvelopeCard {template} interactive={true} />
		</div>
	</div>
{/if}
