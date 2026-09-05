<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props {
		id?: string;
		name?: string;
		type?: string;
		label?: string;
		placeholder?: string;
		value?: string;
		error?: string;
		hint?: string;
		disabled?: boolean;
		required?: boolean;
		autocomplete?: HTMLInputAttributes['autocomplete'];
		oninput?: (event: Event) => void;
	}

	let {
		id,
		name,
		type = 'text',
		label,
		placeholder,
		value = $bindable(''),
		error,
		hint,
		disabled = false,
		required = false,
		autocomplete,
		oninput,
	}: Props = $props();

	const inputId = $derived(id ?? name ?? label);
</script>

<div class="flex flex-col gap-1.5">
	{#if label}
		<label for={inputId} class="text-sm font-medium text-navy-800">
			{label}
			{#if required}<span class="text-coral-500">*</span>{/if}
		</label>
	{/if}
	<input
		id={inputId}
		{name}
		{type}
		{placeholder}
		{disabled}
		{required}
		{autocomplete}
		{oninput}
		bind:value
		aria-invalid={error ? 'true' : undefined}
		aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
		class="rounded-lg border px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-navy-400
			focus-visible:outline-2 disabled:cursor-not-allowed disabled:bg-navy-50
			{error ? 'border-red-400' : 'border-navy-200'}"
	/>
	{#if error}
		<p id="{inputId}-error" class="text-sm text-red-600">{error}</p>
	{:else if hint}
		<p id="{inputId}-hint" class="text-sm text-navy-400">{hint}</p>
	{/if}
</div>
