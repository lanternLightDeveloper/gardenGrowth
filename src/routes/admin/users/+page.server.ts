// src/routes/admin/users/+page.server.ts
import { db } from '$lib/db';
import { users, authorApplications } from '$lib/db/schema';
import { requireAdmin } from '$lib/db/auth';
import { eq, and } from 'drizzle-orm';

export async function load({ locals }) {
	requireAdmin(locals);

	const all = await db
		.select({
			id: users.id,
			name: users.name,
			email: users.email,
			createdAt: users.createdAt,
			role: users.role,
			applicationStatus: authorApplications.status
		})
		.from(users)
		.leftJoin(
			authorApplications,
			and(eq(authorApplications.userId, users.id), eq(authorApplications.status, 'pending'))
		);
	return { users: all };
}

export const actions = {
	updateRole: async ({ request, locals }) => {
		requireAdmin(locals);

		const form = await request.formData();
		const userId = form.get('userId') as string;
		const role = form.get('role') as string;

		// Validate role
		const validRoles = ['user', 'author', 'editor', 'admin'];
		if (!validRoles.includes(role)) {
			throw new Error('Invalid role');
		}

		// Update DB
		await db.update(users).set({ role }).where(eq(users.id, userId));

		return { success: true };
	}
};
