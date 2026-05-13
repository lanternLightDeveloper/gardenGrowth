// $lib/server/weather/fetchWeather.ts
import { db } from '$lib/db/index';
import { weather } from '$lib/db/schema';

export async function fetchWeather() {
	const url = new URL('https://api.open-meteo.com/v1/forecast');

	url.search = new URLSearchParams({
		latitude: '47.56732',
		longitude: '-122.63264',
		daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
		temperature_unit: 'fahrenheit',
		timezone: 'America/Los_Angeles'
	}).toString();

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Open-Meteo error: ${response.status}`);
	}
	const text = await response.text();

	if (!text) {
		throw new Error('Open-Meteo returned empty response');
	}

	let data;
	try {
		data = JSON.parse(text);
	} catch (err) {
		console.error('Raw Open-Meteo response:', text);
		throw new Error('Invalid JSON from Open-Meteo');
	}

	const today = new Date().toLocaleDateString('en-CA', {
		timeZone: 'America/Los_Angeles'
	});

	const index = data.daily.time.findIndex((t: string) => t === today);

	if (index === -1) {
		throw new Error(`Today's date not found in forecast: ${today}`);
	}

	try {
		await db.insert(weather).values({
			date: today,

			tempAvg: Math.round(
				(data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2
			),
			tempMin: Math.round(data.daily.temperature_2m_min[index]),
			tempMax: Math.round(data.daily.temperature_2m_max[index]),
			rainTotal: data.daily.precipitation_sum[index],
			weatherCode: data.daily.weather_code[index],

			windSpeedMax: data.daily.wind_speed_10m_max?.[index] ?? null,
			windGustMax: data.daily.wind_gusts_10m_max?.[index] ?? null,
			humidityMean: data.daily.relative_humidity_2m_mean?.[index] ?? null,
			sunshineDuration: data.daily.sunshine_duration?.[index] ?? null,
			precipProbMax: data.daily.precipitation_probability_max?.[index] ?? null,
			apparentTempMax: data.daily.apparent_temperature_max?.[index] ?? null,
			apparentTempMin: data.daily.apparent_temperature_min?.[index] ?? null,

			rawJson: {
				daily: {
					time: data.daily.time[index],
					temperature_2m_max: data.daily.temperature_2m_max[index],
					temperature_2m_min: data.daily.temperature_2m_min[index],
					precipitation_sum: data.daily.precipitation_sum[index],
					weather_code: data.daily.weather_code[index],
					wind_speed_10m_max: data.daily.wind_speed_10m_max?.[index],
					wind_gusts_10m_max: data.daily.wind_gusts_10m_max?.[index],
					relative_humidity_2m_mean: data.daily.relative_humidity_2m_mean?.[index],
					sunshine_duration: data.daily.sunshine_duration?.[index],
					precipitation_probability_max: data.daily.precipitation_probability_max?.[index],
					apparent_temperature_max: data.daily.apparent_temperature_max?.[index],
					apparent_temperature_min: data.daily.apparent_temperature_min?.[index]
				},
				latitude: data.latitude,
				longitude: data.longitude,
				timezone: data.timezone
			},

			source: 'open-meteo'
		});

		return {
			date: today,
			index,
			success: true
		};
	} catch (err) {
		console.error('DB insert failed:', err);
		throw err;
	}
}
