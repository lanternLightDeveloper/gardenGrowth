<!-- src/routes/weather/+page.svelte -->
<script lang="ts">
	let { data } = $props();

	const w = data.weather;

	console.log(data.weather);
</script>

{#if !w}
	<p>No weather data found.</p>
{:else}
	<h1>Weather Debug View</h1>

	<table>
		<tbody>
			<tr><td>Date</td><td>{w.date}</td></tr>
			<tr><td>Temp Avg</td><td>{w.temp_avg}</td></tr>
			<tr><td>Temp Min</td><td>{w.temp_min}</td></tr>
			<tr><td>Temp Max</td><td>{w.temp_max}</td></tr>
			<tr><td>Rain Total</td><td>{w.rain_total}</td></tr>
			<tr><td>Weather Code</td><td>{w.weather_code}</td></tr>
			<tr><td>Wind Speed Max</td><td>{w.wind_speed_max}</td></tr>
			<tr><td>Wind Gust Max</td><td>{w.wind_gust_max}</td></tr>
			<tr><td>Humidity Mean</td><td>{w.humidity_mean}</td></tr>
			<tr><td>Sunshine Duration</td><td>{w.sunshine_duration}</td></tr>
			<tr><td>Precip Prob Max</td><td>{w.precip_prob_max}</td></tr>
			<tr><td>Apparent Temp Max</td><td>{w.apparent_temp_max}</td></tr>
			<tr><td>Apparent Temp Min</td><td>{w.apparent_temp_min}</td></tr>
			<tr><td>Source</td><td>{w.source}</td></tr>
		</tbody>
	</table>

	<h2>Raw JSON</h2>
	<pre>{JSON.stringify(w.raw_json, null, 2)}</pre>
{/if}

<style>
	table {
		border-collapse: collapse;
		margin-top: 1rem;
	}

	td {
		border: var(--border);
		padding: 6px 10px;
	}

	td:first-child {
		font-weight: bold;
	}
</style>
