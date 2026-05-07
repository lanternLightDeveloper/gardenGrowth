<script lang="ts">
	let username = '';
	let password = '';
	let name = '';
	let error = '';
	let loading = false;

	async function submitForm() {
		error = '';
		loading = true;

		try {
			console.log('Submitting registration...', {
				username,
				name
			});

			const res = await fetch('/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username,
					password,
					name
				})
			});

			console.log('Response status:', res.status);

			const data = await res.json();

			console.log('Response data:', data);

			if (!res.ok) {
				error = data.error ?? 'Something went wrong';
				return;
			}

			window.location.href = '/login';
		} catch (err) {
			console.error('REGISTER CLIENT ERROR:', err);

			error = 'Unexpected error occurred';
		} finally {
			loading = false;
		}
	}
</script>

<form on:submit|preventDefault={submitForm}>
	{#if error}
		<p class="error">{error}</p>
	{/if}

	<label>
		Name
		<input type="text" bind:value={name} required />
	</label>

	<br />

	<label>
		Username
		<input type="text" bind:value={username} required />
	</label>

	<br />

	<label>
		Password
		<input type="password" bind:value={password} required />
	</label>

	<br />

	<button type="submit" disabled={loading}>
		{loading ? 'Creating Account...' : 'Sign Up'}
	</button>
</form>
