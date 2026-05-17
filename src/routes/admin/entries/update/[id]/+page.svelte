<script lang="ts">
	const { data } = $props();

	type EntryItem = {
		type: string;
		title: string;
		content: string;
		url: string;
		highlight: boolean;
	};

	let title = $state('');
	let date = $state('');
	let items = $state<EntryItem[]>([]);
	let loading = $state(false);
	let message = $state('');

	$effect(() => {
		if (!data?.entry) return;

		title = data.entry.title ?? '';
		date = data.entry.date;

		items = data.entry.entryItems.map((item) => ({
			type: item.type,
			title: item.title ?? '',
			content: item.content ?? '',
			url: item.url ?? '',
			highlight: item.highlight
		}));
	});

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
					<option value="image">Image</option>
				</select>

				<button type="button" onclick={() => removeItem(i)}> Remove item </button>
			</div>
		{/each}

		<h2>Photos</h2>

		{#each data.entry.photos as photo (photo)}
			<div class="photo">
				<img src={photo.url} alt="" width="200" />
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
