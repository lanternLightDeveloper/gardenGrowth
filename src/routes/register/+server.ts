import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index';
import { users } from '$lib/db/schema';
import { rateLimit } from '$lib/db/rateLimit';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';

export const POST = async ({ request }) => {
	try {
		const ip =
			request.headers.get('cf-connecting-ip') ??
			request.headers.get('x-forwarded-for') ??
			'unknown';

		if (!rateLimit(`register:${ip}`, 3, 60_000)) {
			return json({ error: 'Too many registration attempts. Try again later.' }, { status: 429 });
		}

		const body = await request.json();

		const username = String(body.username ?? '')
			.trim()
			.toLowerCase();
		const password = String(body.password ?? '');
		const name = String(body.name ?? '').trim();

		if (!username || !password) {
			return json({ error: 'Missing username or password' }, { status: 400 });
		}

		if (password.length < 8) {
			return json({ error: 'Password must be at least 8 characters' }, { status: 400 });
		}

		const existing = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.username, username))
			.limit(1);

		if (existing.length > 0) {
			return json({ error: 'User already exists' }, { status: 400 });
		}

		const passwordHash = await argon2.hash(password);

		await db.insert(users).values({
			username,
			passwordHash,
			name: name || null
		});

		return json({ ok: true });
	} catch (err) {
		console.error('Register error:', err);

		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
