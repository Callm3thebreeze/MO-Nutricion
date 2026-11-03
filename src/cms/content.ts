import { getEmDashCollection, getEmDashEntry } from 'emdash';

import { collectionBySlug } from './model';

type Data = Record<string, unknown>;
type EditAnnotation = { 'data-emdash-ref'?: string };

export interface CmsPage<D extends Data = Data> {
	data: D;
	/** Atributos del modo edición para un campo (vacío fuera del modo edición) */
	edit: (field: string) => EditAnnotation;
}

interface RawEntry {
	id: string;
	data: Data;
	edit?: unknown;
}

const noEdit = (): EditAnnotation => ({});

const editFor =
	(entry: RawEntry | null) =>
	(field: string): EditAnnotation => {
		const proxy = entry?.edit as Record<string, EditAnnotation | undefined> | undefined;
		const ref = proxy?.[field]?.['data-emdash-ref'];
		return typeof ref === 'string' ? { 'data-emdash-ref': ref } : {};
	};

// Un campo vacío en EmDash se respeta (puede vaciarse a propósito);
// solo se recurre al texto por defecto si el campo no existe.
const merge = <D extends Data>(defaults: D, data: Data | undefined): D => {
	const result: Data = { ...defaults };
	for (const key of Object.keys(defaults)) {
		const value = data?.[key];
		if (value !== undefined && value !== null) {
			result[key] = value;
		}
	}
	return result as D;
};

const defaultsFor = (collection: string, slug: string): Data => {
	const defaults = collectionBySlug(collection).entries[slug];
	if (!defaults) {
		throw new Error(`No hay contenido por defecto para ${collection}/${slug}`);
	}
	return defaults;
};

/** Carga una página editable; si EmDash falla o la entrada no existe, devuelve los textos por defecto. */
export const getPage = async (collection: string, slug: string): Promise<CmsPage> => {
	const defaults = defaultsFor(collection, slug);

	try {
		const { entry, error } = await getEmDashEntry(collection, slug);
		if (error) {
			throw error;
		}
		if (!entry) {
			return { data: defaults, edit: noEdit };
		}

		const raw = entry as unknown as RawEntry;
		return { data: merge(defaults, raw.data), edit: editFor(raw) };
	} catch (error) {
		console.error(`[cms] Usando textos por defecto para ${collection}/${slug}`, error);
		return { data: defaults, edit: noEdit };
	}
};

export interface CmsArea extends CmsPage {
	slug: string;
}

const defaultAreas = (): CmsArea[] =>
	Object.entries(collectionBySlug('areas').entries).map(([slug, data]) => ({ slug, data, edit: noEdit }));

/** Áreas de especialización ordenadas por su campo «orden». */
export const getAreas = async (): Promise<CmsArea[]> => {
	// un área nueva creada desde el panel no hereda textos de otra
	const empty = Object.fromEntries(
		Object.entries(Object.values(collectionBySlug('areas').entries)[0] ?? {}).map(([key, value]) => [
			key,
			Array.isArray(value) ? [] : typeof value === 'boolean' ? false : typeof value === 'number' ? 0 : '',
		]),
	);

	try {
		const { entries, error } = await getEmDashCollection('areas', { status: 'published' });
		if (error) {
			throw error;
		}
		if (entries.length === 0) {
			return defaultAreas();
		}

		return (entries as unknown as RawEntry[])
			.map((entry) => {
				const slug = typeof entry.data.slug === 'string' && entry.data.slug ? entry.data.slug : entry.id;
				const defaults = collectionBySlug('areas').entries[slug] ?? empty;
				return { slug, data: merge(defaults, entry.data), edit: editFor(entry) };
			})
			.sort((a, b) => Number(a.data.orden ?? 0) - Number(b.data.orden ?? 0));
	} catch (error) {
		console.error('[cms] Usando áreas por defecto', error);
		return defaultAreas();
	}
};

// ── Formato de los textos ─────────────────────────────────────────────

const escapeHtml = (value: string): string =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

interface RichOptions {
	/** Clase de los fragmentos ~suaves~ */
	lightClass?: string;
	/** Clase extra para el último acento *…* */
	lastAccentClass?: string;
}

/** Convierte *acento*, **negrita** y ~suave~ en HTML seguro. */
export const rich = (value: unknown, options: RichOptions = {}): string => {
	const text = escapeHtml(String(value ?? '').trim()).replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
	const accents = text.match(/\*([^*]+?)\*/g)?.length ?? 0;
	let accentIndex = 0;

	return text
		.replace(/\*([^*]+?)\*/g, (_, inner: string) => {
			accentIndex += 1;
			const extra = options.lastAccentClass && accentIndex === accents ? ` ${options.lastAccentClass}` : '';
			return `<span class="serif-accent${extra}">${inner}</span>`;
		})
		.replace(/~([^~]+?)~/g, `<span class="${options.lightClass ?? 'text-light'}">$1</span>`)
		.replace(/\n/g, '<br />');
};

/** Texto sin marcas de formato (para títulos SEO, atributos o datos estructurados). */
export const plain = (value: unknown): string =>
	String(value ?? '')
		.replace(/\*\*([^*]+?)\*\*/g, '$1')
		.replace(/\*([^*]+?)\*/g, '$1')
		.replace(/~([^~]+?)~/g, '$1')
		.trim();

/** Párrafos separados por una línea en blanco. */
export const paragraphs = (value: unknown): string[] =>
	String(value ?? '')
		.split(/\n\s*\n/)
		.map((item) => item.trim())
		.filter(Boolean);

/** Elementos de lista, uno por línea. */
export const lines = (value: unknown): string[] =>
	String(value ?? '')
		.split('\n')
		.map((item) => item.trim())
		.filter(Boolean);

/** Elementos de un campo repetidor. */
export const items = <T = Data>(value: unknown): T[] =>
	Array.isArray(value) ? (value.filter((item) => item && typeof item === 'object') as T[]) : [];

export const text = (value: unknown): string => String(value ?? '').trim();
