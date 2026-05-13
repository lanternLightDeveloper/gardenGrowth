// $lib/server/weather/fetchWeather.ts
import { db } from '$lib/db/index';
import { weather } from '$lib/db/schema';

export async function fetchWeather() {
	const response = await fetch('https://api.open-meteo.com/v1/forecast?...');
	const data = await response.json();

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
			rawJson: data,
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
