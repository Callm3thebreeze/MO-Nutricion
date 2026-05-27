import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import emdash from 'emdash/astro';
import emdashConfig from './src/emdash/virtual-config';

const siteUrl = process.env.SITE_URL ?? 'https://maraolivaresnutricio.com';

export default defineConfig({
	site: siteUrl,
	output: 'server',
	adapter: cloudflare({
		imageService: 'compile',
		prerenderEnvironment: 'node',
	}),
	integrations: [react(), emdash(emdashConfig)],
});
