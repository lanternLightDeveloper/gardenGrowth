<!-- src/routes/admin/entries/+page.svelte  -->

<script lang="ts">
	const { data } = $props<{
		data: {
			entryItems: Array<{
				type: string;
				content: string;
				url: string;
				title: string;
			}>;
		};
	}>();

	$inspect(data);
</script>

{#each data.entryItems as item (item.id)}
	<div>
		<h2>{item.title}</h2>
		<p>{item.content}</p>
	</div>
{/each}

<h1>Entries page</h1>

<a href="/admin/entries/new">New</a>
