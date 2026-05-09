import { db } from '$lib/db';
import { entries } from '$lib/db/schema';
import { desc } from 'drizzle-orm';

export async function load({ locals }) {
	requireAdmin(locals);

	const allEntries = await db.select().from(entries).orderBy(desc(entries.date));

	return {
		entries: allEntries
	};
}
