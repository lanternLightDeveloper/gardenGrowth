// src/routes/admin/users/+page.server.ts
import { db } from '$lib/db';
import { users } from '$lib/db/schema';
import { requireAdmin } from '$lib/db/auth';
// import { eq, and } from 'drizzle-orm';

export async function load({ locals }) {
	requireAdmin(locals);

	const all = await db.select({
		id: users.id,
		name: users.name,
		username: users.username,
		createdAt: users.createdAt,
		role: users.role
	});
	return { users: all };
}
