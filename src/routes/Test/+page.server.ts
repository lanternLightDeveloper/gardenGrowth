import { db } from '$lib/db';
import { sql } from 'drizzle-orm';

export const load = async () => {
	const result = await db.execute(sql`SELECT NOW() as now`);

	return {
		time: result.rows[0].now
	};
};
