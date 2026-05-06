// /routes/admin/+page.server.ts
import { db } from '$lib/db';
import { password_resets, users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import crypto from 'crypto';

export async function load() {
	const resets = await db
		.select({
			id: password_resets.id,
			email: users.email,
			expiresAt: password_resets.expiresAt,
			used: password_resets.used
		})
		.from(password_resets)
		.leftJoin(users, eq(password_resets.userId, users.id));

	return { resets };
}

export const actions = {
	reset: async ({ request }) => {
		const form = await request.formData();
		const id = form.get('id');

		if (!id) return fail(400, { error: 'Missing reset ID' });

		const [reset] = await db.select().from(password_resets).where(eq(password_resets.id, id));

		if (!reset) return fail(404, { error: 'Reset not found' });
		if (reset.used) return fail(400, { error: 'Reset already used' });
		if (reset.expiresAt < new Date()) return fail(400, { error: 'Reset expired' });

		const newPassword = crypto.randomUUID().slice(0, 8);

		const hash = await Bun.password.hash(newPassword);

		await db.transaction(async (tx) => {
			await tx.update(users).set({ passwordHash: hash }).where(eq(users.id, reset.userId));

			await tx.update(password_resets).set({ used: true }).where(eq(password_resets.id, id));
		});

		return { newPassword };
	}
};
