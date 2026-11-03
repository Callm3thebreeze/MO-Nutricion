// Genera las colecciones y entradas de las páginas editables dentro de .emdash/seed.json
// a partir de src/cms/model.ts, conservando el resto del seed (blog).
//
// Uso: node scripts/cms-seed.ts

import { readFileSync, writeFileSync } from 'node:fs';

import { collections, PAGE_GROUP, type ModelCollection } from '../src/cms/model.ts';

const SEED_PATH = new URL('../.emdash/seed.json', import.meta.url);

export const toSeedCollection = (collection: ModelCollection) => ({
	slug: collection.slug,
	label: collection.label,
	labelSingular: collection.labelSingular,
	description: collection.description,
	supports: ['drafts', 'revisions'],
	...(collection.urlPattern ? { urlPattern: collection.urlPattern } : {}),
	group: PAGE_GROUP,
	sortOrder: collection.sortOrder,
	titleField: collection.titleField,
	fields: collection.fields.map((field) => ({
		slug: field.slug,
		label: field.label,
		type: field.type,
		...(field.subFields ? { validation: { subFields: field.subFields } } : {}),
	})),
});

export const toSeedEntries = (collection: ModelCollection) =>
	Object.entries(collection.entries).map(([slug, data]) => ({
		id: `${collection.slug}-${slug}`,
		slug,
		status: 'published',
		data,
	}));

const seed = JSON.parse(readFileSync(SEED_PATH, 'utf8'));
const managed = new Set(collections.map((collection) => collection.slug));

seed.collections = [
	...seed.collections.filter((collection: { slug: string }) => !managed.has(collection.slug)),
	...collections.map(toSeedCollection),
];

for (const collection of collections) {
	seed.content[collection.slug] = toSeedEntries(collection);
}

writeFileSync(SEED_PATH, `${JSON.stringify(seed, null, 2)}\n`);
console.log(`Seed actualizado con ${collections.length} colecciones editables.`);
