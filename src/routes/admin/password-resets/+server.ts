// routes/admin/password-resets/+server.ts

import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index';
import { users, auth_tokens } from '$lib/db/schema';
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
			id: auth_tokens.id,
			email: users.email,
			used: auth_tokens.used,
			expiresAt: auth_tokens.expiresAt
		})
		.from(auth_tokens)
		.innerJoin(users, eq(users.id, auth_tokens.userId));

	return json({ resets });
};

export const POST = async ({ request, locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		return json({ error: 'Unauthorized' }, { status: 403 });
	}

	const { resetId } = await request.json();
	if (!resetId) return json({ error: 'Missing reset ID' }, { status: 400 });

	const [reset] = await db.select().from(auth_tokens).where(eq(auth_tokens.id, resetId));
	if (!reset || reset.used === 'true')
		return json({ error: 'Invalid reset request' }, { status: 400 });

	const newPassword = crypto.randomBytes(4).toString('hex');
	const passwordHash = await argon2.hash(newPassword);

	await db.update(users).set({ passwordHash }).where(eq(users.id, reset.userId));

	await db.update(auth_tokens).set({ used: 'true' }).where(eq(auth_tokens.id, reset.id));

	return json({ ok: true, newPassword });
};
