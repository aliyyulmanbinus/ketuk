<script module lang="ts">
	export interface SelectOption {
		value: string;
		label: string;
	}
</script>

<script lang="ts">
	interface Props {
		id?: string;
		name?: string;
		label?: string;
		options: SelectOption[];
		value?: string;
		placeholder?: string;
		error?: string;
		disabled?: boolean;
		required?: boolean;
	}

	let {
		id,
		name,
		label,
		options,
		value = $bindable(''),
		placeholder = 'Pilih salah satu',
		error,
		disabled = false,
		required = false,
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
	<select
		id={inputId}
		{name}
		{disabled}
		{required}
		bind:value
		aria-invalid={error ? 'true' : undefined}
		class="rounded-lg border bg-white px-3.5 py-2.5 text-sm text-navy-900
			focus-visible:outline-2 disabled:cursor-not-allowed disabled:bg-navy-50
			{error ? 'border-red-400' : 'border-navy-200'}"
	>
		<option value="" disabled selected={!value}>{placeholder}</option>
		{#each options as option (option.value)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
	{#if error}
		<p class="text-sm text-red-600">{error}</p>
	{/if}
</div>
