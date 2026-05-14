// src/lib/weather/weatherCodes.ts

export type WeatherCodeInfo = {
	code: number;
	label: string;
	description?: string;
	icon?: string;
};

export const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
	0: {
		code: 0,
		label: 'Clear sky',
		icon: '☀️'
	},

	1: {
		code: 1,
		label: 'Mainly clear',
		icon: '🌤️'
	},

	2: {
		code: 2,
		label: 'Partly cloudy',
		icon: '⛅'
	},

	3: {
		code: 3,
		label: 'Overcast',
		icon: '☁️'
	},

	4: {
		code: 4,
		label: 'Smoke or volcanic ash',
		icon: '🌫️'
	},

	5: {
		code: 5,
		label: 'Haze',
		icon: '🌫️'
	},

	10: {
		code: 10,
		label: 'Mist',
		icon: '🌫️'
	},

	11: {
		code: 11,
		label: 'Shallow fog',
		icon: '🌫️'
	},

	12: {
		code: 12,
		label: 'Continuous fog',
		icon: '🌫️'
	},

	13: {
		code: 13,
		label: 'Lightning visible',
		icon: '⚡'
	},

	17: {
		code: 17,
		label: 'Thunderstorm nearby',
		icon: '⛈️'
	},

	18: {
		code: 18,
		label: 'Squalls',
		icon: '💨'
	},

	19: {
		code: 19,
		label: 'Funnel cloud / tornado',
		icon: '🌪️'
	},

	20: {
		code: 20,
		label: 'Past drizzle or snow grains',
		icon: '🌦️'
	},

	21: {
		code: 21,
		label: 'Past rain',
		icon: '🌧️'
	},

	22: {
		code: 22,
		label: 'Past snow',
		icon: '❄️'
	},

	23: {
		code: 23,
		label: 'Past rain and snow',
		icon: '🌨️'
	},

	24: {
		code: 24,
		label: 'Freezing rain/drizzle',
		icon: '🧊'
	},

	25: {
		code: 25,
		label: 'Rain showers',
		icon: '🌦️'
	},

	26: {
		code: 26,
		label: 'Snow showers',
		icon: '🌨️'
	},

	27: {
		code: 27,
		label: 'Hail showers',
		icon: '🧊'
	},

	28: {
		code: 28,
		label: 'Fog',
		icon: '🌫️'
	},

	29: {
		code: 29,
		label: 'Thunderstorm',
		icon: '⛈️'
	},

	45: {
		code: 45,
		label: 'Fog',
		icon: '🌫️'
	},

	48: {
		code: 48,
		label: 'Rime fog',
		icon: '🌫️'
	},

	50: {
		code: 50,
		label: 'Light intermittent drizzle',
		icon: '🌦️'
	},

	51: {
		code: 51,
		label: 'Light continuous drizzle',
		icon: '🌦️'
	},

	52: {
		code: 52,
		label: 'Moderate intermittent drizzle',
		icon: '🌧️'
	},

	53: {
		code: 53,
		label: 'Moderate continuous drizzle',
		icon: '🌧️'
	},

	54: {
		code: 54,
		label: 'Heavy intermittent drizzle',
		icon: '🌧️'
	},

	55: {
		code: 55,
		label: 'Heavy continuous drizzle',
		icon: '🌧️'
	},

	56: {
		code: 56,
		label: 'Freezing drizzle',
		icon: '🧊'
	},

	57: {
		code: 57,
		label: 'Heavy freezing drizzle',
		icon: '🧊'
	},

	58: {
		code: 58,
		label: 'Light drizzle and rain',
		icon: '🌦️'
	},

	59: {
		code: 59,
		label: 'Heavy drizzle and rain',
		icon: '🌧️'
	},

	60: {
		code: 60,
		label: 'Light intermittent rain',
		icon: '🌦️'
	},

	61: {
		code: 61,
		label: 'Light continuous rain',
		icon: '🌧️'
	},

	62: {
		code: 62,
		label: 'Moderate intermittent rain',
		icon: '🌧️'
	},

	63: {
		code: 63,
		label: 'Moderate continuous rain',
		icon: '🌧️'
	},

	64: {
		code: 64,
		label: 'Heavy intermittent rain',
		icon: '🌧️'
	},

	65: {
		code: 65,
		label: 'Heavy continuous rain',
		icon: '🌧️'
	},

	66: {
		code: 66,
		label: 'Freezing rain',
		icon: '🧊'
	},

	67: {
		code: 67,
		label: 'Heavy freezing rain',
		icon: '🧊'
	},

	68: {
		code: 68,
		label: 'Light rain and snow',
		icon: '🌨️'
	},

	69: {
		code: 69,
		label: 'Heavy rain and snow',
		icon: '🌨️'
	},

	70: {
		code: 70,
		label: 'Light intermittent snow',
		icon: '❄️'
	},

	71: {
		code: 71,
		label: 'Light continuous snow',
		icon: '❄️'
	},

	72: {
		code: 72,
		label: 'Moderate intermittent snow',
		icon: '🌨️'
	},

	73: {
		code: 73,
		label: 'Moderate continuous snow',
		icon: '🌨️'
	},

	74: {
		code: 74,
		label: 'Heavy intermittent snow',
		icon: '❄️'
	},

	75: {
		code: 75,
		label: 'Heavy continuous snow',
		icon: '❄️'
	},

	76: {
		code: 76,
		label: 'Diamond dust',
		icon: '✨'
	},

	77: {
		code: 77,
		label: 'Snow grains',
		icon: '❄️'
	},

	78: {
		code: 78,
		label: 'Ice crystals',
		icon: '🧊'
	},

	79: {
		code: 79,
		label: 'Ice pellets',
		icon: '🧊'
	},

	80: {
		code: 80,
		label: 'Light rain showers',
		icon: '🌦️'
	},

	81: {
		code: 81,
		label: 'Moderate rain showers',
		icon: '🌧️'
	},

	82: {
		code: 82,
		label: 'Violent rain showers',
		icon: '⛈️'
	},

	83: {
		code: 83,
		label: 'Light rain/snow showers',
		icon: '🌨️'
	},

	84: {
		code: 84,
		label: 'Heavy rain/snow showers',
		icon: '🌨️'
	},

	85: {
		code: 85,
		label: 'Light snow showers',
		icon: '❄️'
	},

	86: {
		code: 86,
		label: 'Heavy snow showers',
		icon: '🌨️'
	},

	87: {
		code: 87,
		label: 'Light hail showers',
		icon: '🧊'
	},

	88: {
		code: 88,
		label: 'Heavy hail showers',
		icon: '🧊'
	},

	89: {
		code: 89,
		label: 'Light hail',
		icon: '🧊'
	},

	90: {
		code: 90,
		label: 'Heavy hail',
		icon: '🧊'
	},

	91: {
		code: 91,
		label: 'Thunderstorm with light rain',
		icon: '⛈️'
	},

	92: {
		code: 92,
		label: 'Thunderstorm with heavy rain',
		icon: '⛈️'
	},

	93: {
		code: 93,
		label: 'Thunderstorm with snow/hail',
		icon: '⛈️'
	},

	94: {
		code: 94,
		label: 'Heavy thunderstorm with snow/hail',
		icon: '⛈️'
	},

	95: {
		code: 95,
		label: 'Thunderstorm',
		icon: '⛈️'
	},

	96: {
		code: 96,
		label: 'Thunderstorm with hail',
		icon: '⛈️'
	},

	97: {
		code: 97,
		label: 'Heavy thunderstorm',
		icon: '⛈️'
	},

	98: {
		code: 98,
		label: 'Thunderstorm with duststorm',
		icon: '🌪️'
	},

	99: {
		code: 99,
		label: 'Severe thunderstorm with hail',
		icon: '⛈️'
	}
};

export function getWeatherCode(code: number): WeatherCodeInfo {
	return (
		WEATHER_CODES[code] ?? {
			code,
			label: 'Unknown weather',
			icon: '❓'
		}
	);
}
