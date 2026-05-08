<!-- profile/+page.svelte -->

<script lang="ts">
	let { data } = $props<{
		data: {
			user: {
				id: number;
				username: string;
				name: string | null;
				role: string;
			};
		};
	}>();
</script>

<h1>
	Welcome,
	{data.user.name ?? data.user.username}!
</h1>

<p>Username: {data.user.username}</p>
<p>Role: {data.user.role}</p>

<form method="POST" action="/logout">
	<button type="submit">Log out</button>
</form>

<style>
	p {
		margin: 0.5rem 0;
		width: fit-content;
	}
</style>
