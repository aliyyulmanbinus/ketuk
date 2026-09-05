<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createSupabaseBrowserClient } from '$lib/supabase/client';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	interface Props {
		children: Snippet;
		data: LayoutData;
	}

	let { children, data }: Props = $props();

	let mobileOpen = $state(false);

	const navItems = [
		{ href: '/dashboard', label: 'Beranda', icon: '🏠' },
		{ href: '/undangan', label: 'Undangan', icon: '💌' },
		{ href: '/planner', label: 'Planner', icon: '📋' },
		{ href: '/vendor', label: 'Vendor', icon: '🛍️' },
		{ href: '/hadiah', label: 'Hadiah', icon: '🎁' },
	];

	const supabase = createSupabaseBrowserClient();

	async function handleLogout() {
		await supabase.auth.signOut();
		goto('/');
	}
</script>

<div class="flex min-h-screen bg-navy-50">
	<aside class="hidden w-64 flex-col border-r border-navy-100 bg-white p-6 lg:flex">
		<a href="/dashboard" class="font-display text-xl font-bold text-navy-900">
			Ketuk<span class="text-coral-500">.id</span>
		</a>
		<nav class="mt-8 flex flex-col gap-1">
			{#each navItems as item (item.href)}
				<a
					href={item.href}
					class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
						{$page.url.pathname.startsWith(item.href)
						? 'bg-coral-100 text-coral-600'
						: 'text-navy-600 hover:bg-navy-50'}"
				>
					<span aria-hidden="true">{item.icon}</span>
					{item.label}
				</a>
			{/each}
		</nav>
		<div class="mt-auto flex flex-col gap-2 border-t border-navy-100 pt-4">
			<p class="truncate text-xs text-navy-400">{data.user.email}</p>
			<button
				type="button"
				onclick={handleLogout}
				class="text-left text-sm font-medium text-navy-500 hover:text-navy-900"
			>
				Keluar
			</button>
		</div>
	</aside>

	<div class="flex flex-1 flex-col">
		<header class="flex items-center justify-between border-b border-navy-100 bg-white px-4 py-3 lg:hidden">
			<a href="/dashboard" class="font-display text-lg font-bold text-navy-900">
				Ketuk<span class="text-coral-500">.id</span>
			</a>
			<button
				type="button"
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-label="Buka menu navigasi"
				aria-expanded={mobileOpen}
				class="text-2xl"
			>
				☰
			</button>
		</header>
		{#if mobileOpen}
			<nav class="flex flex-col gap-1 border-b border-navy-100 bg-white p-3 lg:hidden">
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						class="rounded-lg px-3 py-2 text-sm font-medium text-navy-600 hover:bg-navy-50"
						onclick={() => (mobileOpen = false)}
					>
						{item.icon} {item.label}
					</a>
				{/each}
				<button
					type="button"
					onclick={handleLogout}
					class="rounded-lg px-3 py-2 text-left text-sm font-medium text-navy-500"
				>
					Keluar
				</button>
			</nav>
		{/if}
		<main class="flex-1 p-4 sm:p-8">
			{@render children()}
		</main>
	</div>
</div>
