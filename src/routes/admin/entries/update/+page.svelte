<script lang="ts">
	const { data } = $props();
</script>

<h1>Entries</h1>

{#each data.entries as entry (entry.id)}
	<div class="entryCard">
		<h2>{entry.title}</h2>

		<p>{entry.date}</p>

		<a href={`/admin/entries/update/${entry.id}`}> Edit </a>
	</div>
{/each}
