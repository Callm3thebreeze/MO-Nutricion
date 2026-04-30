import type { APIRoute } from 'astro';

import { absoluteUrl } from '../lib/seo';

export const GET: APIRoute = async ({ site }) => {
	const robots = `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml', site)}\n`;

	return new Response(robots, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
};
