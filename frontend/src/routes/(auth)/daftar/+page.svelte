<script lang="ts">
	import { Button, Input } from '$lib/components/ui';
	import { createSupabaseBrowserClient } from '$lib/supabase/client';

	const supabase = createSupabaseBrowserClient();

	let name = $state('');
	let email = $state('');
	let sending = $state(false);
	let sent = $state(false);
	let error = $state('');

	async function handleSignup(event: SubmitEvent) {
		event.preventDefault();
		error = '';
		sending = true;
		const { error: authError } = await supabase.auth.signInWithOtp({
			email,
			options: {
				data: { name },
				emailRedirectTo: `${window.location.origin}/callback?next=${encodeURIComponent('/dashboard')}`,
			},
		});
		sending = false;
		if (authError) {
			error = 'Gagal mengirim link daftar. Coba lagi sebentar lagi.';
			return;
		}
		sent = true;
	}

	async function handleGoogle() {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: `${window.location.origin}/callback?next=${encodeURIComponent('/dashboard')}` },
		});
	}
</script>

<svelte:head>
	<title>Daftar — Ketuk.id</title>
</svelte:head>

<h1 class="font-display text-xl font-semibold text-navy-900">Mulai gratis</h1>
<p class="mt-1 text-sm text-navy-500">Tidak perlu kartu kredit, langsung bisa dipakai.</p>

{#if sent}
	<p class="mt-6 rounded-lg bg-vendor-100 p-4 text-sm text-vendor-600">
		Link masuk sudah dikirim ke {email}. Klik link itu untuk menyelesaikan pendaftaran.
	</p>
{:else}
	<form class="mt-6 flex flex-col gap-4" onsubmit={handleSignup}>
		<Input label="Nama" bind:value={name} placeholder="Nama kamu" required autocomplete="name" />
		<Input
			label="Email"
			type="email"
			bind:value={email}
			placeholder="nama@email.com"
			required
			autocomplete="email"
		/>
		{#if error}
			<p class="text-sm text-red-600">{error}</p>
		{/if}
		<Button type="submit" loading={sending} fullWidth>Daftar Gratis</Button>
	</form>

	<div class="my-6 flex items-center gap-3 text-xs text-navy-400">
		<span class="h-px flex-1 bg-navy-100"></span>
		atau
		<span class="h-px flex-1 bg-navy-100"></span>
	</div>

	<Button variant="secondary" fullWidth onclick={handleGoogle}>Daftar dengan Google</Button>
{/if}

<p class="mt-6 text-center text-sm text-navy-500">
	Sudah punya akun? <a href="/masuk" class="font-medium text-coral-500">Masuk</a>
</p>
