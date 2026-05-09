<!-- +page.svelte  -->

<script lang="ts">
	import { enhance } from '$app/forms';

	let loading = $state(false);
	let message = $state('');
	let title = $state('');
	let date = $state('');

	function enhanceHandler() {
		loading = true;
		message = '';

		return async ({ result, update }) => {
			loading = false;

			if (result.type === 'success') {
				message = 'Entry created successfully';

				title = '';
				date = '';

				items = [
					{
						type: 'note',
						title: '',
						content: '',
						url: '',
						highlight: false
					}
				];

				await update();
			} else {
				message = 'Something went wrong';
			}
		};
	}

	let items = $state([
		{
			type: 'note',
			title: '',
			content: '',
			url: '',
			highlight: false
		}
	]);

	function addItem() {
		items.push({
			type: 'note',
			title: '',
			content: '',
			url: '',
			highlight: false
		});
	}

	function removeItem(i: number) {
		items.splice(i, 1);
	}
</script>

<div class="page">
	<h1>New Entries for the journal</h1>

	<form method="POST" action="?/create" use:enhance={enhanceHandler}>
		<label>
			Title
			<input type="text" name="title" bind:value={title} required />
		</label>

		<label>
			Date
			<input type="date" name="date" bind:value={date} required />
		</label>

		<input type="hidden" name="items" value={JSON.stringify(items)} />

		<hr />

		<h2>Items</h2>

		{#each items as item, i (i)}
			<div class="item">
				<select bind:value={item.type}>
					<option value="note">Note</option>
					<option value="reference">Reference</option>
					<option value="tip">Tip</option>
					<option value="watered">Watered</option>
				</select>

				<input placeholder="Title" bind:value={item.title} />

				<textarea placeholder="Content" bind:value={item.content}></textarea>

				<input placeholder="URL (optional)" bind:value={item.url} />

				<label>
					Highlight
					<input type="checkbox" bind:value={item.highlight} />
				</label>

				<button type="button" onclick={() => removeItem(i)}> Remove </button>
			</div>
		{/each}

		<button type="button" onclick={addItem}> Add Item </button>

		<button type="submit" disabled={loading}>
			{loading ? 'Creating...' : 'Create Entry'}
		</button>

		{#if message}
			<p>{message}</p>
		{/if}
	</form>
</div>

<style>
	.page {
		max-width: 520px;
		margin: 3rem auto;
		padding: 2rem;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	h1 {
		font-size: 1.6rem;
		margin-bottom: 1.5rem;
		letter-spacing: -0.02em;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		padding: 1.5rem;
		border: 1px solid #e5e7eb;
		border-radius: 14px;
		background: #fff;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		font-size: 0.9rem;
		color: #374151;
	}

	input {
		padding: 0.65rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 10px;
		font-size: 0.95rem;
		transition:
			border 0.15s ease,
			box-shadow 0.15s ease;
		background: #fafafa;
	}

	input:focus {
		outline: none;
		border-color: #6366f1;
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
		background: #fff;
	}

	button {
		margin-top: 0.5rem;
		padding: 0.75rem 1rem;
		border: none;
		border-radius: 10px;
		background: #111827;
		color: white;
		font-weight: 500;
		cursor: pointer;
		transition:
			transform 0.08s ease,
			background 0.2s ease;
	}

	button:hover {
		background: #1f2937;
	}

	button:active {
		transform: scale(0.98);
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	p {
		margin-top: 0.5rem;
		font-size: 0.9rem;
		color: #16a34a;
	}
</style>
