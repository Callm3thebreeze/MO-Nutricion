const FALLBACK_SITE_URL = 'https://maraolivaresnutricio.com';

export const SITE_NAME = 'Mara Olivares Nutrició';
export const SITE_DESCRIPTION =
'Nutrición clínica en español especializada en salud digestiva, microbiota y salud hormonal.';

export const getSiteUrl = (site?: URL | string): string => {
if (site instanceof URL) {
return site.toString();
}

if (typeof site === 'string' && site.length > 0) {
return site;
}

if (import.meta.env.SITE_URL) {
return import.meta.env.SITE_URL;
}

return FALLBACK_SITE_URL;
};

export const absoluteUrl = (path: string, site?: URL | string): string => {
const normalizedPath = path.startsWith('/') ? path : `/${path}`;
return new URL(normalizedPath, getSiteUrl(site)).toString();
};

export const buildPageTitle = (title?: string): string =>
title ? `${title} | ${SITE_NAME}` : SITE_NAME;
