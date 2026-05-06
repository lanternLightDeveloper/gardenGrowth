<script lang="ts">
	let email = '';
	let error = '';
	let success = '';

	async function submitForm() {
		const res = await fetch('/password-reset/request', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email })
		});

		const result = await res.json();
		if (!res.ok) {
			error = result.error;
			return;
		}

		success = 'A request to reset your password has been sent.';
		error = '';
	}
</script>

<form on:submit|preventDefault={submitForm}>
	{#if error}<p class="error">{error}</p>{/if}
	{#if success}<p class="success">{success}</p>{/if}

	<label>
		Username
		<input type="text" bind:value={email} required />
	</label>

	<button type="submit">Request Password Reset</button>
</form>
