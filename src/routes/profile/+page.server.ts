// profile/+page.server.ts
import { db } from '$lib/db';
import { users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireUser } from '$lib/db/auth';
import { fail } from '@sveltejs/kit';

export const actions = {
	updateProfile: async ({ request, locals }) => {
		requireUser(locals);

		const form = await request.formData();
		const name = form.get('name');
		const email = form.get('email');

		if (!name || !email) {
			return fail(400, { error: 'Missing fields' });
		}

		await db
			.update(users)
			.set({ name: String(name), email: String(email) })
			.where(eq(users.id, locals.user.id));

		return { success: true };
	}
};

export async function load({ locals }) {
	requireUser(locals);
	return {
		user: locals.user
	};
}
