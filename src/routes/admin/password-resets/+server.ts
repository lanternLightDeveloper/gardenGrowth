// routes/admin/password-resets/+server.ts

import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index';
import { users, password_resets } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import argon2 from 'argon2';

export const GET = async ({ locals }) => {
	// Only admins
	if (!locals.user || locals.user.role !== 'admin') {
		return json({ error: 'Unauthorized' }, { status: 403 });
	}

	const resets = await db
		.select({
			id: password_resets.id,
			email: users.email,
			used: password_resets.used,
			expiresAt: password_resets.expiresAt
		})
		.from(password_resets)
		.innerJoin(users, eq(users.id, password_resets.userId));

	return json({ resets });
};

export const POST = async ({ request, locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		return json({ error: 'Unauthorized' }, { status: 403 });
	}

	const { resetId } = await request.json();
	if (!resetId) return json({ error: 'Missing reset ID' }, { status: 400 });

	const [reset] = await db.select().from(password_resets).where(eq(password_resets.id, resetId));
	if (!reset || reset.used === 'true')
		return json({ error: 'Invalid reset request' }, { status: 400 });

	const newPassword = crypto.randomBytes(4).toString('hex');
	const passwordHash = await argon2.hash(newPassword);

	await db.update(users).set({ passwordHash }).where(eq(users.id, reset.userId));

	await db.update(password_resets).set({ used: 'true' }).where(eq(password_resets.id, reset.id));

	return json({ ok: true, newPassword });
};
