<script lang="ts">
	import { page } from '$app/stores';
	import { Button, Input } from '$lib/components/ui';
	import { createSupabaseBrowserClient } from '$lib/supabase/client';

	const supabase = createSupabaseBrowserClient();

	let email = $state('');
	let sending = $state(false);
	let sent = $state(false);
	let error = $state('');

	const next = $derived($page.url.searchParams.get('next') ?? '/dashboard');

	async function handleMagicLink(event: SubmitEvent) {
		event.preventDefault();
		error = '';
		sending = true;
		const { error: authError } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${window.location.origin}/callback?next=${encodeURIComponent(next)}`,
			},
		});
		sending = false;
		if (authError) {
			error = 'Gagal mengirim link masuk. Coba lagi sebentar lagi.';
			return;
		}
		sent = true;
	}

	async function handleGoogle() {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: `${window.location.origin}/callback?next=${encodeURIComponent(next)}` },
		});
	}
</script>

<svelte:head>
	<title>Masuk — Ketuk.id</title>
</svelte:head>

<h1 class="font-display text-xl font-semibold text-navy-900">Masuk ke Ketuk.id</h1>
<p class="mt-1 text-sm text-navy-500">Kelola undangan dan acaramu.</p>

{#if sent}
	<p class="mt-6 rounded-lg bg-vendor-100 p-4 text-sm text-vendor-600">
		Link masuk sudah dikirim ke {email}. Cek inbox (atau folder spam) kamu.
	</p>
{:else}
	<form class="mt-6 flex flex-col gap-4" onsubmit={handleMagicLink}>
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
		<Button type="submit" loading={sending} fullWidth>Kirim Link Masuk</Button>
	</form>

	<div class="my-6 flex items-center gap-3 text-xs text-navy-400">
		<span class="h-px flex-1 bg-navy-100"></span>
		atau
		<span class="h-px flex-1 bg-navy-100"></span>
	</div>

	<Button variant="secondary" fullWidth onclick={handleGoogle}>Lanjutkan dengan Google</Button>
{/if}

<p class="mt-6 text-center text-sm text-navy-500">
	Belum punya akun? <a href="/daftar" class="font-medium text-coral-500">Daftar</a>
</p>
