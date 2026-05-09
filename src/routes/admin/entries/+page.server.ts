// src/routes/admin/users/+page.server.ts
import { db } from '$lib/db/index';
import { users } from '$lib/db/schema';
import { requireAdmin, entryItems } from '$lib/db/auth';

export async function load({ locals }) {
	requireAdmin(locals);

	const all = await db
		.select({
			id: users.id,
			name: users.name,
			username: users.username,
			createdAt: users.createdAt,
			role: users.role
		})
		.from(users);

	return {
		users: all
	};

	try {
		const items = await db
			.select({
				type: entryItems.type,
				content: entryItems.content,
				url: entryItems.url,
				title: entryItems.title
			})
			.from(entryItems);

		return {
			entryItems: items
		};
	} catch (err) {
		console.error('ERROR loading entry items:', err);
		throw err;
	}
}
