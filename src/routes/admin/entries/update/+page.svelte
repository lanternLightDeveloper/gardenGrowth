<!-- +page.svelte  -->

<script lang="ts">
	const { data } = $props();

	let title = $state(data.entry.title ?? '');
	let date = $state(data.entry.date);

	let items = $state(
		data.entry.entryItems.map((item) => ({
			type: item.type,
			title: item.title ?? '',
			content: item.content ?? '',
			url: item.url ?? '',
			highlight: item.highlight
		}))
	);

	let loading = $state(false);
	let message = $state('');

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

<h1>Update Entries</h1>

<div class="classicForm">
	<h1>New Entries for the journal</h1>

	<form method="POST" action="?/update">
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
					<input type="checkbox" bind:checked={item.highlight} />
				</label>

				<button type="button" onclick={() => removeItem(i)}> Remove </button>
			</div>
		{/each}

		<button type="button" onclick={addItem}> Add Item </button>

		<button type="submit" disabled={loading}>
			{loading ? 'Updating...' : 'Update Entry'}
		</button>

		{#if message}
			<p>{message}</p>
		{/if}
	</form>
</div>
