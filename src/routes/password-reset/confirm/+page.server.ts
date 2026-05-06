export const load = async ({ url, locals }) => {
	return {
		csrfToken: locals.csrfToken,
		token: url.searchParams.get('token') || ''
	};
};
