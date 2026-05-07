<!-- profile/+page.svelte  -->
<script lang="ts">
	let { data } = $props<{
		user: any;
		csrfToken: string;
	}>();

	let name = $state(data.user.name);
	let username = $state(data.user.username);
	let error = $state('');
</script>

<h1>Welcome, {data.user.name}!</h1>
<p>Username: {data.user.username}</p>
<p>Role: {data.user.role}</p>

<!-- <form method="POST">
	{#if error}
		<p style="color:red">{error}</p>
	{/if}

	<label>Name: <input type="text" name="name" bind:value={name} /></label>
	<label>Username: <input type="text" name="username" bind:value={username} /></label>

	<button type="submit">Update</button>
</form> -->

<form method="POST" action="/logout">
	<button type="submit">Log out</button>
</form>

<style>
	h1,
	p {
		margin: 0.5rem 0;
		padding: 0;
		width: fit-content;
	}
</style>
