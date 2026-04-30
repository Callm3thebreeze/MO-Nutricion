import type { APIRoute } from 'astro';

export const prerender = false;

const EMDASH_ADMIN_URL = '/_emdash/admin';

const redirectToAdmin: APIRoute = ({ redirect }) => redirect(EMDASH_ADMIN_URL, 302);

export const GET = redirectToAdmin;
export const HEAD = redirectToAdmin;
