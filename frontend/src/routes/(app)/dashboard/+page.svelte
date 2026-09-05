<script lang="ts">
	const actions = [
		{
			href: '/undangan',
			emoji: '💌',
			bgClass: 'bg-undangan-100',
			title: 'Kelola Undangan',
			desc: 'Buat undangan baru atau kelola yang sudah ada.',
		},
		{
			href: '/planner',
			emoji: '📋',
			bgClass: 'bg-planner-100',
			title: 'Atur Planner',
			desc: 'Budget, checklist, dan timeline acaramu.',
		},
		{
			href: '/vendor',
			emoji: '🛍️',
			bgClass: 'bg-vendor-100',
			title: 'Cari Vendor',
			desc: 'Temukan katering, dekorasi, dan vendor lainnya.',
		},
		{
			href: '/hadiah',
			emoji: '🎁',
			bgClass: 'bg-hadiah-100',
			title: 'Kelola Hadiah',
			desc: 'Lihat hadiah yang masuk untuk acaramu.',
		},
	];
</script>

<svelte:head>
	<title>Dashboard — Ketuk.id</title>
</svelte:head>

<h1 class="font-display text-2xl font-bold text-navy-900">Mau melakukan apa?</h1>
<p class="mt-1 text-navy-500">Pilih salah satu untuk mulai.</p>

<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
	{#each actions as action (action.href)}
		<a
			href={action.href}
			class="flex flex-col gap-3 rounded-2xl border border-navy-100 bg-white p-6 transition-shadow hover:shadow-md"
		>
			<span class="flex h-12 w-12 items-center justify-center rounded-xl text-2xl {action.bgClass}">
				{action.emoji}
			</span>
			<h2 class="font-display text-lg font-semibold text-navy-900">{action.title}</h2>
			<p class="text-sm text-navy-500">{action.desc}</p>
		</a>
	{/each}
</div>
