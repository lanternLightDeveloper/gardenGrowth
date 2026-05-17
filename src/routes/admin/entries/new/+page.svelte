<!-- +page.svelte -->

<script lang="ts">
	import { enhance } from '$app/forms';

	import imageCompression from 'browser-image-compression';

	let loading = $state(false);
	let message = $state('');

	let title = $state('');
	let date = $state('');

	let items = $state([
		{
			type: 'note',
			title: '',
			content: '',
			url: '',
			highlight: false,

			file: null as File | null,
			caption: ''
		}
	]);

	function addItem() {
		items.push({
			type: 'note',
			title: '',
			content: '',
			url: '',
			highlight: false,

			file: null,
			caption: ''
		});
	}

	function removeItem(i: number) {
		items.splice(i, 1);
	}

	async function handleImageChange(event: Event, index: number) {
		const target = event.currentTarget as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		console.log('original size:', file.size);

		try {
			const compressed = await imageCompression(file, {
				maxSizeMB: 1,
				maxWidthOrHeight: 1920,
				useWebWorker: true,
				initialQuality: 0.8
			});

			console.log('compressed size:', compressed.size);

			// IMPORTANT: fallback check
			items[index].file = compressed.size < file.size ? compressed : file;
		} catch (err) {
			console.error('compression failed, using original file', err);
			items[index].file = file;
		}
	}

	function serializedItems() {
		return items.map((item) => ({
			type: item.type,
			title: item.title,
			content: item.content,
			url: item.url,
			highlight: item.highlight,
			caption: item.caption
		}));
	}

	function enhanceHandler() {
		loading = true;
		message = '';

		return async ({ result, update }) => {
			loading = false;

			if (result.type === 'success') {
				const entryId = result.data.entryId;

				for (const item of items) {
					if (item.type === 'image' && item.file) {
						const formData = new FormData();

						formData.append('image', item.file);
						formData.append('entryId', String(entryId));
						formData.append('caption', item.caption);

						const response = await fetch('/api/upload', {
							method: 'POST',
							body: formData
						});

						const uploadResult = await response.json();

						console.log(uploadResult);
					}
				}

				message = 'Entry created successfully';

				title = '';
				date = '';

				items = [
					{
						type: 'note',
						title: '',
						content: '',
						url: '',
						highlight: false,

						file: null,
						caption: ''
					}
				];

				await update();
			} else {
				message = 'Something went wrong';
			}
		};
	}
</script>

<div class="classicForm">
	<h1>New Entries for the journal</h1>

	<form class="classicForm" method="POST" action="?/create" use:enhance={enhanceHandler}>
		<label>
			Title
			<input type="text" name="title" bind:value={title} required />
		</label>

		<label>
			Date
			<input type="date" name="date" bind:value={date} required />
		</label>

		<input type="hidden" name="items" value={JSON.stringify(serializedItems())} />

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

				{#if item.type === 'image'}
					<input type="file" accept="image/*" onchange={(event) => handleImageChange(event, i)} />

					<input placeholder="Caption" bind:value={item.caption} />
				{:else}
					<input placeholder="Title" bind:value={item.title} />

					<textarea placeholder="Content" bind:value={item.content}></textarea>

					<input placeholder="URL (optional)" bind:value={item.url} />
				{/if}

				<label>
					Highlight

					<input type="checkbox" bind:checked={item.highlight} />
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
