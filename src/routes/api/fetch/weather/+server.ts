// src/routes/api/weather/fetch/+server.ts

import { fetchWeather } from '$lib/server/weather/fetchWeather';

export const POST = async () => {
	await fetchWeather();

	return new Response('ok');
};
