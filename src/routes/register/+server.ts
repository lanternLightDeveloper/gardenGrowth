import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { users } from '$lib/db/schema';
import { rateLimit } from '$lib/db/rateLimit';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';

export const POST = async ({ request }) => {
	try {
		console.log('🟢 Register endpoint hit');

		const ip =
			request.headers.get('cf-connecting-ip') ??
			request.headers.get('x-forwarded-for') ??
			'unknown';

		console.log('IP:', ip);

		if (!rateLimit(`register:${ip}`, 3, 60_000)) {
			return json({ error: 'Too many registration attempts. Try again later.' }, { status: 429 });
		}

		const body = await request.json();

		console.log('BODY:', body);

		const { username, password, name } = body;

		if (!username || !password) {
			return json({ error: 'Missing username or password' }, { status: 400 });
		}

		const existing = await db.select().from(users).where(eq(users.username, username)).limit(1);

		console.log('Existing users:', existing);

		if (existing.length > 0) {
			return json({ error: 'User already exists' }, { status: 400 });
		}

		console.log('Hashing password...');

		const passwordHash = await argon2.hash(password);

		console.log('Password hashed');

		await db.insert(users).values({
			username,
			passwordHash,
			name
		});

		console.log('✅ User inserted');

		return json({ ok: true });
	} catch (err) {
		console.error('🔥 REGISTER ERROR:', err);

		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
