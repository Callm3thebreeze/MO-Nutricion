import type { APIRoute } from 'astro';

import { getPosts } from '../lib/emdash';
import { absoluteUrl } from '../lib/seo';

type SitemapItem = {
  loc: string;
  lastmod?: string;
};

const xmlEscape = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const toIsoDate = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
};

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPosts();
  const staticPaths = ['/', '/blog', '/contacto'];

  const entries: SitemapItem[] = [
    ...staticPaths.map((path) => ({
      loc: absoluteUrl(path, site),
    })),
    ...posts.map((post) => ({
      loc: absoluteUrl(`/blog/${post.slug}`, site),
      lastmod: toIsoDate(post.updatedAt ?? post.publishedAt),
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map((entry) => {
      const escapedLoc = xmlEscape(entry.loc);
      const escapedLastmod = entry.lastmod ? xmlEscape(entry.lastmod) : null;

      return [
        '  <url>',
        `    <loc>${escapedLoc}</loc>`,
        escapedLastmod ? `    <lastmod>${escapedLastmod}</lastmod>` : null,
        '  </url>',
      ]
        .filter((line): line is string => line !== null)
        .join('\n');
    })
    .join('\n')}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
