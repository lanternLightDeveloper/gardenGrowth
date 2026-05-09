import { db } from '$lib/db/index';
import { entryItems } from '$lib/db/schema';

export async function load() {
	try {
		const items = await db
			.select({
				type: entryItems.type,
				content: entryItems.content,
				url: entryItems.url,
				title: entryItems.title
			})
			.from(entryItems);

		return {
			entryItems: items
		};
	} catch (err) {
		console.error('ERROR loading entry items:', err);
		throw err;
	}
}
