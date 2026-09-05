<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { createTimelineItem, deleteTimelineItem } from '$lib/api';
	import { Button, EmptyState, Input, Modal } from '$lib/components/ui';
	import { pushToast } from '$lib/stores/toast.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let modalOpen = $state(false);
	let title = $state('');
	let time = $state('08:00');
	let pic = $state('');
	let submitting = $state(false);

	async function handleAdd(event: SubmitEvent) {
		event.preventDefault();
		submitting = true;
		try {
			await createTimelineItem(
				data.eventId,
				{ title, time, pic: pic || undefined },
				{ accessToken: $page.data.accessToken },
			);
			pushToast('Item rundown ditambahkan.', 'success');
			title = '';
			pic = '';
			modalOpen = false;
			await invalidateAll();
		} catch {
			pushToast('Gagal menambah item.', 'error');
		} finally {
			submitting = false;
		}
	}

	async function handleDelete(id: string) {
		try {
			await deleteTimelineItem(data.eventId, id, { accessToken: $page.data.accessToken });
			await invalidateAll();
		} catch {
			pushToast('Gagal menghapus item.', 'error');
		}
	}

	const sortedItems = $derived([...data.items].sort((a, b) => a.time.localeCompare(b.time)));
</script>

<svelte:head>
	<title>Timeline — Ketuk.id</title>
</svelte:head>

<div class="flex items-center justify-between">
	<div>
		<h1 class="font-display text-2xl font-bold text-navy-900">Timeline Acara</h1>
		<a href="/planner?event={data.eventId}" class="text-sm text-navy-400 hover:text-navy-700">
			← Kembali ke Planner
		</a>
	</div>
	<Button onclick={() => (modalOpen = true)}>Tambah Item</Button>
</div>

<div class="mt-6">
	{#if data.error}
		<p class="rounded-lg bg-red-50 p-4 text-sm text-red-600">{data.error}</p>
	{:else if sortedItems.length === 0}
		<EmptyState icon="🕐" title="Belum ada rundown" description="Susun urutan acara hari-H." />
	{:else}
		<ol class="flex flex-col divide-y divide-navy-100 rounded-xl border border-navy-100 bg-white">
			{#each sortedItems as item (item.id)}
				<li class="flex items-center gap-4 px-4 py-3">
					<span class="w-14 shrink-0 font-mono text-sm text-navy-500">{item.time}</span>
					<span class="flex-1 text-sm text-navy-900">{item.title}</span>
					{#if item.pic}
						<span class="text-xs text-navy-400">{item.pic}</span>
					{/if}
					<button
						type="button"
						class="text-navy-300 hover:text-red-600"
						onclick={() => handleDelete(item.id)}
						aria-label="Hapus item rundown"
					>
						✕
					</button>
				</li>
			{/each}
		</ol>
	{/if}
</div>

<Modal open={modalOpen} title="Tambah Item Rundown" onclose={() => (modalOpen = false)}>
	<form class="flex flex-col gap-4" onsubmit={handleAdd}>
		<Input label="Judul kegiatan" bind:value={title} required />
		<Input label="Jam" type="time" bind:value={time} required />
		<Input label="Penanggung jawab (opsional)" bind:value={pic} />
		<Button type="submit" loading={submitting}>Tambah</Button>
	</form>
</Modal>
