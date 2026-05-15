<script lang="ts">
	import { page } from '$app/state';

	let file = $state<File | null>(null);
	let caption = $state('');

	const entryId = $derived(page.params.id);

	async function upload() {
		if (!file) return;

		const formData = new FormData();

		formData.append('image', file);
		formData.append('entryId', entryId);
		formData.append('caption', caption);

		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formData
		});

		const result = await response.json();

		console.log(result);
	}

	function handleChange(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		file = target.files?.[0] ?? null;
	}
</script>

<input type="file" accept="image/*" onchange={handleChange} />

<input type="text" placeholder="caption" bind:value={caption} />

<button onclick={upload}> Upload </button>
