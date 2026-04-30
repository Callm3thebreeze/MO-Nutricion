import type { APIRoute } from 'astro';

import { absoluteUrl } from '../lib/seo';

export const GET: APIRoute = async ({ site }) => {
  const robots = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /_emdash/',
    '',
    `Sitemap: ${absoluteUrl('/sitemap.xml', site)}`,
    '',
  ].join('\n');

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
