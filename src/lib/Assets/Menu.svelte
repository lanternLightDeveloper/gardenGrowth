<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let isMenuOpen = $state(false);
	let current = $state('home');
	let query = $state('');
	let activeIndex = $state(0);
	let showScrollButton = $state(false);

	let inputEl = $state.raw<HTMLInputElement | null>(null);

	const menuItems = [
		{ label: 'Home', href: '/', id: 'home' },
		{ label: 'Gallery', href: '/Gallery', id: 'gallery' },
		{ label: 'Calendar', href: '/Calendar', id: 'calendar' }
	];

	const themes = ['dark', 'light', 'colorblind', 'headache'];
	let theme = $state('dark');

	function applyTheme(t: string) {
		theme = t;
		document.documentElement.setAttribute('data-theme', t);
		localStorage.setItem('theme', t);
	}

	function setTheme(t: string) {
		applyTheme(t);
	}

	if (typeof localStorage !== 'undefined') {
		const saved = localStorage.getItem('theme');
		if (saved) {
			theme = saved;
			document.documentElement.setAttribute('data-theme', saved);
		}
	}

	const filtered = $derived(() =>
		menuItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
	);

	const open = () => {
		isMenuOpen = true;

		requestAnimationFrame(() => {
			inputEl?.focus();
		});
	};

	const close = () => {
		isMenuOpen = false;
		query = '';
	};

	function handleSelect(item) {
		current = item.id;
		close();
		goto(item.href);
	}

	const onKey = (e: KeyboardEvent) => {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			open();
		}
	};

	function handleScroll() {
		const scrollY = window.scrollY;
		const triggerHeight = window.innerHeight * 1.5;
		showScrollButton = scrollY > triggerHeight;
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		window.addEventListener('keydown', onKey);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('keydown', onKey);
		};
	});

	$effect(() => {
		if (isMenuOpen) activeIndex = 0;
	});

	$effect(() => {
		const items = filtered();
		if (activeIndex >= items.length) {
			activeIndex = 0;
		}
	});
</script>

<button class="btn btn-9" onclick={open}>Menu</button>

{#if isMenuOpen}
	<div
		class="menu"
		onclick={close}
		onkeydown={(e) => {
			if (e.key === 'Escape') close();
		}}
		tabindex="-1"
		role="presentation"
	>
		<div class="menu-panel" role="dialog" aria-modal="true" aria-label="Command menu">
			<input
				bind:this={inputEl}
				placeholder="Type to navigate..."
				bind:value={query}
				aria-label="Search navigation"
				aria-autocomplete="list"
				aria-controls="menu-results"
				aria-activedescendant={filtered().length > 0 ? filtered()[activeIndex]?.id : undefined}
				onkeydown={(e) => {
					const items = filtered();

					if (e.key === 'ArrowDown') {
						e.preventDefault();
						activeIndex = (activeIndex + 1) % items.length;
					}

					if (e.key === 'ArrowUp') {
						e.preventDefault();
						activeIndex = (activeIndex - 1 + items.length) % items.length;
					}

					if (e.key === 'Enter') {
						if (items.length > 0) {
							handleSelect(items[activeIndex]);
						}
					}

					if (e.key === 'Escape') {
						close();
					}
				}}
			/>

			<div class="results" id="menu-results" role="listbox">
				{#each filtered() as item, i (item.id)}
					<button
						type="button"
						id={item.id}
						role="option"
						class="btn btn-9"
						aria-selected={i === activeIndex}
						class:current={current === item.id}
						class:active={i === activeIndex}
						onclick={() => {
							current = item.id;
							handleSelect(item);
						}}
					>
						{item.label}
					</button>
				{/each}

				{#if filtered().length === 0}
					<div class="empty">No results</div>
				{/if}
			</div>

			<div class="theme-picker">
				<p>Theme:</p>
				{#each themes as t (t)}
					<button
						class="btn btn-9"
						type="button"
						class:selected={theme === t}
						onclick={() => setTheme(t)}
					>
						{t}
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}
{#if showScrollButton}
	<button class="scroll-top-button" onclick={scrollToTop}> ↑ </button>
{/if}

<style>
	.results button.active {
		background: var(--bg-2);
	}

	.menu {
		position: fixed;
		inset: 0;
		background: var(--hallow-Accent);
		backdrop-filter: blur(5px);
		--webkit-backdrop-filter: blur(5px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 10vh;
		z-index: 999;
	}

	.menu-panel {
		width: 25vw;
		background: var(--bg-2);
		border: var(--border);
		border-radius: var(--radius-S);
		overflow: hidden;
	}

	.menu input {
		width: 100%;
		padding: 1rem;
		background: transparent;
		border: none;
		color: var(--txt-1);
		outline: none;
		font-size: 1rem;
		border-bottom: var(--border);
	}

	.results button {
		display: block;
	}

	.empty {
		padding: 1rem;
		color: var(--error);
		font-size: 0.9rem;
	}

	.theme-picker {
		p {
			padding: 1rem;
		}

		button {
			text-transform: capitalize;
		}
	}

	.theme-picker button.selected {
		outline: 2px solid var(--accent-1);
	}

	.scroll-top-button {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		background: var(--accent-2);
		color: var(--txt-1);
		border: none;
		border-radius: 50%;
		width: 3rem;
		height: 3rem;
		font-size: 1.2rem;
		cursor: pointer;
		z-index: 935;
		animation: bounceIn 0.6s ease forwards;
	}

	.scroll-top-button:hover {
		background-color: var(--hover);
		box-shadow: 0 0 12px var(--accent-2);
	}
	@keyframes bounceIn {
		0% {
			transform: scale(0.5);
			opacity: 0;
		}
		60% {
			transform: scale(1.2);
			opacity: 1;
		}
		100% {
			transform: scale(1);
		}
	}
</style>
