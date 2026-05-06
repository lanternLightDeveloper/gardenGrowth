// mockData.ts

export type Entry = {
	id: number;
	date: Date;
	title: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type EntryItemType = 'note' | 'reference' | 'tip' | 'watered';

export type EntryItem = {
	id: number;
	entryId: number;
	type: EntryItemType;
	content?: string | null;
	url?: string | null;
	title?: string | null;
	meta?: Record<string, any> | null;
	position: number;
	highlight: boolean;
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date | null;
};

export type Tag = {
	id: number;
	name: string;
	createdAt: Date;
};

export type EntryItemTag = {
	entryItemId: number;
	tagId: number;
};

export const entries: Entry[] = [
	{
		id: 1,
		date: new Date('2026-04-28'),
		title: 'Spring Prep',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 2,
		date: new Date('2026-04-29'),
		title: 'Watering + Trim',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 3,
		date: new Date('2026-04-30'),
		title: null,
		createdAt: new Date(),
		updatedAt: new Date()
	}
];

export const entryItems: EntryItem[] = [
	{
		id: 1,
		entryId: 1,
		type: 'note',
		content: 'Soil is still a bit dry, added compost.',
		position: 0,
		highlight: false,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 2,
		entryId: 1,
		type: 'reference',
		title: 'Composting guide',
		url: 'https://example.com/compost',
		position: 1,
		highlight: true,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 3,
		entryId: 1,
		type: 'watered',
		content: 'Watered tomatoes and basil',
		meta: { amount: 'light' },
		position: 2,
		highlight: false,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 4,
		entryId: 2,
		type: 'tip',
		content: 'Trim dead leaves early to promote growth.',
		position: 0,
		highlight: true,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 5,
		entryId: 2,
		type: 'note',
		content: 'Mint is spreading fast.',
		position: 1,
		highlight: false,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 6,
		entryId: 3,
		type: 'note',
		content: 'Observed small pests on leaves.',
		position: 0,
		highlight: false,
		createdAt: new Date(),
		updatedAt: new Date()
	}
];

export const tags: Tag[] = [
	{ id: 1, name: 'watering', createdAt: new Date() },
	{ id: 2, name: 'soil', createdAt: new Date() },
	{ id: 3, name: 'pests', createdAt: new Date() },
	{ id: 4, name: 'growth', createdAt: new Date() }
];

export const entryItemTags: EntryItemTag[] = [
	{ entryItemId: 1, tagId: 2 }, // soil
	{ entryItemId: 3, tagId: 1 }, // watering
	{ entryItemId: 4, tagId: 4 }, // growth
	{ entryItemId: 6, tagId: 3 } // pests
];

import Placeholder from '$lib/Images/placeholder.jpg';
import Placeholder2 from '$lib/Images/placeholder2.jpg';
import Placeholder3 from '$lib/Images/placeholder3.jpg';
import Placeholder4 from '$lib/Images/placeholder4.jpg';
import Placeholder5 from '$lib/Images/placeholder5.jpg';
import Placeholder6 from '$lib/Images/placeholder6.jpg';
import Placeholder7 from '$lib/Images/placeholder7.jpg';

export type Photo = {
	id: number;
	entryId: number;
	url: string;
	caption?: string | null;
	isHighlight: boolean;
	position: number;
	altTag?: string | null;
	takenAt?: Date | null;
	createdAt: Date;
};

export const photos: Photo[] = [
	{
		id: 1,
		entryId: 0,
		url: Placeholder,
		caption: 'Tomato seedlings starting to sprout',
		isHighlight: true,
		position: 0,
		altTag: 'Tomato seedlings in soil',
		takenAt: new Date('2026-04-28T09:00:00'),
		createdAt: new Date()
	},
	{
		id: 2,
		entryId: 1,
		url: Placeholder2,
		caption: 'Basil leaves after watering',
		isHighlight: false,
		position: 1,
		altTag: 'Fresh basil leaves',
		takenAt: new Date('2026-04-28T09:10:00'),
		createdAt: new Date()
	},
	{
		id: 3,
		entryId: 2,
		url: Placeholder3,
		caption: null,
		isHighlight: false,
		position: 2,
		altTag: 'Garden bed overview',
		takenAt: null,
		createdAt: new Date()
	},
	{
		id: 4,
		entryId: 3,
		url: Placeholder4,
		caption: 'Mint growing aggressively',
		isHighlight: true,
		position: 0,
		altTag: 'Mint plant spreading',
		takenAt: new Date('2026-04-29T14:00:00'),
		createdAt: new Date()
	},
	{
		id: 5,
		entryId: 4,
		url: Placeholder5,
		caption: 'Trimmed leaves pile',
		isHighlight: false,
		position: 1,
		altTag: 'Pile of trimmed leaves',
		takenAt: new Date('2026-04-29T14:20:00'),
		createdAt: new Date()
	},
	{
		id: 6,
		entryId: 5,
		url: Placeholder6,
		caption: 'Leaf damage from pests',
		isHighlight: true,
		position: 0,
		altTag: 'Leaf with visible pest damage',
		takenAt: new Date('2026-04-30T11:30:00'),
		createdAt: new Date()
	},
	{
		id: 7,
		entryId: 6,
		url: Placeholder7,
		caption: null,
		isHighlight: false,
		position: 1,
		altTag: null,
		takenAt: null,
		createdAt: new Date()
	}
];

export type Weather = {
	id: number;
	entryId: number;
	tempAvg?: number | null;
	tempMin?: number | null;
	tempMax?: number | null;
	rainTotal?: number | null;
	condition?: string | null;
	rawJson?: Record<string, any> | null;
	createdAt: Date;
};

export const weather: Weather[] = [
	{
		id: 1,
		entryId: 1,
		tempAvg: 62,
		tempMin: 55,
		tempMax: 68,
		rainTotal: 2, // mm
		condition: 'Partly cloudy',
		rawJson: {
			location: 'Seattle',
			forecast: {
				day: {
					avgtemp_f: 62,
					mintemp_f: 55,
					maxtemp_f: 68,
					totalprecip_mm: 2,
					condition: { text: 'Partly cloudy', icon: '//cdn.weatherapi.com/...' }
				}
			}
		},
		createdAt: new Date()
	},
	{
		id: 2,
		entryId: 2,
		tempAvg: 58,
		tempMin: 52,
		tempMax: 61,
		rainTotal: 12,
		condition: 'Light rain',
		rawJson: {
			location: 'Seattle',
			forecast: {
				day: {
					avgtemp_f: 58,
					mintemp_f: 52,
					maxtemp_f: 61,
					totalprecip_mm: 12,
					condition: { text: 'Light rain', icon: '//cdn.weatherapi.com/...' }
				}
			}
		},
		createdAt: new Date()
	}
];
