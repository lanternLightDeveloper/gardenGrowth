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

<!-- <p>DB time: {data.time}</p> -->
