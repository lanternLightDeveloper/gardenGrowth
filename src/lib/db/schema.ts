import {
	pgTable,
	pgEnum,
	integer,
	text,
	timestamp,
	boolean,
	jsonb,
	primaryKey,
	uniqueIndex,
	index
} from 'drizzle-orm/pg-core';

export const userRole = pgEnum('user_role', ['user', 'admin']);

export const users = pgTable('users', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	name: text('name'),
	role: userRole('role').notNull().default('user'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
	emailVerified: boolean('email_verified').notNull().default(false),
	lastLoginAt: timestamp('last_login_at'),
	deletedAt: timestamp('deleted_at')
});

export const sessions = pgTable(
	'sessions',
	{
		id: text('id').primaryKey(),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		expiresAt: timestamp('expires_at').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
		revokedAt: timestamp('revoked_at')
	},
	(table) => ({
		entryIdx: index('sessions_user_id_idx').on(table.userId)
	})
);

export const authTokenType = pgEnum('auth_token_type', ['password_reset', 'email_verification']);

export const auth_tokens = pgTable(
	'auth_tokens',
	{
		id: text('id').primaryKey(),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: authTokenType('type').notNull(),
		token: text('token').notNull().unique(),
		expiresAt: timestamp('expires_at').notNull(),
		used: boolean('used').notNull().default(false)
	},
	(table) => ({
		userIdx: index('auth_tokens_user_id_idx').on(table.userId)
	})
);

export const entries = pgTable(
	'entries',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
		date: date('date'),
		title: text('title'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' })
	},
	(table) => ({
		entryIdx: index('entries_user_idx').on(table.userId),
		dateUnique: uniqueIndex('entries_user_date_unique').on(table.userId, table.date)
	})
);

export const entryItemType = pgEnum('entry_item_type', ['note', 'reference', 'tip', 'watered']);

export const entryItems = pgTable(
	'entry_items',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
		entryId: integer('entry_id')
			.notNull()
			.references(() => entries.id, { onDelete: 'cascade' }),
		type: entryItemType('type').notNull(),
		content: text('content'),
		url: text('url'),
		title: text('title'),
		meta: jsonb('meta'),
		position: integer('position').notNull(),
		highlight: boolean('highlight').default(false).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
		deletedAt: timestamp('deleted_at')
	},
	(table) => ({
		entryIdx: index('entry_items_entry_idx').on(table.entryId),
		typeIdx: index('entry_items_type_idx').on(table.type),
		compositeIdx: uniqueIndex('entry_items_entry_position_unique').on(table.entryId, table.position)
	})
);

export const tags = pgTable(
	'tags',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => ({
		uniquePerUser: uniqueIndex('tags_user_name_unique').on(table.userId, table.name)
	})
);

export const entryItemTags = pgTable(
	'entry_item_tags',
	{
		entryItemId: integer('entry_item_id')
			.notNull()
			.references(() => entryItems.id, { onDelete: 'cascade' }),
		tagId: integer('tag_id')
			.notNull()
			.references(() => tags.id, { onDelete: 'cascade' })
	},
	(table) => ({
		entryIdx: index('entry_item_tags_tag_idx').on(table.tagId),
		pk: primaryKey({ columns: [table.entryItemId, table.tagId] })
	})
);

export const photos = pgTable(
	'photos',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
		entryId: integer('entry_id')
			.notNull()
			.references(() => entries.id, { onDelete: 'cascade' }),
		url: text('url').notNull(),
		caption: text('caption'),
		isHighlight: boolean('is_highlight').default(false).notNull(),
		position: integer('position').notNull(),
		altTag: text('alt_tag'),
		takenAt: timestamp('taken_at'),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => ({
		entryIdx: uniqueIndex('photos_entry_position_unique').on(table.entryId, table.position)
	})
);

export const weather = pgTable(
	'weather',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
		entryId: integer('entry_id')
			.notNull()
			.references(() => entries.id, { onDelete: 'cascade' }),
		tempAvg: integer('temp_avg'),
		tempMin: integer('temp_min'),
		tempMax: integer('temp_max'),
		rainTotal: integer('rain_total'),
		condition: text('condition'),
		rawJson: jsonb('raw_json'),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => ({
		entryUnique: uniqueIndex('weather_entry_unique').on(table.entryId)
	})
);
