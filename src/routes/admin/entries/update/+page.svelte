<script lang="ts">
	const { data } = $props();
</script>

<h1>Entries</h1>

{#each data.entries as row (row.entries.id)}
	<div class="entryCard">
		<h2>{row.entries.title}</h2>

		<p>{row.entries.date}</p>

		<a href={`/admin/entries/update/${row.entries.id}`}> Edit </a>
	</div>
{/each}
