import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index';
import { users, authTokens } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';

export const POST = async ({ request, locals }) => {
	const csrf = request.headers.get('x-csrf-token');
	if (!csrf || csrf !== locals.csrfToken) {
		return json({ error: 'Invalid CSRF token' }, { status: 403 });
	}

	const { token, password } = await request.json();
	if (!token || !password) return json({ error: 'Missing token or password' }, { status: 400 });

	const [reset] = await db.select().from(authTokens).where(eq(authTokens.token, token));
	if (!reset || reset.used === 'true' || reset.expiresAt < new Date())
		return json({ error: 'Invalid or expired token' }, { status: 400 });

	const passwordHash = await argon2.hash(password);

	await db.update(users).set({ passwordHash }).where(eq(users.id, reset.userId));
	await db.update(authTokens).set({ used: 'true' }).where(eq(authTokens.id, reset.id));

	return json({ ok: true });
};
