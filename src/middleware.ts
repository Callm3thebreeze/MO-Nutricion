import { defineMiddleware } from 'astro:middleware';

const ROUTE_REWRITES: Record<string, string> = {
  '/robots.txt': '/site-robots.txt',
  '/sitemap.xml': '/site-sitemap.xml',
};

// <style> inline y el <script type="module"> con el que Vite recarga en caliente cada hoja de estilos
const SITE_DEV_STYLES =
  /<style[^>]*data-vite-dev-id="[^"]*\/src\/styles\/[^"]*"[^>]*>[\s\S]*?<\/style>|<script[^>]*src="\/src\/styles\/[^"]*"[^>]*><\/script>/g;

// La caché del borde y las cabeceras de seguridad están en edge-middleware.ts (corre antes que EmDash).
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

  return response;
});
