import type { APIRoute } from 'astro';

import { getPosts } from '../lib/emdash';
import { absoluteUrl } from '../lib/seo';

export const GET: APIRoute = async ({ site }) => {
	const posts = await getPosts();
	const staticPaths = ['/', '/blog', '/contacto'];
	const urls = [
		...staticPaths.map((path) => absoluteUrl(path, site)),
		...posts.map((post) => absoluteUrl(`/blog/${post.slug}`, site)),
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
		.map((url) => `  <url><loc>${url}</loc></url>`)
		.join('\n')}\n</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	});
};
