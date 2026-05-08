// // routes/admin/password-resets/+server.ts

// import { json } from '@sveltejs/kit';
// import { db } from '$lib/db/index';
// import { users, authTokens } from '$lib/db/schema';
// import { eq } from 'drizzle-orm';
// import crypto from 'crypto';
// import argon2 from 'argon2';

// export const GET = async ({ locals }) => {
// 	// Only admins
// 	if (!locals.user || locals.user.role !== 'admin') {
// 		return json({ error: 'Unauthorized' }, { status: 403 });
// 	}

// 	const resets = await db
// 		.select({
// 			id: authTokens.id,
// 			username: users.username,
// 			used: authTokens.used,
// 			expiresAt: authTokens.expiresAt
// 		})
// 		.from(authTokens)
// 		.innerJoin(users, eq(users.id, authTokens.userId));

// 	return json({ resets });
// };

// export const POST = async ({ request, locals }) => {
// 	if (!locals.user || locals.user.role !== 'admin') {
// 		return json({ error: 'Unauthorized' }, { status: 403 });
// 	}

// 	const { resetId } = await request.json();
// 	if (!resetId) return json({ error: 'Missing reset ID' }, { status: 400 });

// 	const [reset] = await db.select().from(authTokens).where(eq(authTokens.id, resetId));
// 	if (!reset || reset.used === 'true')
// 		return json({ error: 'Invalid reset request' }, { status: 400 });

// 	const newPassword = crypto.randomBytes(4).toString('hex');
// 	const passwordHash = await argon2.hash(newPassword);

// 	await db.update(users).set({ passwordHash }).where(eq(users.id, reset.userId));

// 	await db.update(authTokens).set({ used: 'true' }).where(eq(authTokens.id, reset.id));

// 	return json({ ok: true, newPassword });
// };
