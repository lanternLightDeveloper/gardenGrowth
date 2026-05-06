<script lang="ts">
	import '$lib/Styles/baseCamp.svelte';
	import Nav from '$lib/Assets/Menu.svelte';
	import Footer from '$lib/Assets/Footer.svelte';

	let { children } = $props();
</script>

<div class="app">
	<Nav />
	<main>
		{@render children()}
	</main>
	<Footer />
</div>
