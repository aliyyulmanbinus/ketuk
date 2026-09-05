<script lang="ts">
	import { EVENT_TYPE_CONFIGS, PLANS } from '@ketuk/shared';
	import { PlanCard } from '$lib/components/domain';
	import { Button } from '$lib/components/ui';

	const modules = [
		{
			emoji: '💌',
			bgClass: 'bg-undangan-100',
			title: 'Undangan',
			desc: 'Buat dan sebar undangan digital, kelola RSVP tanpa ribet.',
			href: '/daftar',
		},
		{
			emoji: '📋',
			bgClass: 'bg-planner-100',
			title: 'Planner',
			desc: 'Budget tracker, checklist, dan timeline persiapan dalam satu tempat.',
			href: '/daftar',
		},
		{
			emoji: '🛍️',
			bgClass: 'bg-vendor-100',
			title: 'Vendor',
			desc: 'Cari katering, dekorasi, fotografer, WO, sampai MUA terpercaya.',
			href: '/vendor',
		},
		{
			emoji: '🎁',
			bgClass: 'bg-hadiah-100',
			title: 'Hadiah',
			desc: 'Kirim hampers, bouquet, atau amplop digital ke penyelenggara acara.',
			href: '/daftar',
		},
	];

	const eventTypesToShow = EVENT_TYPE_CONFIGS.filter((c) => c.value !== 'other');
</script>

<svelte:head>
	<title>Ketuk.id — Satu Tempat untuk Segala Urusan Acara</title>
	<meta
		name="description"
		content="Undangan digital, planner acara, marketplace vendor, dan kirim hadiah — semua dalam satu platform. Untuk pernikahan, ulang tahun, khitanan, dan acara apa pun."
	/>
</svelte:head>

<!-- Hero -->
<section class="bg-navy-900 py-20 text-white sm:py-28">
	<div class="mx-auto max-w-4xl px-4 text-center sm:px-6">
		<h1 class="font-display text-4xl leading-tight font-bold sm:text-5xl">
			Satu tempat untuk <span class="text-coral-500">segala urusan acara</span>
		</h1>
		<p class="mx-auto mt-5 max-w-2xl text-lg text-white/70">
			Dari pernikahan sampai syukuran kantor — Ketuk bantu kamu bikin undangan, atur budget, cari
			vendor, dan terima hadiah. Bukan cuma soal nikahan.
		</p>
		<div class="mt-8 flex flex-wrap justify-center gap-3">
			<Button href="/daftar" size="lg">Mulai Gratis</Button>
			<Button href="/template" variant="ghost" size="lg">Lihat Template</Button>
		</div>
		<div class="mt-12 flex flex-wrap justify-center gap-2.5 text-sm text-white/60">
			{#each EVENT_TYPE_CONFIGS as type (type.value)}
				<span class="rounded-full border border-white/15 px-4 py-1.5">{type.emoji} {type.label}</span>
			{/each}
		</div>
	</div>
</section>

<!-- Mau melakukan apa? -->
<section class="py-20">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<h2 class="text-center font-display text-3xl font-bold text-navy-900">Mau melakukan apa?</h2>
		<p class="mt-3 text-center text-navy-500">
			Empat modul yang bisa dipakai terpisah — beli sesuai kebutuhan, bukan paket lengkap.
		</p>
		<div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each modules as m (m.title)}
				<a
					href={m.href}
					class="flex flex-col gap-3 rounded-2xl border border-navy-100 p-6 transition-shadow hover:shadow-lg"
				>
					<span class="flex h-12 w-12 items-center justify-center rounded-xl text-2xl {m.bgClass}">
						{m.emoji}
					</span>
					<h3 class="font-display text-lg font-semibold text-navy-900">{m.title}</h3>
					<p class="text-sm text-navy-500">{m.desc}</p>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Dua sisi ekosistem -->
<section class="bg-navy-50 py-20">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<h2 class="text-center font-display text-3xl font-bold text-navy-900">Bukan cuma untuk penyelenggara</h2>
		<p class="mx-auto mt-3 max-w-2xl text-center text-navy-500">
			Kebanyakan platform undangan cuma mikirin host. Ketuk melayani dua sisi sekaligus — orang yang
			bikin acara, dan orang yang diundang.
		</p>
		<div class="mt-12 grid gap-6 md:grid-cols-2">
			<div class="rounded-2xl bg-white p-8">
				<span class="text-3xl" aria-hidden="true">🧑‍💼</span>
				<h3 class="mt-4 font-display text-xl font-semibold text-navy-900">Untuk Penyelenggara</h3>
				<p class="mt-2 text-sm text-navy-500">
					Kelola undangan, budget, checklist, dan vendor dari satu dashboard. Tidak perlu pindah-pindah
					aplikasi buat urus satu acara.
				</p>
			</div>
			<div class="rounded-2xl bg-white p-8">
				<span class="text-3xl" aria-hidden="true">🎉</span>
				<h3 class="mt-4 font-display text-xl font-semibold text-navy-900">Untuk Tamu</h3>
				<p class="mt-2 text-sm text-navy-500">
					RSVP, kirim ucapan, dan kirim hadiah langsung dari link undangan — tanpa perlu daftar akun
					sama sekali.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Jenis acara -->
<section class="py-20">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<h2 class="text-center font-display text-3xl font-bold text-navy-900">Untuk acara apa saja</h2>
		<p class="mt-3 text-center text-navy-500">
			Bukan cuma pernikahan — Ketuk dipakai untuk segala jenis acara yang orang Indonesia rayakan.
		</p>
		<div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each eventTypesToShow as type (type.value)}
				<div class="flex items-start gap-4 rounded-xl border border-navy-100 p-5">
					<span class="text-3xl" aria-hidden="true">{type.emoji}</span>
					<div>
						<h3 class="font-display font-semibold text-navy-900">{type.label}</h3>
						<p class="mt-1 text-sm text-navy-500">
							{type.defaultChecklist.length} item checklist siap pakai.
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Harga -->
<section class="bg-navy-50 py-20">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<h2 class="text-center font-display text-3xl font-bold text-navy-900">Harga yang jelas dari awal</h2>
		<p class="mt-3 text-center text-navy-500">Bayar per acara, bukan langganan bulanan.</p>
		<div class="mt-12 grid gap-6 md:grid-cols-3">
			{#each PLANS as plan (plan.id)}
				<PlanCard {plan} highlighted={plan.id === 'pro'} />
			{/each}
		</div>
	</div>
</section>

<!-- CTA penutup -->
<section class="bg-navy-900 py-20 text-white">
	<div class="mx-auto max-w-2xl px-4 text-center sm:px-6">
		<h2 class="font-display text-3xl font-bold">Bikin acara jadi mudah</h2>
		<p class="mt-3 text-white/70">Mulai gratis, upgrade kalau memang butuh fitur lebih.</p>
		<div class="mt-8">
			<Button href="/daftar" size="lg">Mulai Sekarang</Button>
		</div>
	</div>
</section>
