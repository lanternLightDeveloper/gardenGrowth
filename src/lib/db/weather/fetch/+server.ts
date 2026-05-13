// $lib/weather/fetch/+server.ts
import { db } from '$lib/db/index';
import { weather } from '$lib/db/schema';

export const POST = async () => {
	const response = await fetch(
		'https://api.open-meteo.com/v1/forecast?' +
			new URLSearchParams({
				latitude: '47.56732',
				longitude: '-122.63264',
				daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
				temperature_unit: 'fahrenheit',
				timezone: 'America/Los_Angeles'
			})
	);

	const data = await response.json();

	const tempMax = Math.round(data.daily.temperature_2m_max[0]);
	const tempMin = Math.round(data.daily.temperature_2m_min[0]);

	await db.insert(weather).values({
		date: data.daily.time[0],

		tempAvg: Math.round((tempMax + tempMin) / 2),

		tempMin,
		tempMax,

		rainTotal: data.daily.precipitation_sum[0],

		weatherCode: data.daily.weather_code[0],

		rawJson: data,

		source: 'open-meteo'
	});

	return new Response('ok');
};
