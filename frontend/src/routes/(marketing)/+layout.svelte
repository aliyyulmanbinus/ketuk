<script lang="ts">
	import { Button } from '$lib/components/ui';
	import { Menu, X } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let mobileOpen = $state(false);

	const navLinks = [
		{ href: '/template', label: 'Template' },
		{ href: '/harga', label: 'Harga' },
		{ href: '/tentang', label: 'Tentang' },
	];
</script>

<div class="flex min-h-screen flex-col bg-white text-navy-900">
	<header class="sticky top-0 z-40 border-b border-navy-100 bg-white/90 backdrop-blur">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4">
			<a href="/" class="font-display text-lg font-bold text-navy-900 sm:text-xl">
				Ketuk<span class="text-coral-500">.id</span>
			</a>
			<nav class="hidden items-center gap-8 md:flex">
				{#each navLinks as link (link.href)}
					<a
						href={link.href}
						class="text-sm font-medium text-navy-600 transition-colors hover:text-navy-900"
					>
						{link.label}
					</a>
				{/each}
			</nav>
			<div class="hidden items-center gap-3 md:flex">
				<a
					href="/masuk"
					class="text-sm font-medium text-navy-600 transition-colors hover:text-navy-900"
				>
					Masuk
				</a>
				<Button href="/daftar" size="sm">Mulai Gratis</Button>
			</div>
			<button
				type="button"
				class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy-700 hover:bg-navy-50 md:hidden"
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
				aria-expanded={mobileOpen}
			>
				{#if mobileOpen}
					<X size={22} />
				{:else}
					<Menu size={22} />
				{/if}
			</button>
		</div>
		{#if mobileOpen}
			<nav class="flex flex-col gap-1 border-t border-navy-100 bg-white px-4 py-3 md:hidden">
				{#each navLinks as link (link.href)}
					<a
						href={link.href}
						class="rounded-lg px-3 py-2.5 text-sm font-medium text-navy-600 hover:bg-navy-50"
						onclick={() => (mobileOpen = false)}
					>
						{link.label}
					</a>
				{/each}
				<div class="mt-2 flex flex-col gap-2 border-t border-navy-100 pt-3">
					<a
						href="/masuk"
						class="rounded-lg px-3 py-2.5 text-sm font-medium text-navy-600 hover:bg-navy-50"
					>
						Masuk
					</a>
					<a
						href="/daftar"
						class="rounded-lg bg-coral-500 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-coral-600"
					>
						Mulai Gratis
					</a>
				</div>
			</nav>
		{/if}
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t border-navy-100 bg-navy-50 py-12">
		<div class="mx-auto flex max-w-6xl flex-col gap-3 px-4 text-sm text-navy-500 sm:px-6">
			<p class="font-display text-lg font-bold text-navy-900">
				Ketuk<span class="text-coral-500">.id</span>
			</p>
			<p>Satu tempat untuk segala urusan acara.</p>
			<p class="text-xs text-navy-400">© {new Date().getFullYear()} Ketuk.id</p>
		</div>
	</footer>
</div>
