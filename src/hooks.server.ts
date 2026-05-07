// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// Only import DB stuff when needed
import { db } from '$lib/db/index';
import { users, sessions } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {
	/* -----------------------------------------
	   DEV: mock authenticated admin user
	------------------------------------------ */
	if (env.DEV_MOCK_AUTH === 'true') {
		event.locals.user = {
			id: 'dev-user',
			username: 'dev@example.com',
			name: 'Dev User',
			role: 'admin'
		};

		event.locals.csrfToken = 'dev-csrf-token';

		return resolve(event);
	}

	/* -----------------------------------------
	   PROD: real session handling
	------------------------------------------ */
	const sessionId = event.cookies.get('tt_session');

	event.locals.user = null;
	event.locals.csrfToken = null;

	if (!sessionId) {
		return resolve(event);
	}

	const result = await db
		.select({
			userId: users.id,
			username: users.username,
			name: users.name,
			role: users.role,
			expiresAt: sessions.expiresAt,
			csrfToken: sessions.csrfToken
		})
		.from(sessions)
		.innerJoin(users, eq(users.id, sessions.userId))
		.where(eq(sessions.id, sessionId))
		.limit(1);

	if (result.length === 0) return resolve(event);

	const session = result[0];

	if (session.expiresAt < new Date()) {
		await db.delete(sessions).where(eq(sessions.id, sessionId));
		return resolve(event);
	}

	event.locals.user = {
		id: session.userId,
		username: session.username,
		name: session.name,
		role: session.role
	};

	event.locals.csrfToken = session.csrfToken;

	return resolve(event);
};
