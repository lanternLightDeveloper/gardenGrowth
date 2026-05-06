import { db } from '$lib/db/index';
import { sessions } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const POST = async ({ cookies }) => {
	const sessionId = cookies.get('tt_session');

	if (sessionId) {
		await db.delete(sessions).where(eq(sessions.id, sessionId));
		cookies.delete('tt_session', { path: '/' });
	}

	throw redirect(302, '/login');
};
