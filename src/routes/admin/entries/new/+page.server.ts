import { db } from '$lib/db/index';
import { entries, entryItems } from '$lib/db/schema';
import { error } from '@sveltejs/kit';

export const actions = {
	create: async ({ request, locals }) => {
		const user = locals.user;

		if (!user || user.role !== 'admin') {
			throw error(403, 'Forbidden');
		}

		const data = await request.formData();

		const title = data.get('title')?.toString();
		const date = data.get('date')?.toString();

		const itemsRaw = data.get('items')?.toString();

		if (!title || !date) {
			throw error(400, 'Missing title or date');
		}

		const items = itemsRaw ? JSON.parse(itemsRaw) : [];

		await db.transaction(async (tx) => {
			const result = await tx
				.insert(entries)
				.values({
					title,
					date,
					userId: user.id
				})
				.returning();

			const entry = result[0];

			if (!entry) {
				throw error(500, 'Failed to create entry');
			}

			if (items.length > 0) {
				await tx.insert(entryItems).values(
					items.map((item, index) => ({
						entryId: entry.id,
						type: item.type ?? 'note',
						title: item.title ?? null,
						content: item.content ?? null,
						url: item.url ?? null,
						highlight: item.highlight ?? false,
						position: index
					}))
				);
			}
		});

		return { success: true };
	}
};
