import { db } from '$lib/db/index';
import { entries } from '$lib/db/schema';
import { desc } from 'drizzle-orm';
import { requireAdmin } from '$lib/db/auth';

export async function load({ locals }) {
	requireAdmin(locals);

	const allEntries = await db.select().from(entries).orderBy(desc(entries.date));

	return {
		entries: allEntries
	};
}
