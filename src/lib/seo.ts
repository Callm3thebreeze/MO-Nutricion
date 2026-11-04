const FALLBACK_SITE_URL = 'https://monutricion.com';

export const SITE_NAME = 'Mara Olivares Nutrición Integrativa';
export const SITE_DESCRIPTION =
'Nutrición clínica e integrativa con rigor científico: salud hormonal y fertilidad en la mujer, microbiota y salud digestiva, y salud metabólica. Consulta online y presencial en Albacete.';

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
