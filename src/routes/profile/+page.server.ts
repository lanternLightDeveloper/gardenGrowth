// profile/+page.server.ts

import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { db } from '$lib/db/index';
import { users } from '$lib/db/schema';
import { requireUser } from '$lib/db/auth';

export const load = async ({ locals }) => {
	requireUser(locals);

	return {
		user: locals.user
	};
};

export const actions = {
	updateProfile: async ({ request, locals }) => {
		requireUser(locals);

		const form = await request.formData();

		const name = String(form.get('name') ?? '').trim();
		const username = String(form.get('username') ?? '')
			.trim()
			.toLowerCase();

		if (!username) {
			return fail(400, {
				error: 'Username is required'
			});
		}

		const existing = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.username, username))
			.limit(1);

		if (existing.length > 0 && existing[0].id !== locals.user.id) {
			return fail(400, {
				error: 'Username already taken'
			});
		}

		await db
			.update(users)
			.set({
				name: name || null,
				username,
				updatedAt: new Date()
			})
			.where(eq(users.id, locals.user.id));

		return {
			success: true
		};
	}
};
