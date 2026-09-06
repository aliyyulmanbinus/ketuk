<script lang="ts">
	import { InvitationView } from '$lib/components/domain';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>{data.event.title} | Ketuk.id</title>
	<meta property="og:title" content={data.event.title} />
	<meta
		property="og:description"
		content="Kamu diundang! Lihat detail acara dan konfirmasi kehadiranmu di sini."
	/>
	{#if data.event.coverImage}
		<meta property="og:image" content={data.event.coverImage} />
	{/if}
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<InvitationView event={data.event} giftProducts={data.giftProducts} />
