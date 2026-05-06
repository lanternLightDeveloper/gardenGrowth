<!-- routes/admin/password-resets/+page.svelte  -->

<script lang="ts">
	let { data, form } = $props();

	let error = $state('');
	let newPassword = $state('');

	$effect(() => {
		if (form?.error) {
			error = form.error;
		}

		if (form?.newPassword) {
			newPassword = form.newPassword;
		}
	});
</script>

<h1>Pending Password Resets</h1>

{#if error}
	<p class="error">{error}</p>
{/if}

{#if newPassword}
	<p class="success">New password: <strong>{newPassword}</strong></p>
{/if}

<table>
	<thead>
		<tr>
			<th>Username</th>
			<th>Expires At</th>
			<th>Used</th>
			<th>Action</th>
		</tr>
	</thead>

	<tbody>
		{#each data.resets as reset}
			<tr>
				<td>{reset.email}</td>
				<td>{new Date(reset.expiresAt).toLocaleString()}</td>
				<td>{reset.used ? 'Yes' : 'No'}</td>
				<td>
					{#if !reset.used}
						<form method="POST" action="?/reset">
							<input type="hidden" name="id" value={reset.id} />
							<button type="submit">Reset Password</button>
						</form>
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
