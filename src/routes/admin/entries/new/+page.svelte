<script lang="ts">
	import { enhance } from '$app/forms';

	let loading = $state(false);
	let message = $state('');
	let title = $state('');
	let date = $state('');
</script>

<form
	method="POST"
	action="?/create"
	use:enhance={() => {
		loading = true;
		message = '';

		return async ({ result }) => {
			if (result.type === 'success') {
				message = 'Entry created successfully';
				title = '';
				date = '';
			} else {
				message = 'Something went wrong';
			}

			loading = false;
		};
	}}
>
	<label>
		Title
		<input type="text" name="title" bind:value={title} placeholder="Entry title" required />
	</label>

	<label>
		Date
		<input type="date" name="date" bind:value={date} required />
	</label>

	<button type="submit" disabled={loading}>
		{loading ? 'Creating...' : 'Create Entry'}
	</button>

	{#if message}
		<p>{message}</p>
	{/if}
</form>
