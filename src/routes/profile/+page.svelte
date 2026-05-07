<!-- profile/+page.svelte  -->
<script lang="ts">
	let { data } = $props<{
		user: any;
		csrfToken: string;
		favorites: any[];
		userRestrictions: any[];
	}>();

	let name = $state(data.user.name);
	let username = $state(data.user.username);
	let error = $state('');

	function toggle(id: number) {
		openRecipeId = openRecipeId === id ? null : id;
	}

	let selected = $state(new Set(data.userRestrictions.map((r) => r.restrictionId)));

	async function toggleRestriction(id: number) {
		const res = await fetch('/api/dietary/toggle', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ restrictionId: id })
		});

		if (res.ok) {
			const result = await res.json();

			if (result.status === 'added') {
				selected.add(id);
			} else {
				selected.delete(id);
			}
			selected = new Set(selected);
		}
	}

	const grouped = Object.groupBy(data.favorites, (r) => r.category);

	let openCategory = $state<string | null>(null);
	let openRecipeId = $state<number | null>(null);

	function toggleCategory(category: string) {
		openCategory = openCategory === category ? null : category;
	}

	function toggleRecipe(id: number) {
		openRecipeId = openRecipeId === id ? null : id;
	}
</script>

<h1>Welcome, {data.user.name}!</h1>
<p>Username: {data.user.username}</p>
<p>Role: {data.user.role}</p>

{#if data.user.role === 'user'}
	{#if data.hasPendingApplication}
		<p>Your application to become an author is pending review.</p>
	{:else}
		<form method="POST" action="?/applyForAuthor">
			<button type="submit">Apply to Become an Author</button>
		</form>
	{/if}
{/if}

<form method="POST">
	{#if error}
		<p style="color:red">{error}</p>
	{/if}

	<label>Name: <input type="text" name="name" bind:value={name} /></label>
	<label>Username: <input type="text" name="username" bind:value={username} /></label>

	<button type="submit">Update</button>
</form>

<form method="POST" action="/logout">
	<button type="submit">Log out</button>
</form>

<h2>Your Dietary Restrictions</h2>

<ul>
	{#each data.allRestrictions as r}
		<li>
			<label>
				<input
					type="checkbox"
					checked={selected.has(r.id)}
					onchange={() => toggleRestriction(r.id)}
				/>
				{r.name}
			</label>
		</li>
	{/each}
</ul>

<h2>Your Favorite Recipes</h2>

{#each Object.entries(grouped) as [category, favorites]}
	<section class="category-block">
		<h2>
			<button
				type="button"
				class="category-toggle"
				aria-expanded={openCategory === category}
				onclick={() => toggleCategory(category)}
			>
				{category}
				<span aria-hidden="true">
					{openCategory === category ? '▼' : '►'}
				</span>
			</button>
		</h2>
		{#if openCategory === category}
			<div class="grid-Main">
				{#each favorites as recipe}
					<article class="card">
						<h2>
							<button
								type="button"
								class="recipe-toggle"
								aria-expanded={openRecipeId === recipe.key_id}
								onclick={() => toggleRecipe(recipe.key_id)}
							>
								{recipe.name}
								<span aria-hidden="true">
									{openRecipeId === recipe.key_id ? '▼' : '►'}
								</span>
							</button>
						</h2>

						{#if openRecipeId === recipe.key_id}
							<div class="content">
								<p><strong>Servings:</strong> {recipe.servings}</p>
								<p><strong>Time:</strong> {recipe.time}</p>
								<p><strong>Nutrition:</strong> {recipe.nutrition}</p>

								<h3><strong>Ingredients:</strong></h3>
								<ul>
									{#each recipe.ingredients as ingredient}
										<li>{ingredient}</li>
									{/each}
								</ul>

								<h3><strong>Instructions:</strong></h3>
								<ol>
									{#each recipe.instructions as step}
										<li>{step}</li>
									{/each}
								</ol>

								<h3>Tags</h3>
								<ul class="tags">
									{#each recipe.tags as tag}
										<li>{tag}</li>
									{/each}
								</ul>
								<p><strong>Creator:</strong> {recipe.creator}</p>
								<p><strong>Category:</strong> {recipe.category}</p>
							</div>
						{/if}
					</article>
				{/each}
			</div>
		{/if}
	</section>
{/each}

<style>
	.recipe-toggle,
	.category-toggle {
		all: unset;
	}

	.category-toggle {
		margin: 1rem 5rem;

		@media only screen and (min-width: 1024px) {
			margin: 1rem 10rem;
		}

		@media only screen and (min-width: 1440px) {
			margin: 1rem 15rem;
		}
	}

	.card {
		background: var(--bg-2);
		padding: 1.5rem;
		border-radius: 1rem;
		border: var(--bord);
		display: flex;
		flex-direction: column;
		margin: 1rem auto;
		width: fit-content;
		max-width: 100%;
		height: fit-content;
	}

	h2,
	h3,
	p {
		margin: 0.5rem 0;
		padding: 0;
		width: fit-content;
	}

	h3 {
		border-bottom: var(--bord);
	}

	ol {
		li {
			margin: 0 1.25rem;
			padding: 0;
		}
	}

	.tags {
		display: flex;
		text-transform: capitalize;
		flex-wrap: wrap;
		gap: 0.5rem;
		list-style: none;
		padding: 0;
	}

	.tags li {
		background: var(--hover);
		color: var(--bg-1);
		margin-top: 0.25rem;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
	}
</style>
