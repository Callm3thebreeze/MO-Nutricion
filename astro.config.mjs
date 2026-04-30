import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import emdash from 'emdash/astro';
import emdashConfig from './src/emdash/virtual-config';

const siteUrl = process.env.SITE_URL ?? 'https://maraolivaresnutricio.com';

export default defineConfig({
	site: siteUrl,
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	integrations: [react(), emdash(emdashConfig)],
});
