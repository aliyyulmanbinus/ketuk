<script lang="ts">
	import '../app.css';
	import { ConfirmDialog, Toast } from '$lib/components/ui';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

{@render children()}
<Toast />
<ConfirmDialog />
