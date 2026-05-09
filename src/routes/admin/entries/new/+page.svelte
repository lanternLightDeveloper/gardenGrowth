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

<div class="classicForm">
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
