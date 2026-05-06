<script lang="ts">
	export let data: { csrfToken: string; token: string };
	let password = '';
	let confirmPassword = '';
	let error = '';
	let success = '';

	async function submitForm() {
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		const res = await fetch('/password-reset/confirm', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRF-Token': data.csrfToken
			},
			body: JSON.stringify({ token: data.token, password })
		});

		const result = await res.json();
		if (!res.ok) {
			error = result.error;
			return;
		}

		success = 'Password reset successfully! You can now log in.';
		error = '';
		password = '';
		confirmPassword = '';
	}
</script>

<form on:submit|preventDefault={submitForm}>
	{#if error}<p class="error">{error}</p>{/if}
	{#if success}<p class="success">{success}</p>{/if}

	<label
		>New Password
		<input type="password" bind:value={password} required />
	</label>

	<label
		>Confirm Password
		<input type="password" bind:value={confirmPassword} required />
	</label>

	<button type="submit">Reset Password</button>
</form>
