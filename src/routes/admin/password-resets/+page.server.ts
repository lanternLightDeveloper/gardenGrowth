// /routes/admin/+page.server.ts
import { db } from '$lib/db';
import { auth_tokens, users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import crypto from 'crypto';

export async function load() {
	const resets = await db
		.select({
			id: auth_tokens.id,
			username: users.username,
			expiresAt: auth_tokens.expiresAt,
			used: auth_tokens.used
		})
		.from(auth_tokens)
		.leftJoin(users, eq(auth_tokens.userId, users.id));

	return { resets };
}

export const actions = {
	reset: async ({ request }) => {
		const form = await request.formData();
		const id = form.get('id');

		if (!id) return fail(400, { error: 'Missing reset ID' });

		const [reset] = await db.select().from(auth_tokens).where(eq(auth_tokens.id, id));

		if (!reset) return fail(404, { error: 'Reset not found' });
		if (reset.used) return fail(400, { error: 'Reset already used' });
		if (reset.expiresAt < new Date()) return fail(400, { error: 'Reset expired' });

		const newPassword = crypto.randomUUID().slice(0, 8);

		const hash = await Bun.password.hash(newPassword);

		await db.transaction(async (tx) => {
			await tx.update(users).set({ passwordHash: hash }).where(eq(users.id, reset.userId));

			await tx.update(auth_tokens).set({ used: true }).where(eq(auth_tokens.id, id));
		});

		return { newPassword };
	}
};
