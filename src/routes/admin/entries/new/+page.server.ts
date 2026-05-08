import { db } from '$lib/db';
import { entries, entryItems } from '$lib/db/schema';

export const actions = {
	create: async ({ request, locals }) => {
		const user = locals.user;

		if (!user || user.role !== 'admin') {
			throw error(403, 'Forbidden');
		}

		const data = await request.formData();

		const title = data.get('title')?.toString();
		const date = data.get('date')?.toString();

		await db.transaction(async (tx) => {
			const [entry] = await tx
				.insert(entries)
				.values({
					title,
					date,
					userId: user.id
				})
				.returning();

			await tx.insert(entryItems).values([
				{
					entryId: entry.id,
					type: 'note',
					content: 'First item',
					position: 0
				}
			]);
		});

		return { success: true };
	}
};
