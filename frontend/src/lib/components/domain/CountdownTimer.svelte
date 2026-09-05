<script lang="ts">
	import { getCountdown } from '@ketuk/shared';

	interface Props {
		/** ISO 8601 */
		date: string;
	}

	let { date }: Props = $props();

	let countdown = $state(getCountdown(date));

	$effect(() => {
		const interval = setInterval(() => {
			countdown = getCountdown(date);
		}, 1000);
		return () => clearInterval(interval);
	});

	const units = $derived([
		{ label: 'Hari', value: countdown.days },
		{ label: 'Jam', value: countdown.hours },
		{ label: 'Menit', value: countdown.minutes },
		{ label: 'Detik', value: countdown.seconds },
	]);
</script>

{#if countdown.isPast}
	<p class="text-center text-lg font-medium text-white">Acara sudah berlangsung 🎉</p>
{:else}
	<div class="flex justify-center gap-3 sm:gap-6">
		{#each units as unit (unit.label)}
			<div class="flex flex-col items-center">
				<span class="font-display text-3xl font-bold text-white sm:text-4xl">
					{String(unit.value).padStart(2, '0')}
				</span>
				<span class="text-xs text-white/70">{unit.label}</span>
			</div>
		{/each}
	</div>
{/if}
