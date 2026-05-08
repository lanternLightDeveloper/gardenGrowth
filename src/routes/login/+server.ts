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
	try {
		const ip =
			request.headers.get('cf-connecting-ip') ??
			request.headers.get('x-forwarded-for') ??
			'unknown';

		if (!rateLimit(`login:${ip}`, 5, 60_000)) {
			return json({ error: 'Too many login attempts. Try again later.' }, { status: 429 });
		}

		const body = await request.json();

		const username = String(body.username ?? '')
			.trim()
			.toLowerCase();
		const password = String(body.password ?? '');

		if (!username || !password) {
			return json({ error: 'Missing username or password' }, { status: 400 });
		}

		const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);

		if (!user) {
			return json({ error: 'Invalid credentials' }, { status: 401 });
		}

		if (user.deletedAt) {
			return json({ error: 'Account unavailable' }, { status: 403 });
		}

		const valid = await argon2.verify(user.passwordHash, password);

		if (!valid) {
			return json({ error: 'Invalid credentials' }, { status: 401 });
		}

		const sessionId = crypto.randomUUID();
		const csrfToken = crypto.randomBytes(32).toString('hex');

		const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

		await db.insert(sessions).values({
			id: sessionId,
			userId: user.id,
			csrfToken,
			expiresAt
		});

		await db
			.update(users)
			.set({
				lastLoginAt: new Date(),
				updatedAt: new Date()
			})
			.where(eq(users.id, user.id));

		cookies.set(SESSION_COOKIE_NAME, sessionId, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge: SESSION_MAX_AGE
		});

		return json({ ok: true });
	} catch (err) {
		console.error('Login error:', err);

		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
