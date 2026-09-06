<script lang="ts">
	import {
		TemplateCard,
		TemplatePreviewModal,
		type TemplateItem,
	} from '$lib/components/domain';
	import { Sparkles, ArrowRight } from '@lucide/svelte';

	let activeCategory = $state('Semua');
	let selectedTemplate = $state<TemplateItem | null>(null);
	let isPreviewOpen = $state(false);

	const filterCategories = [
		'Semua',
		'Klasik',
		'Minimalis',
		'Elegan',
		'Modern',
		'Botanical',
		'Luxury Gold',
	];

	const templates: TemplateItem[] = [
		{
			id: 'capri-rosa',
			title: 'Capri Rosa',
			subtitle: 'Estetika memikat terinspirasi nuansa keanggunan abadi pesisir Capri dengan sentuhan blush lembut.',
			category: 'Elegan',
			badge: 'POPULER',
			price: 'Rp 149.000',
			slug: 'capri-rosa',
			palette: {
				bgGradient: 'bg-gradient-to-b from-rose-50 via-cream-50 to-cream-100',
				accentColor: '#882235',
				accentTextColor: '#882235',
				sealColor: '#882235',
				phoneBorder: 'border-rose-900',
			},
			preview: {
				coupleName: 'Capri & Rosa',
				date: 'Sabtu, 14 Nov 2026',
				style: 'Romantic Floral',
			},
		},
		{
			id: 'firenze',
			title: 'Firenze',
			subtitle: 'Kemegahan arsitektur Renaissance Italia dengan tipografi klasik dan ornamen bingkai halus.',
			category: 'Klasik',
			badge: 'BESTSELLER',
			price: 'Rp 169.000',
			slug: 'firenze',
			palette: {
				bgGradient: 'bg-gradient-to-b from-stone-50 via-cream-50 to-cream-100',
				accentColor: '#460d17',
				accentTextColor: '#8c6a3e',
				sealColor: '#a98350',
				phoneBorder: 'border-stone-800',
			},
			preview: {
				coupleName: 'Fiona & Lorenzo',
				date: 'Minggu, 20 Des 2026',
				style: 'Classic Renaissance',
			},
		},
		{
			id: 'tuscan-garden',
			title: 'Tuscan Garden',
			subtitle: 'Nuansa alam perbukitan Tuscany dengan ilustrasi olive botanical yang tenang dan teduh.',
			category: 'Botanical',
			badge: 'BARU',
			price: 'Rp 149.000',
			slug: 'tuscan-garden',
			palette: {
				bgGradient: 'bg-gradient-to-b from-emerald-50/70 via-cream-50 to-cream-100',
				accentColor: '#166534',
				accentTextColor: '#15803d',
				sealColor: '#2e5c3e',
				phoneBorder: 'border-emerald-950',
			},
			preview: {
				coupleName: 'Tara & Julian',
				date: 'Sabtu, 05 Sep 2026',
				style: 'Botanical Olive',
			},
		},
		{
			id: 'veneto-romantis',
			title: 'Veneto Romantis',
			subtitle: 'Kemewahan warna bordeaux wine dengan sentuhan foil emas untuk pesta malam berkelas.',
			category: 'Elegan',
			badge: 'EKSKLUSIF',
			price: 'Rp 179.000',
			slug: 'veneto-romantis',
			palette: {
				bgGradient: 'bg-gradient-to-b from-wine-50 via-cream-50 to-wine-100/50',
				accentColor: '#5c1421',
				accentTextColor: '#c5a478',
				sealColor: '#6f1929',
				phoneBorder: 'border-wine-950',
			},
			preview: {
				coupleName: 'Valerie & Nathan',
				date: 'Sabtu, 12 Des 2026',
				style: 'Haute Bordeaux',
			},
		},
		{
			id: 'amalfi-sun',
			title: 'Amalfi Sun',
			subtitle: 'Kehangatan hangat mediterania dengan aksen lemon blossom dan latar kertas bertekstur.',
			category: 'Modern',
			badge: 'BARU',
			price: 'Rp 149.000',
			slug: 'amalfi-sun',
			palette: {
				bgGradient: 'bg-gradient-to-b from-amber-50 via-cream-50 to-orange-50/50',
				accentColor: '#a98350',
				accentTextColor: '#c2410c',
				sealColor: '#c5a478',
				phoneBorder: 'border-amber-950',
			},
			preview: {
				coupleName: 'Alya & Marcel',
				date: 'Minggu, 18 Okt 2026',
				style: 'Warm Terracotta',
			},
		},
		{
			id: 'monaco-royal',
			title: 'Monaco Royal',
			subtitle: 'Simbol kemewahan absolut dengan aksen dark emerald dan sentuhan emas berkilau.',
			category: 'Luxury Gold',
			badge: 'EKSKLUSIF',
			price: 'Rp 199.000',
			slug: 'monaco-royal',
			palette: {
				bgGradient: 'bg-gradient-to-b from-zinc-50 via-cream-50 to-emerald-50/30',
				accentColor: '#064e3b',
				accentTextColor: '#8c6a3e',
				sealColor: '#a98350',
				phoneBorder: 'border-zinc-900',
			},
			preview: {
				coupleName: 'Melody & Richard',
				date: 'Sabtu, 28 Nov 2026',
				style: 'Royal Emerald',
			},
		},
		{
			id: 'santorini-white',
			title: 'Santorini White',
			subtitle: 'Kesederhanaan minimalis modern dengan ruang bernapas lapang dan tipografi monokrom.',
			category: 'Minimalis',
			badge: 'POPULER',
			price: 'Rp 139.000',
			slug: 'santorini-white',
			palette: {
				bgGradient: 'bg-gradient-to-b from-sky-50/50 via-white to-cream-50',
				accentColor: '#1e293b',
				accentTextColor: '#0284c7',
				sealColor: '#334155',
				phoneBorder: 'border-slate-800',
			},
			preview: {
				coupleName: 'Stella & Andre',
				date: 'Minggu, 04 Okt 2026',
				style: 'Pure Minimalist',
			},
		},
		{
			id: 'kyoto-blossom',
			title: 'Kyoto Blossom',
			subtitle: 'Harmoni ketenangan zen dengan dedaunan sakura lembut dan tata letak elegan kontemporer.',
			category: 'Botanical',
			badge: '',
			price: 'Rp 149.000',
			slug: 'kyoto-blossom',
			palette: {
				bgGradient: 'bg-gradient-to-b from-pink-50/70 via-cream-50 to-cream-100',
				accentColor: '#9d174d',
				accentTextColor: '#be185d',
				sealColor: '#882235',
				phoneBorder: 'border-pink-950',
			},
			preview: {
				coupleName: 'Kezia & Bryan',
				date: 'Sabtu, 19 Sep 2026',
				style: 'Zen Floral',
			},
		},
	];

	const filteredTemplates = $derived.by(() => {
		if (activeCategory === 'Semua') return templates;
		return templates.filter((t) => t.category === activeCategory);
	});

	function handlePreview(template: TemplateItem) {
		selectedTemplate = template;
		isPreviewOpen = true;
	}

	function closePreview() {
		isPreviewOpen = false;
	}
</script>

<svelte:head>
	<title>Koleksi Desain Undangan Digital | Ketuk.id</title>
	<meta
		name="description"
		content="Jelajahi seluruh koleksi template undangan pernikahan digital eksklusif Ketuk.id dengan estetika haute-couture."
	/>
</svelte:head>

<section class="py-12 sm:py-20 bg-cream-50">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mx-auto max-w-2xl text-center">
			<span class="inline-flex items-center gap-1.5 rounded-full border border-champagne-300 bg-cream-100 px-3.5 py-1 text-[11px] font-semibold tracking-widest text-espresso-700 uppercase">
				<Sparkles size={12} class="text-champagne-600" />
				Koleksi Eksklusif 2026
			</span>
			<h1 class="font-serif mt-4 text-3xl sm:text-5xl font-medium tracking-tight text-espresso-950">
				Template untuk Setiap Cerita Cinta
			</h1>
			<p class="mt-3 text-sm sm:text-base text-espresso-600 leading-relaxed">
				Setiap tema dirancang dengan presisi grafis tinggi, tipografi mewah, dan integrasi RSVP WhatsApp serta musik romantis.
			</p>
		</div>

		<!-- Filter Pills -->
		<div class="mt-8 flex items-center justify-start sm:justify-center overflow-x-auto pb-2 scrollbar-none px-2">
			<div class="inline-flex items-center gap-2">
				{#each filterCategories as cat (cat)}
					<button
						type="button"
						class="shrink-0 rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all {activeCategory ===
						cat
							? 'bg-wine-800 text-white shadow-xs'
							: 'border border-cream-300/80 bg-white/80 text-espresso-700 hover:bg-cream-100 hover:border-cream-400'}"
						onclick={() => (activeCategory = cat)}
					>
						{cat}
					</button>
				{/each}
			</div>
		</div>

		<!-- Grid of Cards -->
		<div
			class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 lg:gap-7"
		>
			{#each filteredTemplates as template (template.id)}
				<TemplateCard {template} onPreview={handlePreview} />
			{/each}
		</div>

		<!-- Bottom CTA -->
		<div class="mt-16 text-center rounded-3xl border border-cream-200 bg-cream-100/70 p-8 sm:p-12 max-w-3xl mx-auto">
			<h3 class="font-serif text-2xl sm:text-3xl font-medium text-espresso-950">
				Sudah menemukan desain impian Anda?
			</h3>
			<p class="mt-2 text-xs sm:text-sm text-espresso-600">
				Mulai buat undangan Anda sekarang secara instan dalam 10 menit.
			</p>
			<div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
				<a
					href="/daftar"
					class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-wine-800 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-wine-900 transition-all"
				>
					<span>Mulai Gratis Sekarang</span>
					<ArrowRight size={14} />
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Interactive Preview Modal -->
<TemplatePreviewModal open={isPreviewOpen} template={selectedTemplate} onclose={closePreview} />
