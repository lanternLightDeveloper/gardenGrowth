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

<h1>Hello friend</h1>

{#each data.entryItems as item (item)}
	<div>
		<h2>{item.title}</h2>
		<p>{item.content}</p>
	</div>
{/each}

<h1>Entries page</h1>

<a href="/admin/entries/new">New</a>
