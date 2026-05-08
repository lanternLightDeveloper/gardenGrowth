// // src/routes/admin/users/+page.server.ts
// import { db } from '$lib/db';
// import { users } from '$lib/db/schema';
// import { requireAdmin } from '$lib/db/auth';
// import { eq, and } from 'drizzle-orm';

// export async function load({ locals }) {
// 	requireAdmin(locals);

// 	const all = await db.select({
// 		id: users.id,
// 		name: users.name,
// 		username: users.username,
// 		createdAt: users.createdAt,
// 		role: users.role
// 	});
// 	return { users: all };
// }

// export const actions = {
// 	updateRole: async ({ request, locals }) => {
// 		requireAdmin(locals);

// 		const form = await request.formData();
// 		const userId = form.get('userId') as string;
// 		const role = form.get('role') as string;

// 		// Validate role
// 		const validRoles = ['user', 'author', 'editor', 'admin'];
// 		if (!validRoles.includes(role)) {
// 			throw new Error('Invalid role');
// 		}

// 		// Update DB
// 		await db.update(users).set({ role }).where(eq(users.id, userId));

// 		return { success: true };
// 	}
// };
