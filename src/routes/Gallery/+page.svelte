<script lang="ts">
	import { photos, type Photo } from '$lib/db/mockData.ts';

	let selected = $state<Photo | null>(null);

	const open = (photo: Photo) => (selected = photo);
	const close = () => (selected = null);

	const gallery = [...photos].sort((a, b) => a.position - b.position);

	const getTitle = (p: Photo) => p.caption ?? p.altTag ?? `Photo ${p.id}`;

	import { onMount, onDestroy } from 'svelte';

	onMount(() => {
		window.addEventListener('keydown', onKeydown);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', onKeydown);
	});

	let dialogEl: HTMLDivElement | null = $state(null);

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			close();
		}
	}

	onMount(() => {
		dialogEl?.focus();
	});
</script>

<h1 class="title">Awesome pictures</h1>
<div class="gallery" role="list">
	{#each gallery as photo (photo.id)}
		<button
			type="button"
			class="card"
			onclick={() => open(photo)}
			aria-label={`Open photo: ${getTitle(photo)}`}
		>
			<img src={photo.url} alt={photo.altTag ?? getTitle(photo)} loading="lazy" />

			<div class="overlay" aria-hidden="true">
				<span>{getTitle(photo)}</span>
			</div>

			{#if photo.isHighlight}
				<div class="badge" aria-label="Highlighted photo">★</div>
			{/if}
		</button>
	{/each}
</div>

{#if selected}
	<div
		bind:this={dialogEl}
		class="lightbox"
		role="dialog"
		aria-modal="true"
		aria-label="Photo viewer"
		tabindex="0"
		onclick={close}
		onkeydown={onKeydown}
	>
		<div class="lightbox-inner" role="document" onclick={(e) => e.stopPropagation()}>
			<img src={selected.url} alt={selected.altTag ?? getTitle(selected)} />

			<p>{getTitle(selected)}</p>

			{#if selected.takenAt}
				<small>
					Taken {new Date(selected.takenAt).toLocaleString()}
				</small>
			{/if}

			<button type="button" class="close" onclick={close}> Close </button>
		</div>
	</div>
{/if}

<style>
	.title {
		margin-bottom: 1rem;
	}

	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.card {
		position: relative;
		cursor: pointer;
		border-radius: 12px;
		overflow: hidden;
	}

	.card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.3s ease;
	}

	.card:hover img {
		transform: scale(1.05);
	}

	.overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: end;
		padding: 0.5rem;
		opacity: 0;
		transition: opacity 0.2s ease;
		color: white;
		font-size: 0.9rem;
	}

	.card:hover .overlay {
		opacity: 1;
	}

	.badge {
		position: absolute;
		top: 8px;
		right: 8px;
		background: gold;
		color: black;
		padding: 2px 6px;
		border-radius: 6px;
		font-size: 0.8rem;
		font-weight: bold;
	}

	.lightbox {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.lightbox-inner {
		max-width: 90%;
		max-height: 90%;
		text-align: center;
	}

	.lightbox img {
		width: 100%;
		height: auto;
		border-radius: 8px;
	}

	.lightbox p {
		color: white;
		margin-top: 0.5rem;
	}

	.lightbox small {
		color: #ccc;
	}
</style>
