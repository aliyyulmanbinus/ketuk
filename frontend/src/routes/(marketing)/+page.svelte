<script lang="ts">
	import { EVENT_TYPE_CONFIGS, PLANS } from '@ketuk/shared';
	import { PlanCard } from '$lib/components/domain';
	import { Button } from '$lib/components/ui';
	import {
		Mail,
		ClipboardList,
		Store,
		Gift,
		ArrowRight,
		Users,
		PartyPopper,
		Heart,
		Flower2,
		Cake,
		Building2,
		HandHeart,
		GraduationCap,
		Sparkles,
		type Icon as IconType,
	} from '@lucide/svelte';

	type Component = typeof IconType;

	const modules: {
		icon: Component;
		iconClass: string;
		bgClass: string;
		title: string;
		desc: string;
		href: string;
	}[] = [
		{
			icon: Mail,
			iconClass: 'text-undangan-600',
			bgClass: 'bg-undangan-100',
			title: 'Undangan',
			desc: 'Buat dan sebar undangan digital, kelola RSVP tanpa ribet.',
			href: '/daftar',
		},
		{
			icon: ClipboardList,
			iconClass: 'text-planner-600',
			bgClass: 'bg-planner-100',
			title: 'Planner',
			desc: 'Budget tracker, checklist, dan timeline persiapan dalam satu tempat.',
			href: '/daftar',
		},
		{
			icon: Store,
			iconClass: 'text-vendor-600',
			bgClass: 'bg-vendor-100',
			title: 'Vendor',
			desc: 'Cari katering, dekorasi, fotografer, WO, sampai MUA terpercaya.',
			href: '/vendor',
		},
		{
			icon: Gift,
			iconClass: 'text-hadiah-600',
			bgClass: 'bg-hadiah-100',
			title: 'Hadiah',
			desc: 'Kirim hampers, bouquet, atau amplop digital ke penyelenggara acara.',
			href: '/daftar',
		},
	];

	const eventIconMap: Record<string, Component> = {
		wedding: Heart,
		engagement: Flower2,
		birthday: Cake,
		khitanan: Sparkles,
		aqiqah: Sparkles,
		reunion: PartyPopper,
		corporate: Building2,
		syukuran: HandHeart,
		graduation: GraduationCap,
	};

	const eventTypesToShow = EVENT_TYPE_CONFIGS.filter((c) => c.value !== 'other').map((c) => ({
		...c,
		Icon: eventIconMap[c.value] ?? Sparkles,
	}));
</script>

<svelte:head>
	<title>Ketuk.id — Satu Tempat untuk Segala Urusan Acara</title>
	<meta
		name="description"
		content="Undangan digital, planner acara, marketplace vendor, dan kirim hadiah — semua dalam satu platform. Untuk pernikahan, ulang tahun, khitanan, dan acara apa pun."
	/>
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-navy-900 py-16 text-white sm:py-24 lg:py-32">
	<div
		class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,113,133,0.15),transparent_60%)]"
	></div>
	<div class="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
		<span
			class="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur"
		>
			<Sparkles size={12} class="text-coral-400" />
			Baru — platform terpadu acara Indonesia
		</span>
		<h1 class="mt-6 font-display text-3xl leading-tight font-bold sm:text-5xl lg:text-6xl">
			Satu tempat untuk <span class="text-coral-500">segala urusan acara</span>
		</h1>
		<p class="mx-auto mt-5 max-w-2xl text-base text-white/70 sm:text-lg">
			Dari pernikahan sampai syukuran kantor — Ketuk bantu kamu bikin undangan, atur budget, cari
			vendor, dan terima hadiah. Bukan cuma soal nikahan.
		</p>
		<div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
			<Button href="/daftar" size="lg">Mulai Gratis</Button>
			<Button href="/template" variant="ghost" size="lg">Lihat Template</Button>
		</div>
		<div class="mt-12 flex flex-wrap justify-center gap-2 text-sm text-white/60">
			{#each eventTypesToShow as type (type.value)}
				<span
					class="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur"
				>
					<type.Icon size={14} />
					{type.label}
				</span>
			{/each}
		</div>
	</div>
</section>

<!-- Modules -->
<section class="py-16 sm:py-24">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Mau melakukan apa?</h2>
			<p class="mt-3 text-navy-500">
				Empat modul yang bisa dipakai terpisah — beli sesuai kebutuhan, bukan paket lengkap.
			</p>
		</div>
		<div class="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
			{#each modules as m (m.title)}
				<a
					href={m.href}
					class="group flex flex-col gap-4 rounded-2xl border border-navy-100 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-lg"
				>
					<span
						class="inline-flex h-12 w-12 items-center justify-center rounded-xl {m.bgClass}"
					>
						<m.icon size={22} class={m.iconClass} />
					</span>
					<div class="flex-1">
						<h3 class="font-display text-lg font-semibold text-navy-900">{m.title}</h3>
						<p class="mt-1.5 text-sm text-navy-500">{m.desc}</p>
					</div>
					<span
						class="inline-flex items-center gap-1 text-sm font-medium text-coral-500 opacity-0 transition-opacity group-hover:opacity-100"
					>
						Pelajari <ArrowRight size={14} />
					</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Two sides -->
<section class="bg-navy-50 py-16 sm:py-24">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="font-display text-2xl font-bold text-navy-900 sm:text-3xl">
				Bukan cuma untuk penyelenggara
			</h2>
			<p class="mt-3 text-navy-500">
				Kebanyakan platform undangan cuma mikirin host. Ketuk melayani dua sisi sekaligus — orang
				yang bikin acara, dan orang yang diundang.
			</p>
		</div>
		<div class="mt-10 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
			<div
				class="rounded-2xl border border-navy-100 bg-white p-6 transition-shadow hover:shadow-md sm:p-8"
			>
				<span class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-coral-100">
					<Users size={22} class="text-coral-600" />
				</span>
				<h3 class="mt-4 font-display text-xl font-semibold text-navy-900">
					Untuk Penyelenggara
				</h3>
				<p class="mt-2 text-sm text-navy-500">
					Kelola undangan, budget, checklist, dan vendor dari satu dashboard. Tidak perlu
					pindah-pindah aplikasi buat urus satu acara.
				</p>
			</div>
			<div
				class="rounded-2xl border border-navy-100 bg-white p-6 transition-shadow hover:shadow-md sm:p-8"
			>
				<span class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-hadiah-100">
					<PartyPopper size={22} class="text-hadiah-600" />
				</span>
				<h3 class="mt-4 font-display text-xl font-semibold text-navy-900">Untuk Tamu</h3>
				<p class="mt-2 text-sm text-navy-500">
					RSVP, kirim ucapan, dan kirim hadiah langsung dari link undangan — tanpa perlu daftar
					akun sama sekali.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Event types -->
<section class="py-16 sm:py-24">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="font-display text-2xl font-bold text-navy-900 sm:text-3xl">
				Untuk acara apa saja
			</h2>
			<p class="mt-3 text-navy-500">
				Bukan cuma pernikahan — Ketuk dipakai untuk segala jenis acara yang orang Indonesia rayakan.
			</p>
		</div>
		<div class="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
			{#each eventTypesToShow as type (type.value)}
				<div
					class="flex items-start gap-4 rounded-xl border border-navy-100 bg-white p-5 transition-colors hover:border-navy-200"
				>
					<span class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-50">
						<type.Icon size={20} class="text-navy-700" />
					</span>
					<div class="min-w-0">
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

<!-- Pricing -->
<section class="bg-navy-50 py-16 sm:py-24">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="font-display text-2xl font-bold text-navy-900 sm:text-3xl">
				Harga yang jelas dari awal
			</h2>
			<p class="mt-3 text-navy-500">Bayar per acara, bukan langganan bulanan.</p>
		</div>
		<div class="mt-10 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-3">
			{#each PLANS as plan (plan.id)}
				<PlanCard {plan} highlighted={plan.id === 'pro'} />
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section class="bg-navy-900 py-16 text-white sm:py-24">
	<div class="mx-auto max-w-2xl px-4 text-center sm:px-6">
		<h2 class="font-display text-2xl font-bold sm:text-3xl">Bikin acara jadi mudah</h2>
		<p class="mt-3 text-white/70">Mulai gratis, upgrade kalau memang butuh fitur lebih.</p>
		<div class="mt-8">
			<Button href="/daftar" size="lg">Mulai Sekarang</Button>
		</div>
	</div>
</section>
