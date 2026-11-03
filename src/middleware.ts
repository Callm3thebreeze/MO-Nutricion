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

export const onRequest = defineMiddleware(async (context, next) => {
  const rewriteTarget = ROUTE_REWRITES[context.url.pathname];

  if (rewriteTarget && context.url.pathname !== rewriteTarget) {
    return context.rewrite(rewriteTarget);
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

  const forwardedProto = context.request.headers.get('x-forwarded-proto');
  const isHttps = context.url.protocol === 'https:' || forwardedProto === 'https';

  if (import.meta.env.PROD && isHttps && !response.headers.has('Strict-Transport-Security')) {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  return response;
});
