import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import emdash from 'emdash/astro';
import emdashConfig from './src/emdash/virtual-config';

const siteUrl = process.env.SITE_URL ?? 'https://monutricion.com';

export default defineConfig({
	site: siteUrl,
	output: 'server',
	adapter: cloudflare({
		imageService: 'compile',
		prerenderEnvironment: 'node',
	}),
	integrations: [react(), emdash(emdashConfig)],
	vite: {
		// el entorno de compilación de Cloudflare tiene un límite de archivos abiertos (EMFILE con ~1.000 a la vez)
		build: { rollupOptions: { maxParallelFileOps: 64 } },
	},
});
