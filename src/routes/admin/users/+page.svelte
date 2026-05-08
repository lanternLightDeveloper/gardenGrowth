<script lang="ts">
	// const { data } = $props<{
	// 	data: {
	// 		users: Array<{
	// 			id: string;
	// 			name: string;
	// 			username: string;
	// 			createdAt: string;
	// 			role: string;
	// 		}>;
	// 	};
	// }>();

	// let openUserId = $state<string | null>(null);

	// function toggle(id: string) {
	// 	openUserId = openUserId === id ? null : id;
	// }
</script>

<!-- <h1>User management</h1> -->

<!-- {#if data?.success}
	<p class="success">Role updated!</p>
{/if} -->

<!-- 
{#each data.users as user}
	<article class="card {user.applicationStatus === 'pending' ? 'highlight' : ''}">
		{#if user.applicationStatus === 'pending'}
			<span class="badge pending">Pending Application</span>
		{/if}

		<h2>
			<button
				type="button"
				class="user-toggle"
				aria-expanded={openUserId === user.id}
				aria-controls={'user-panel-' + user.id}
				onclick={() => toggle(user.id)}
			>
				{user.name}
				<span class="arrow" aria-hidden="true">
					{openUserId === user.id ? '▲' : '▼'}
				</span>
			</button>
		</h2>

		{#if openUserId === user.id}
			<div id={'user-panel-' + user.id} hidden={openUserId !== user.id} class="content">
				<p><strong>ID:</strong> {user.id}</p>
				<p><strong>Username:</strong> {user.username}</p>
				<p><strong>User's name:</strong> {user.name}</p>
				<p><strong>Created At:</strong> {user.createdAt}</p>

				<form method="POST" action="?/updateRole">
					<input type="hidden" name="userId" value={user.id} />

					<label>
						Role:
						<select name="role" bind:value={user.role}>
							<option value="user">User</option>
							<option value="author">Author</option>
							<option value="editor">Editor</option>
							<option value="admin">Admin</option>
						</select>
					</label>

					<button type="submit">Update Role</button>
				</form>
			</div>
		{/if}
	</article>
{/each} -->

<style>
	.card {
		background: var(--bg-2);
		padding: 1rem 1.5rem;
		border-radius: 1rem;
		border: var(--bord);
		margin: 1rem auto;
		width: fit-content;
		max-width: 100%;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.card.highlight {
		border: 2px solid orange;
	}
	.badge.pending {
		background: orange;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 0.8rem;
	}

	h2 {
		margin: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: var(--bord);
		padding-bottom: 0.5rem;
	}

	.arrow {
		font-size: 0.9rem;
	}

	.content {
		margin-top: 1rem;
	}

	p {
		margin: 0.15rem 0;
	}
</style>
