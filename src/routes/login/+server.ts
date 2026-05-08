// login/+server.ts

import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index';
import { users, sessions } from '$lib/db/schema';
import { rateLimit } from '$lib/db/rateLimit';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'tt_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export const POST = async ({ request, cookies }) => {
	const ip =
		request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'unknown';

	if (!rateLimit(`login:${ip}`, 5, 60_000)) {
		return json({ error: 'Too many login attempts. Try again later.' }, { status: 429 });
	}

	const { username, password } = await request.json();

	if (!username || !password) {
		return json({ error: 'Missing username or password' }, { status: 400 });
	}

	const [user] = await db.select().from(users).where(eq(users.username, username));

	if (!user) {
		return json({ error: 'Invalid credentials' }, { status: 401 });
	}

	const valid = await argon2.verify(user.passwordHash, password);

	if (!valid) {
		return json({ error: 'Invalid credentials' }, { status: 401 });
	}

	const sessionId = crypto.randomUUID();
	const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);
	const csrfToken = crypto.randomBytes(32).toString('hex');

	await db.insert(sessions).values({
		id: sessionId,
		userId: user.id,
		expiresAt,
		csrfToken
	});

	cookies.set(SESSION_COOKIE_NAME, sessionId, {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
		maxAge: SESSION_MAX_AGE
	});

	return json({ ok: true });
};
