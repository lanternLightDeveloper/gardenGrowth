import { json } from '@sveltejs/kit';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '$lib/server/r2';

import { db } from '$lib/db';
import { photos } from '$lib/db/schema';

export const POST = async ({ request }) => {
	try {
		const formData = await request.formData();

		const file = formData.get('image');
		const entryId = formData.get('entryId');
		const caption = formData.get('caption');

		if (!(file instanceof File)) {
			return json({ error: 'No file uploaded' }, { status: 400 });
		}

		if (!entryId) {
			return json({ error: 'Missing entryId' }, { status: 400 });
		}

		const buffer = Buffer.from(await file.arrayBuffer());

		// const key = `entries/${entryId}/${crypto.randomUUID()}.png`;
		const key = `entries/${crypto.randomUUID()}.png`;

		await r2.send(
			new PutObjectCommand({
				Bucket: process.env.R2_BUCKET!,
				Key: key,
				Body: buffer,
				ContentType: file.type
			})
		);

		const imageUrl = `https://imagetest.gardengrowth.lanternlightdevelopment.com/${key}`;

		const [photo] = await db
			.insert(photos)
			.values({
				entryId: Number(entryId),
				url: imageUrl,
				storageKey: key,
				caption: caption ? String(caption) : null,
				position: 0,
				mimeType: file.type
			})
			.returning();

		return json({
			success: true,
			photo
		});
	} catch (error) {
		console.error(error);

		return json({ error: 'Upload failed' }, { status: 500 });
	}
};
