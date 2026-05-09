// // src/routes/admin/entries/+page.server.ts

// import { db } from '$lib/db/index';
// import { users, entryItems } from '$lib/db/schema';
// import { requireAdmin } from '$lib/db/auth';

// export async function load({ locals }) {
// 	requireAdmin(locals);

// 	try {
// 		const allUsers = await db
// 			.select({
// 				id: users.id,
// 				name: users.name,
// 				username: users.username,
// 				createdAt: users.createdAt,
// 				role: users.role
// 			})
// 			.from(users);

// 		const items = await db
// 			.select({
// 				id: entryItems.id,
// 				type: entryItems.type,
// 				content: entryItems.content,
// 				url: entryItems.url,
// 				title: entryItems.title
// 			})
// 			.from(entryItems);

// 		return {
// 			users: allUsers,
// 			entryItems: items
// 		};
// 	} catch (err) {
// 		console.error('ERROR loading entry items:', err);
// 		throw err;
// 	}
// }
