import { collectionBySlug } from './model';

// Los textos de las páginas son estáticos (src/cms/model.ts): no se leen de EmDash
// porque cada consulta a D1 añadía segundos a cada página. EmDash queda solo para el blog.

type Data = Record<string, unknown>;
type EditAnnotation = { 'data-emdash-ref'?: string };

export interface CmsPage<D extends Data = Data> {
	data: D;
	/** Atributos del modo edición de EmDash; vacío mientras los textos sean estáticos */
	edit: (field: string) => EditAnnotation;
}

const noEdit = (): EditAnnotation => ({});

export const getPage = async (collection: string, slug: string): Promise<CmsPage> => {
	const data = collectionBySlug(collection).entries[slug];
	if (!data) {
		throw new Error(`No hay contenido para ${collection}/${slug}`);
	}
	return { data, edit: noEdit };
};

export interface CmsArea extends CmsPage {
	slug: string;
}

/** Áreas de especialización ordenadas por su campo «orden». */
export const getAreas = async (): Promise<CmsArea[]> =>
	Object.entries(collectionBySlug('areas').entries)
		.map(([slug, data]) => ({ slug, data, edit: noEdit }))
		.sort((a, b) => Number(a.data.orden ?? 0) - Number(b.data.orden ?? 0));

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
