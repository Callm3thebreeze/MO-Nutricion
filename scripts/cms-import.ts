// Crea en una instancia de EmDash (local o producción) las colecciones, campos y entradas
// definidas en src/cms/model.ts. Es idempotente: lo que ya existe no se toca,
// así que nunca sobrescribe cambios hechos desde el panel.
//
// Uso:
//   npx emdash login --url https://monutricion.com      (una vez)
//   node --experimental-strip-types scripts/cms-import.ts --url https://monutricion.com
//
// Opciones: --token <token> o la variable EMDASH_TOKEN para usar un token concreto,
//           --header "Nombre: valor" para cabeceras adicionales (p. ej. una cookie en local).

import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { collections, PAGE_GROUP } from '../src/cms/model.ts';

const { values: args } = parseArgs({
	options: {
		url: { type: 'string' },
		token: { type: 'string' },
		header: { type: 'string', multiple: true },
	},
});

if (!args.url) {
	console.error('Falta --url (p. ej. --url https://monutricion.com)');
	process.exit(1);
}

const baseUrl = new URL(args.url).origin;

const storedToken = (): string | undefined => {
	try {
		const store = JSON.parse(readFileSync(join(homedir(), '.config', 'emdash', 'auth.json'), 'utf8'));
		return store[baseUrl]?.accessToken;
	} catch {
		return undefined;
	}
};

const token = args.token ?? process.env.EMDASH_TOKEN ?? storedToken();
const headers: Record<string, string> = {
	'Content-Type': 'application/json',
	'X-EmDash-Request': '1',
	...(token ? { Authorization: `Bearer ${token}` } : {}),
};
for (const header of args.header ?? []) {
	const [name, ...value] = header.split(':');
	headers[name.trim()] = value.join(':').trim();
}

const api = async <T = unknown>(method: string, path: string, body?: unknown): Promise<T> => {
	const response = await fetch(`${baseUrl}/_emdash/api${path}`, {
		method,
		headers,
		body: body === undefined ? undefined : JSON.stringify(body),
	});
	const json = (await response.json().catch(() => null)) as { success?: boolean; data?: T; error?: unknown } | null;
	if (!response.ok || !json?.success) {
		throw new Error(`${method} ${path} → ${response.status} ${JSON.stringify(json?.error ?? json)}`);
	}
	return json.data as T;
};

interface Named {
	slug: string;
}

const existingCollections = new Set(
	(await api<{ items: Named[] }>('GET', '/schema/collections')).items.map((item) => item.slug),
);

for (const collection of collections) {
	const base = `/schema/collections/${collection.slug}`;

	if (existingCollections.has(collection.slug)) {
		console.log(`· ${collection.label}: la colección ya existe`);
	} else {
		await api('POST', '/schema/collections', {
			slug: collection.slug,
			label: collection.label,
			labelSingular: collection.labelSingular,
			description: collection.description,
			supports: ['drafts', 'revisions'],
			...(collection.urlPattern ? { urlPattern: collection.urlPattern } : {}),
			group: PAGE_GROUP,
			sortOrder: collection.sortOrder,
		});
		console.log(`+ ${collection.label}: colección creada`);
	}

	const fieldsResponse = await api<{ items?: Named[] } | Named[]>('GET', `${base}/fields`);
	const fieldList = Array.isArray(fieldsResponse) ? fieldsResponse : (fieldsResponse.items ?? []);
	const existingFields = new Set(fieldList.map((field) => field.slug));
	let createdFields = 0;

	for (const [index, field] of collection.fields.entries()) {
		if (existingFields.has(field.slug)) {
			continue;
		}
		await api('POST', `${base}/fields`, {
			slug: field.slug,
			label: field.label,
			type: field.type,
			validation: field.subFields ? { subFields: field.subFields } : null,
			sortOrder: index,
		});
		createdFields += 1;
	}
	if (createdFields > 0) {
		console.log(`  + ${createdFields} campos creados`);
		await api('PUT', base, { titleField: collection.titleField });
	}

	const content = await api<{ items: (Named & { id: string })[] }>(
		'GET',
		`/content/${collection.slug}?limit=100`,
	);
	const existingEntries = new Set(content.items.map((item) => item.slug));

	for (const [slug, data] of Object.entries(collection.entries)) {
		if (existingEntries.has(slug)) {
			console.log(`  · ${slug}: la entrada ya existe (no se modifica)`);
			continue;
		}
		const created = await api<{ item?: { id: string }; id?: string }>('POST', `/content/${collection.slug}`, {
			slug,
			data,
		});
		const id = created.item?.id ?? created.id;
		await api('POST', `/content/${collection.slug}/${id}/publish`);
		console.log(`  + ${slug}: entrada creada y publicada`);
	}
}

console.log('Listo.');
