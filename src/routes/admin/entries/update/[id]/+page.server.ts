// +page.server.ts

import { db } from '$lib/db/index';
import { entries, entryItems } from '$lib/db/schema';
import { requireAdmin } from '$lib/db/auth';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function load({ params, locals }) {
	requireAdmin(locals);

	const id = Number(params.id);

	const entry = await db
		.select()
		.from(entries)
		.where(eq(entries.id, id))
		.then((rows) => rows[0]);

	if (!entry) {
		throw error(404, 'Entry not found');
	}

	const items = await db.select().from(entryItems).where(eq(entryItems.entryId, id));

	return {
		entry: {
			...entry,
			entryItems: items
		}
	};
}

export const actions = {
	update: async ({ request, params, locals }) => {
		requireAdmin(locals);

		const id = Number(params.id);

		const data = await request.formData();

		const title = data.get('title')?.toString();
		const date = data.get('date')?.toString();

		const itemsRaw = data.get('items')?.toString();

		if (!title || !date) {
			throw error(400, 'Missing fields');
		}

		const items = itemsRaw ? JSON.parse(itemsRaw) : [];

		await db.transaction(async (tx) => {
			await tx
				.update(entries)
				.set({
					title,
					date,
					updatedAt: new Date()
				})
				.where(eq(entries.id, id));

			await tx.delete(entryItems).where(eq(entryItems.entryId, id));

			if (items.length > 0) {
				await tx.insert(entryItems).values(
					items.map((item, index) => ({
						entryId: id,
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
			success: true
		};
	}
};
