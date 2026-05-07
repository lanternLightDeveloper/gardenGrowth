// // src/routes/+layout.server.ts
export function load({ locals }) {
	return {
		user: locals.user
	};
}
