<script lang="ts">
	import { Button } from '$lib/components/ui';
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
		<div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
			<a href="/" class="font-display text-xl font-bold text-navy-900">
				Ketuk<span class="text-coral-500">.id</span>
			</a>
			<nav class="hidden items-center gap-6 sm:flex">
				{#each navLinks as link (link.href)}
					<a href={link.href} class="text-sm font-medium text-navy-600 hover:text-navy-900">{link.label}</a>
				{/each}
			</nav>
			<div class="hidden items-center gap-3 sm:flex">
				<a href="/masuk" class="text-sm font-medium text-navy-600 hover:text-navy-900">Masuk</a>
				<Button href="/daftar" size="sm">Mulai Gratis</Button>
			</div>
			<button
				type="button"
				class="text-2xl sm:hidden"
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-label="Buka menu navigasi"
				aria-expanded={mobileOpen}
			>
				☰
			</button>
		</div>
		{#if mobileOpen}
			<nav class="flex flex-col gap-1 border-t border-navy-100 px-4 py-3 sm:hidden">
				{#each navLinks as link (link.href)}
					<a href={link.href} class="rounded-lg px-3 py-2 text-sm font-medium text-navy-600 hover:bg-navy-50">
						{link.label}
					</a>
				{/each}
				<a href="/masuk" class="rounded-lg px-3 py-2 text-sm font-medium text-navy-600 hover:bg-navy-50">Masuk</a>
				<a href="/daftar" class="rounded-lg bg-coral-500 px-3 py-2 text-center text-sm font-medium text-white">
					Mulai Gratis
				</a>
			</nav>
		{/if}
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t border-navy-100 bg-navy-50 py-10">
		<div class="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-navy-500 sm:px-6">
			<p class="font-display text-lg font-bold text-navy-900">
				Ketuk<span class="text-coral-500">.id</span>
			</p>
			<p>Satu tempat untuk segala urusan acara.</p>
			<p>© {new Date().getFullYear()} Ketuk.id</p>
		</div>
	</footer>
</div>
