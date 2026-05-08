import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index';
import { users, authTokens } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export const POST = async ({ request }) => {
	const { email } = await request.json();
	if (!email) return json({ error: 'Email required' }, { status: 400 });

	const [user] = await db.select().from(users).where(eq(users.email, email));
	if (!user) {
		return json({ error: 'User not found' }, { status: 400 });
	}

	const token = crypto.randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

	await db.insert(authTokens).values({
		id: crypto.randomUUID(),
		userId: user.id,
		token,
		expiresAt,
		used: false // <-- FIX THIS TOO
	});

	return json({ ok: true });
};
