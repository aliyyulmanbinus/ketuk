<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { createChecklistItem, deleteChecklistItem, updateChecklistItem } from '$lib/api';
	import { ChecklistList } from '$lib/components/domain';
	import { Button, Input, Modal } from '$lib/components/ui';
	import { pushToast } from '$lib/stores/toast.svelte';
	import type { ChecklistItem } from '@ketuk/shared';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let modalOpen = $state(false);
	let title = $state('');
	let submitting = $state(false);

	async function handleAdd(event: SubmitEvent) {
		event.preventDefault();
		submitting = true;
		try {
			await createChecklistItem(data.eventId, { title }, { accessToken: $page.data.accessToken });
			pushToast('Checklist ditambahkan.', 'success');
			title = '';
			modalOpen = false;
			await invalidateAll();
		} catch {
			pushToast('Gagal menambah checklist.', 'error');
		} finally {
			submitting = false;
		}
	}

	async function handleToggle(item: ChecklistItem) {
		try {
			await updateChecklistItem(
				data.eventId,
				item.id,
				{ isDone: !item.isDone },
				{ accessToken: $page.data.accessToken },
			);
			await invalidateAll();
		} catch {
			pushToast('Gagal mengubah status.', 'error');
		}
	}

	async function handleDelete(item: ChecklistItem) {
		try {
			await deleteChecklistItem(data.eventId, item.id, { accessToken: $page.data.accessToken });
			await invalidateAll();
		} catch {
			pushToast('Gagal menghapus item.', 'error');
		}
	}
</script>

<svelte:head>
	<title>Checklist — Ketuk.id</title>
</svelte:head>

<div class="flex items-center justify-between">
	<div>
		<h1 class="font-display text-2xl font-bold text-navy-900">Checklist</h1>
		<a href="/planner?event={data.eventId}" class="text-sm text-navy-400 hover:text-navy-700">
			← Kembali ke Planner
		</a>
	</div>
	<Button onclick={() => (modalOpen = true)}>Tambah Item</Button>
</div>

<div class="mt-6">
	{#if data.error}
		<p class="rounded-lg bg-red-50 p-4 text-sm text-red-600">{data.error}</p>
	{:else}
		<ChecklistList items={data.items} onToggle={handleToggle} onDelete={handleDelete} />
	{/if}
</div>

<Modal open={modalOpen} title="Tambah Item Checklist" onclose={() => (modalOpen = false)}>
	<form class="flex flex-col gap-4" onsubmit={handleAdd}>
		<Input label="Judul item" bind:value={title} required />
		<Button type="submit" loading={submitting}>Tambah</Button>
	</form>
</Modal>
