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
	integrations: [
		react(),
		// edge-middleware.ts corre antes que EmDash: la caché responde sin arrancar su runtime ni D1
		emdash({ ...emdashConfig, middleware: { outer: './src/edge-middleware.ts' } }),
	],
	vite: {
		// id del despliegue para la clave de la caché del borde (edge-middleware.ts)
		define: { __BUILD_ID__: JSON.stringify(Date.now().toString(36)) },
		// el entorno de compilación de Cloudflare tiene un límite de archivos abiertos (EMFILE con ~1.000 a la vez)
		build: { rollupOptions: { maxParallelFileOps: 64 } },
	},
});
