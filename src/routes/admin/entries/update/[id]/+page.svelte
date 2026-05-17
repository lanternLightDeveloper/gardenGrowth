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

	console.log('FULL DATA', data);
	console.log('ENTRY', data.entry);
	console.log('ENTRY ITEMS', data.entry.entryItems);
	console.log('STATE ITEMS', items);
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
			<pre>{JSON.stringify(data.entry.entryItems, null, 2)}</pre>
			<div class="item">
				<select bind:value={item.type}>
					<option value="note">Note</option>
					<option value="reference">Reference</option>
					<option value="tip">Tip</option>
					<option value="watered">Watered</option>
					<option value="image">Image</option>
				</select>

				{#if item.type === 'image'}
					<input placeholder="Image URL" bind:value={item.url} />

					{#if item.url}
						<img src={item.url} alt="" width="200" />
					{/if}
				{:else}
					<input placeholder="Title" bind:value={item.title} />

					<textarea placeholder="Content" bind:value={item.content}></textarea>

					<input placeholder="URL (optional)" bind:value={item.url} />

					<label>
						Highlight
						<input type="checkbox" bind:checked={item.highlight} />
					</label>
				{/if}

				<button type="button" onclick={() => removeItem(i)}> Remove item </button>
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
	<form method="POST" action="?/delete">
		<button
			type="submit"
			onclick={(e) => {
				if (!confirm('Delete this entry?')) {
					e.preventDefault();
				}
			}}
		>
			Delete Entry
		</button>
	</form>
</div>
