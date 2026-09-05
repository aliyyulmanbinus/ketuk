<script lang="ts">
	import { page } from '$app/stores';
	import { Tabs } from '$lib/components/ui';
	import type { TabItem } from '$lib/components/ui';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	interface Props {
		children: Snippet;
		data: LayoutData;
	}

	let { children, data }: Props = $props();

	const base = $derived(`/undangan/${data.event.id}`);

	const tabs = $derived<TabItem[]>([
		{ value: 'ringkasan', label: 'Ringkasan', href: base },
		{ value: 'edit', label: 'Edit Undangan', href: `${base}/edit` },
		{ value: 'tamu', label: 'Tamu', href: `${base}/tamu` },
		{ value: 'ucapan', label: 'Ucapan', href: `${base}/ucapan` },
	]);

	const active = $derived(
		tabs.find((tab) => $page.url.pathname === tab.href)?.value ??
			(tabs.find((tab) => $page.url.pathname.startsWith(`${tab.href}/`))?.value ?? 'ringkasan'),
	);
</script>

<div class="mb-6">
	<a href="/undangan" class="text-sm text-navy-400 hover:text-navy-700">← Semua Undangan</a>
	<h1 class="mt-1 font-display text-2xl font-bold text-navy-900">{data.event.title}</h1>
</div>

<Tabs {tabs} {active} />

<div class="mt-6">
	{@render children()}
</div>
