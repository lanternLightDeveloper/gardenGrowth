<script lang="ts">
	let email = '';
	let password = '';
	let name = '';
	let error = '';

	async function submitForm() {
		const res = await fetch('/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password, name })
		});

		const data = await res.json();

		if (!res.ok) {
			error = data.error;
			return;
		}

		window.location.href = '/login';
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
	<label>
		Email
		<input type="email" bind:value={email} required />
	</label>
	<label>
		Password
		<input type="password" bind:value={password} required />
	</label>
	<button type="submit">Sign Up</button>
</form>
