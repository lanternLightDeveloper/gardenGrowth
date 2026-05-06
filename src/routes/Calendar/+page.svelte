<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';
	import { weather, entries, entryItems, tags, entryItemTags } from '$lib/db/mockData';

	const weatherByEntryId = new Map(weather.map((w) => [w.entryId, w]));

	let currentDate = $state(new Date());

	const year = $derived(currentDate.getFullYear());
	const month = $derived(currentDate.getMonth());

	function nextMonth() {
		currentDate = new Date(year, month + 1, 1);
	}

	function prevMonth() {
		currentDate = new Date(year, month - 1, 1);
	}

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const monthLabel = $derived(`${monthNames[month]} ${year}`);

	const daysInMonth = $derived(new Date(year, month + 1, 0).getDate());
	const firstDay = $derived(new Date(year, month, 1).getDay());
	const daysInPrevMonth = $derived(new Date(year, month, 0).getDate());

	const calendarDays = $derived(
		Array.from({ length: 42 }, (_, i) => {
			const dayIndex = i - firstDay + 1;

			if (dayIndex <= 0) {
				return {
					day: daysInPrevMonth + dayIndex,
					monthOffset: -1
				};
			}

			if (dayIndex > daysInMonth) {
				return {
					day: dayIndex - daysInMonth,
					monthOffset: 1
				};
			}

			return {
				day: dayIndex,
				monthOffset: 0
			};
		})
	);

	const itemsByEntryId = new SvelteMap<number, typeof entryItems>();

	for (const item of entryItems) {
		if (!itemsByEntryId.has(item.entryId)) {
			itemsByEntryId.set(item.entryId, []);
		}
		itemsByEntryId.get(item.entryId)!.push(item);
	}

	const tagById = new Map(tags.map((t) => [t.id, t.name]));

	const tagsByItemId = new SvelteMap<number, string[]>();

	for (const link of entryItemTags) {
		const tagName = tagById.get(link.tagId);
		if (!tagName) continue;

		if (!tagsByItemId.has(link.entryItemId)) {
			tagsByItemId.set(link.entryItemId, []);
		}

		tagsByItemId.get(link.entryItemId)!.push(tagName);
	}

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		}).format(date);
	}
</script>

<h1>Calendar</h1>

<div class="calendar-header">
	<button onclick={prevMonth}>←</button>
	<h2 class="month-label">{monthLabel}</h2>
	<button onclick={nextMonth}>→</button>
</div>

<div class="calendar">
	<div class="weekdays">
		<div>Sun</div>
		<div>Mon</div>
		<div>Tue</div>
		<div>Wed</div>
		<div>Thu</div>
		<div>Fri</div>
		<div>Sat</div>
	</div>

	<div class="grid">
		{#each calendarDays as d, i (i)}
			<div class="day {d.monthOffset !== 0 ? 'muted' : ''}">
				<div class="num">{d.day}</div>

				{#if d.monthOffset === 0 && weatherByEntryId.get(d.day)}
					{@const w = weatherByEntryId.get(d.day)}

					<div class="weather">
						{w.condition} • {w.tempAvg}°
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

{#each entries as entry (entry.id)}
	<div class="entry">
		<div class="entry-title">
			{entry.title ?? 'Untitled Entry'} — {formatDate(entry.date)}
		</div>

		{#each itemsByEntryId.get(entry.id) ?? [] as item (item.id)}
			<div class="item {item.highlight ? 'highlight' : ''}">
				<strong>{item.type}</strong>

				{#if item.content}
					<div>{item.content}</div>
				{/if}

				{#if item.title}
					<div>
						<a href={item.url} target="_blank" rel="noreferrer">
							{item.title}
						</a>
					</div>
				{/if}

				{#if item.meta}
					<div class="meta">
						{JSON.stringify(item.meta)}
					</div>
				{/if}

				{#if tagsByItemId.get(item.id)?.length}
					<div class="tags">
						{#each tagsByItemId.get(item.id) as tag (tag)}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/each}

<style>
	.calendar {
		max-width: 800px;
	}

	.month-label {
		margin-bottom: 1rem;
		font-weight: 500;
		opacity: 0.8;
	}

	.weekdays,
	.grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		/* gap: 6px; */
	}

	.weekdays div {
		font-weight: bold;
		text-align: center;
		opacity: 0.6;
	}

	.day {
		min-height: 80px;
		border: 1px solid #333;
		/* border-radius: 10px; */
		padding: 6px;
		font-size: 0.9rem;
	}

	.day.muted {
		opacity: 0.4;
	}

	.entry {
		border: 1px solid #ddd;
		border-radius: 12px;
		padding: 12px;
		margin-bottom: 12px;
	}

	.entry-title {
		font-weight: 600;
		margin-bottom: 6px;
	}

	.item {
		padding: 8px;
		border-radius: 8px;
		margin-top: 6px;
		background: #2a9615;
	}

	.highlight {
		background: #9c821a;
	}

	.meta {
		font-size: 12px;
		opacity: 0.7;
		margin-top: 4px;
	}

	.tags {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
		margin-top: 4px;
	}

	.tag {
		font-size: 11px;
		padding: 2px 6px;
		border-radius: 999px;
		background: #0f53ac;
	}
</style>
