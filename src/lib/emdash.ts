import { getEmDashCollection, getEmDashEntry } from 'emdash';
import mainLogo from '../assets/logo/main-logo.png';

import { POST_CATEGORIES, type BlogPost, type PostCategory } from '../content/schemas/post';
import { asBoolean, asString, asStringArray, isRecord, toPortableText } from './validators';

const DEFAULT_COVER_IMAGE = mainLogo.src;
const DEFAULT_COVER_ALT = 'Logotipo de Mara Olivares Nutrició';
const POSTS_CACHE_TTL_MS = 60_000;

let postsCache:
	| {
			value: BlogPost[];
			expiresAt: number;
		}
	| null = null;
let postsCachePromise: Promise<BlogPost[]> | null = null;

export const categoryLabels: Record<PostCategory, string> = {
	'salud-digestiva': 'Salud digestiva',
	microbiota: 'Microbiota',
	'salud-hormonal': 'Salud hormonal',
	habitos: 'Hábitos',
};

const isPostCategory = (value: string): value is PostCategory =>
	POST_CATEGORIES.includes(value as PostCategory);

const byNewestDate = (a: BlogPost, b: BlogPost): number => {
	const first = new Date(a.publishedAt).getTime();
	const second = new Date(b.publishedAt).getTime();
	return second - first;
};

const isNotFoundError = (error: unknown): boolean => {
	if (error instanceof Error) {
		const normalizedMessage = error.message.toLowerCase();
		return normalizedMessage.includes('not found') || normalizedMessage.includes('was not found');
	}

	if (isRecord(error)) {
		const code = asString(error.code);
		return code === 'NOT_FOUND';
	}

	return false;
};

const getCoverImage = (
	value: unknown,
	altFallback: string,
): {
	src: string;
	alt: string;
} => {
	if (typeof value === 'string' && value.trim().length > 0) {
		return { src: value, alt: altFallback };
	}

	if (isRecord(value)) {
		const src = asString(value.src);
		const alt = asString(value.alt) ?? altFallback;
		if (src) {
			return { src, alt };
		}
	}

	return { src: DEFAULT_COVER_IMAGE, alt: altFallback };
};

const mapRawPost = (raw: Record<string, unknown>, fallbackSlug: string): BlogPost | null => {
	const title = asString(raw.title);
	const excerpt = asString(raw.excerpt);
	const publishedAt =
		asString(raw.publish_date) ?? asString(raw.published_at) ?? asString(raw.publishedAt);
	if (!title || !excerpt || !publishedAt) {
		return null;
	}

	const slug = asString(raw.slug) ?? fallbackSlug;
	const categoryValue = asString(raw.category) ?? 'habitos';
	const category = isPostCategory(categoryValue) ? categoryValue : 'habitos';
	const tags = asStringArray(raw.tags);
	const coverImageAlt =
		asString(raw.cover_image_alt) ?? asString(raw.coverImageAlt) ?? DEFAULT_COVER_ALT;
	const coverImage = getCoverImage(raw.cover_image ?? raw.coverImage, coverImageAlt);
	const content = toPortableText(raw.content);

	if (content.length === 0) {
		return null;
	}

	const draft = asBoolean(raw.draft) ?? false;

	return {
		slug,
		title,
		excerpt,
		publishedAt,
		updatedAt:
			asString(raw.update_date) ?? asString(raw.updated_at) ?? asString(raw.updatedAt) ?? undefined,
		category,
		tags,
		coverImage,
		content,
		seoTitle: asString(raw.seo_title) ?? asString(raw.seoTitle) ?? undefined,
		seoDescription: asString(raw.seo_description) ?? asString(raw.seoDescription) ?? undefined,
		canonicalUrl: asString(raw.canonical_url) ?? asString(raw.canonicalUrl) ?? undefined,
		draft,
	};
};

const mapEntryToPost = (entryId: string, entryData: unknown): BlogPost | null => {
	if (!isRecord(entryData) || entryId.trim().length === 0) {
		return null;
	}

	return mapRawPost(entryData, entryId);
};

const loadPostsFromCollection = async (): Promise<BlogPost[]> => {
	const { entries, error } = await getEmDashCollection('posts', { status: 'published' });

	if (error) {
		throw new Error('No se pudo cargar la colección "posts" desde EmDash.', { cause: error });
	}

	return entries
		.map((entry) => mapEntryToPost(entry.id, entry.data))
		.filter((post): post is BlogPost => post !== null && !post.draft)
		.sort(byNewestDate);
};

export const invalidatePostsCache = (): void => {
	postsCache = null;
	postsCachePromise = null;
};

export const getPosts = async (): Promise<BlogPost[]> => {
	const now = Date.now();
	if (postsCache && postsCache.expiresAt > now) {
		return postsCache.value;
	}

	if (!postsCachePromise) {
		postsCachePromise = loadPostsFromCollection()
			.then((posts) => {
				postsCache = {
					value: posts,
					expiresAt: Date.now() + POSTS_CACHE_TTL_MS,
				};
				return posts;
			})
			.finally(() => {
				postsCachePromise = null;
			});
	}

	return postsCachePromise;
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
	const { entry, error } = await getEmDashEntry('posts', slug);

	if (error) {
		if (isNotFoundError(error)) {
			return null;
		}

		throw new Error(`No se pudo cargar la entrada "${slug}" desde EmDash.`, { cause: error });
	}

	if (entry) {
		const post = mapEntryToPost(entry.id, entry.data);
		if (!post || post.draft) {
			return null;
		}
		return post;
	}

	const posts = await getPosts();
	return posts.find((post) => post.slug === slug) ?? null;
};
