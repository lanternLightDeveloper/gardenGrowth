<script lang="ts">
	import { entries, entryItems, tags, entryItemTags } from '$lib/db/mockData';

	// Build quick lookup maps (important for performance + simplicity)
	const itemsByEntryId = new Map<number, typeof entryItems>();

	for (const item of entryItems) {
		if (!itemsByEntryId.has(item.entryId)) {
			itemsByEntryId.set(item.entryId, []);
		}
		itemsByEntryId.get(item.entryId)!.push(item);
	}

	const tagById = new Map(tags.map((t) => [t.id, t.name]));

	const tagsByItemId = new Map<number, string[]>();

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

				<!-- tags -->
				{#if tagsByItemId.get(item.id)?.length}
					<div class="tags">
						{#each tagsByItemId.get(item.id) as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/each}

<style>
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
