import { defineMiddleware } from 'astro:middleware';

// Se ejecuta antes que EmDash (opción `middleware.outer` de la integración): un acierto de caché
// responde sin arrancar su runtime ni D1, que en frío cuesta ~0,7-1,3 s.

declare const __BUILD_ID__: string;

// Las páginas fijas solo cambian al desplegar, y la clave lleva el id del despliegue:
// una versión nueva nunca sirve HTML viejo que apunte a CSS/JS que ya no existen.
// El blog cambia desde el CMS sin desplegar, así que caduca antes.
const STATIC_TTL = 86_400;
const BLOG_TTL = 300;

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=()',
  'X-Frame-Options': 'DENY',
  // 'unsafe-inline' en scripts: Astro emite scripts de módulo en línea y el hero de la home usa define:vars
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; '),
};

const edgeCache = (globalThis as { caches?: { default?: Cache } }).caches?.default;

const isInternal = (pathname: string): boolean =>
  pathname.startsWith('/_') || pathname.startsWith('/api/') || pathname.startsWith('/admin');

const isCacheable = (request: Request, pathname: string): boolean =>
  import.meta.env.PROD &&
  request.method === 'GET' &&
  !request.headers.has('cookie') &&
  !request.headers.has('authorization') &&
  !isInternal(pathname);

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context;
  const { pathname } = url;

  // La Cache API no actúa en *.workers.dev: solo funciona en el dominio propio.
  const cacheKey = edgeCache && isCacheable(request, pathname) ? new URL(url) : undefined;
  if (cacheKey) {
    cacheKey.searchParams.set('__v', __BUILD_ID__);
    const cached = await edgeCache!.match(cacheKey);
    // copia: las cabeceras de la Cache API son inmutables y Astro las retoca al terminar
    if (cached) {
      const hit = new Response(cached.body, cached);
      // sin esto Cloudflare aplica su «Browser Cache TTL» (4 h) a los aciertos y el navegador
      // guardaría HTML que tras un despliegue apunta a CSS/JS que ya no existen
      hit.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
      hit.headers.delete('CF-Cache-Status');
      return hit;
    }
  }

  const response = await next();

  // El panel de EmDash lleva su propia CSP estricta; no se toca.
  if (!pathname.startsWith('/_emdash')) {
    for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
      if (header === 'Content-Security-Policy' && import.meta.env.DEV) continue;
      response.headers.set(header, value);
    }
    // tiempos internos de EmDash (consultas a D1, plugins): no se publican
    response.headers.delete('Server-Timing');
  }

  // el subdominio de pruebas de Cloudflare no debe competir con el dominio final
  if (url.hostname.endsWith('.workers.dev')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  if (import.meta.env.PROD && url.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  if (
    cacheKey &&
    response.status === 200 &&
    response.headers.get('content-type')?.includes('text/html') &&
    !response.headers.has('set-cookie')
  ) {
    const ttl = pathname === '/blog' || pathname.startsWith('/blog/') ? BLOG_TTL : STATIC_TTL;
    response.headers.set('Cache-Control', `public, max-age=0, s-maxage=${ttl}`);
    const stored = edgeCache!.put(cacheKey, response.clone()).catch(() => undefined);
    const ctx = (context.locals as { cfContext?: { waitUntil(promise: Promise<unknown>): void } }).cfContext;
    if (ctx) ctx.waitUntil(stored);
    else await stored;
  }

  return response;
});
