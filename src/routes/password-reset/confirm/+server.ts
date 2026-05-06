import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index';
import { users, auth_tokens } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';

export const POST = async ({ request, locals }) => {
	const csrf = request.headers.get('x-csrf-token');
	if (!csrf || csrf !== locals.csrfToken) {
		return json({ error: 'Invalid CSRF token' }, { status: 403 });
	}

	const { token, password } = await request.json();
	if (!token || !password) return json({ error: 'Missing token or password' }, { status: 400 });

	const [reset] = await db.select().from(auth_tokens).where(eq(auth_tokens.token, token));
	if (!reset || reset.used === 'true' || reset.expiresAt < new Date())
		return json({ error: 'Invalid or expired token' }, { status: 400 });

	const passwordHash = await argon2.hash(password);

	await db.update(users).set({ passwordHash }).where(eq(users.id, reset.userId));
	await db.update(auth_tokens).set({ used: 'true' }).where(eq(auth_tokens.id, reset.id));

	return json({ ok: true });
};
