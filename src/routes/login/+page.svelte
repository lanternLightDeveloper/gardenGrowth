<script lang="ts">
	export let data: {
		csrfToken: string;
	};
	let username = '';
	let password = '';
	let error = '';

	async function submitForm() {
		const res = await fetch('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRF-Token': data.csrfToken
			},
			body: JSON.stringify({ username, password })
		});

		const result = await res.json();

		if (!res.ok) {
			error = result.error;
			return;
		}

		window.location.href = '/profile';
	}
</script>

<form on:submit|preventDefault={submitForm}>
	{#if error}
		<p class="error">{error}</p>
	{/if}
	<label>
		Username
		<input type="text" bind:value={username} required />
	</label>
	<label>
		Password
		<input type="password" bind:value={password} required />
	</label>
	<button type="submit">Login</button>
</form>
