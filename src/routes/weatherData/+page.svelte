<!-- src/routes/weather/+page.svelte -->
<script lang="ts">
	let { data } = $props();

	const w = data.weather;

	console.log(w);
</script>

{#if !w}
	<p>No weather data found.</p>
{:else}
	<h1>Weather Debug View</h1>

	<table>
		<tbody>
			<tr><td>Date</td><td>{w.date}</td></tr>
			<tr><td>Temp Avg</td><td>{w.tempAvg}</td></tr>
			<tr><td>Temp Min</td><td>{w.tempMin}</td></tr>
			<tr><td>Temp Max</td><td>{w.tempMax}</td></tr>
			<tr><td>Rain Total</td><td>{w.rainTotal}</td></tr>
			<tr><td>Weather Code</td><td>{w.weatherCode}</td></tr>
			<tr><td>Wind Speed Max</td><td>{w.windSpeedMax}</td></tr>
			<tr><td>Wind Gust Max</td><td>{w.windGustMax}</td></tr>
			<tr><td>Humidity Mean</td><td>{w.humidityMean}</td></tr>
			<tr><td>Sunshine Duration</td><td>{w.sunshineDuration}</td></tr>
			<tr><td>Precip Prob Max</td><td>{w.precipProbMax}</td></tr>
			<tr><td>Apparent Temp Max</td><td>{w.apparentTempMax}</td></tr>
			<tr><td>Apparent Temp Min</td><td>{w.apparentTempMin}</td></tr>
			<tr><td>Source</td><td>{w.source}</td></tr>
		</tbody>
	</table>

	<h2>Raw JSON</h2>

	<pre>{JSON.stringify(w.rawJson, null, 2)}</pre>
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
