# Mara Olivares Nutrició · v1

Web estática en Astro + TypeScript + CSS plano con blog conectado a EmDash (`posts`).

## Requisitos

- Node.js 22+
- npm

## Puesta en marcha

```bash
npm install
npx emdash init --database ./.emdash/data.db
npx emdash seed --database ./.emdash/data.db --on-conflict update ./.emdash/seed.json
npm run dev
```

## Comandos

- `npm run dev` · desarrollo
- `npm run check` · chequeo TypeScript/Astro
- `npm run build` · build estático
- `npm run preview` · vista previa

## Rutas

- `/`
- `/admin` (redireccion a `/_emdash/admin`)
- `/blog`
- `/blog/[slug]`
- `/contacto`
- `/404`
- `/sitemap.xml`
- `/robots.txt`

# Formulario de contacto con Resend

El endpoint `POST /api/contact` envía las solicitudes mediante Resend sin
exponer la API key al navegador.

Para desarrollo local, copia `.dev.vars.example` como `.dev.vars` y sustituye
los valores. Para producción en Cloudflare configura la clave como secreto:

```sh
npx wrangler secret put RESEND_API_KEY
```

Configura también `CONTACT_TO_EMAIL` y `CONTACT_FROM_EMAIL` como variables o
secretos del Worker. El dominio utilizado en `CONTACT_FROM_EMAIL` debe estar
verificado en Resend.
