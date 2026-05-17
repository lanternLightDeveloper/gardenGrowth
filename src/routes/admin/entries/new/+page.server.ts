// +page.server.ts

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

		let createdEntryId: number | null = null;

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

			createdEntryId = entry.id;

			const dbItems = items.filter((item: any) => item.type !== 'image');

			if (dbItems.length > 0) {
				await tx.insert(entryItems).values(
					dbItems.map((item: any, index: number) => ({
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

		return {
			success: true,
			entryId: createdEntryId
		};
	}
};
