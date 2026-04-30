import { defineMiddleware } from 'astro:middleware';

const ROUTE_REWRITES: Record<string, string> = {
  '/robots.txt': '/site-robots.txt',
  '/sitemap.xml': '/site-sitemap.xml',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=()',
  'X-Frame-Options': 'DENY',
} as const;

export const onRequest = defineMiddleware(async (context, next) => {
  const rewriteTarget = ROUTE_REWRITES[context.url.pathname];

  if (rewriteTarget && context.url.pathname !== rewriteTarget) {
    return context.rewrite(rewriteTarget);
  }

  const response = await next();

  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    if (!response.headers.has(header)) {
      response.headers.set(header, value);
    }
  }

  const forwardedProto = context.request.headers.get('x-forwarded-proto');
  const isHttps = context.url.protocol === 'https:' || forwardedProto === 'https';

  if (import.meta.env.PROD && isHttps && !response.headers.has('Strict-Transport-Security')) {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  return response;
});
