// admin/+layout.server.ts
import { requireAdmin } from '$lib/db/auth';

export const load = ({ locals }) => {
	requireAdmin(locals);
};
