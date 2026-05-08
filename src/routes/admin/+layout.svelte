<script lang="ts">
	let { children } = $props();
</script>

<p>Admin Panel</p>
<ul>
	<li><a href="/admin/users">Manage Users</a></li>
	<li><a href="/admin/entries">Manage Entries</a></li>
	<li><a href="/admin/password-resets">Pending Password Resets</a></li>
</ul>
<div class="app">
	<main>
		{@render children()}
	</main>
</div>

<style>
	ul {
		list-style-type: none;
		margin: 3rem;
	}

	p,
	li {
		margin: 0 3rem;
	}
</style>
