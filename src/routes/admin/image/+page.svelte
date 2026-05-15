<script lang="ts">
	let file = $state<File | null>(null);

	async function upload() {
		if (!file) return;

		const formData = new FormData();

		formData.append('image', file);

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

<button onclick={upload}> Upload </button>
