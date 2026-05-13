// src/routes/weather/+page.server.ts
import { db } from '$lib/db/index';
import { weather } from '$lib/db/schema';
import { desc } from 'drizzle-orm';

export async function load() {
	const latest = await db.select().from(weather).orderBy(desc(weather.date)).limit(1);

	return {
		weather: latest[0] ?? null
	};
}
