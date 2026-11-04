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

// <style> inline y el <script type="module"> con el que Vite recarga en caliente cada hoja de estilos
const SITE_DEV_STYLES =
  /<style[^>]*data-vite-dev-id="[^"]*\/src\/styles\/[^"]*"[^>]*>[\s\S]*?<\/style>|<script[^>]*src="\/src\/styles\/[^"]*"[^>]*><\/script>/g;

// HTML público cacheado en el borde de Cloudflare: evita las lecturas de D1 en cada visita.
// Los cambios del CMS tardan como mucho EDGE_TTL segundos en verse (quien tiene sesión, el panel y la API no pasan por caché).
// La Cache API no actúa en *.workers.dev: solo funciona en el dominio propio.
const EDGE_TTL = 300;
const edgeCache = (globalThis as { caches?: { default?: Cache } }).caches?.default;

const isCacheable = (request: Request, pathname: string): boolean =>
  import.meta.env.PROD &&
  request.method === 'GET' &&
  !request.headers.has('cookie') &&
  !request.headers.has('authorization') &&
  !pathname.startsWith('/_') &&
  !pathname.startsWith('/api/') &&
  !pathname.startsWith('/admin');

export const onRequest = defineMiddleware(async (context, next) => {
  const rewriteTarget = ROUTE_REWRITES[context.url.pathname];

  if (rewriteTarget && context.url.pathname !== rewriteTarget) {
    return context.rewrite(rewriteTarget);
  }

  const { pathname } = context.url;

  // /sobre-mi/ → /sobre-mi para no duplicar URLs (fuera de las rutas internas de EmDash y la API)
  if (
    pathname.length > 1 &&
    pathname.endsWith('/') &&
    !pathname.startsWith('/_') &&
    !pathname.startsWith('/api/') &&
    context.request.method === 'GET'
  ) {
    return context.redirect((pathname.replace(/\/+$/, '') || '/') + context.url.search, 301);
  }

  const cacheable = edgeCache !== undefined && isCacheable(context.request, pathname);

  if (cacheable) {
    const cached = await edgeCache.match(context.request);
    if (cached) {
      return cached;
    }
  }

  let response = await next();

  // En desarrollo Vite inyecta en todas las páginas los estilos de la web que ya ha cargado,
  // también en el panel de EmDash. En producción cada ruta solo lleva los suyos.
  if (
    import.meta.env.DEV &&
    context.url.pathname.startsWith('/_emdash/admin') &&
    response.headers.get('content-type')?.includes('text/html')
  ) {
    const html = await response.text();
    const headers = new Headers(response.headers);
    headers.delete('content-length');
    response = new Response(html.replace(SITE_DEV_STYLES, ''), { status: response.status, headers });
  }

  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    if (!response.headers.has(header)) {
      response.headers.set(header, value);
    }
  }

  // el subdominio de pruebas de Cloudflare no debe competir con el dominio final
  if (context.url.hostname.endsWith('.workers.dev')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  const forwardedProto = context.request.headers.get('x-forwarded-proto');
  const isHttps = context.url.protocol === 'https:' || forwardedProto === 'https';

  if (import.meta.env.PROD && isHttps && !response.headers.has('Strict-Transport-Security')) {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  if (
    cacheable &&
    response.status === 200 &&
    response.headers.get('content-type')?.includes('text/html') &&
    !response.headers.has('set-cookie')
  ) {
    response.headers.set('Cache-Control', `public, max-age=0, s-maxage=${EDGE_TTL}`);
    const stored = edgeCache.put(context.request, response.clone()).catch(() => undefined);
    const ctx = (context.locals as { cfContext?: { waitUntil(promise: Promise<unknown>): void } }).cfContext;
    if (ctx) {
      ctx.waitUntil(stored);
    } else {
      await stored;
    }
  }

  return response;
});
