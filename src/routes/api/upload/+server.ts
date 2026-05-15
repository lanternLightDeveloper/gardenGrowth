import { json } from '@sveltejs/kit';

import { PutObjectCommand } from '@aws-sdk/client-s3';

import { r2 } from '$lib/server/r2';

export const POST = async ({ request }) => {
	try {
		const formData = await request.formData();

		const file = formData.get('image');

		if (!(file instanceof File)) {
			return json({ error: 'No file uploaded' }, { status: 400 });
		}

		const buffer = Buffer.from(await file.arrayBuffer());

		const key = `test/${crypto.randomUUID()}.png`;

		await r2.send(
			new PutObjectCommand({
				Bucket: process.env.R2_BUCKET!,
				Key: key,
				Body: buffer,
				ContentType: file.type
			})
		);

		return json({
			success: true,
			key
		});
	} catch (error) {
		console.error(error);

		return json({ error: 'Upload failed' }, { status: 500 });
	}
};
