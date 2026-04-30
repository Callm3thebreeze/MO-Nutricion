# Mara Olivares Nutrició — Especificación de Arquitectura e Implementación (v1)

## 0) Contexto y activos locales

Proyecto base actual:
- `design/main-logo.png`
- `design/ChatGPT Image 29 abr 2026, 20_12_49.png`
- `design/ChatGPT Image 29 abr 2026, 20_13_09.png`
- `design/ChatGPT Image 29 abr 2026, 20_13_39.png`
- `design/ChatGPT Image 29 abr 2026, 20_13_49.png`
- `design/ChatGPT Image 29 abr 2026, 20_13_59.png`

Metadatos relevantes detectados:
- `main-logo.png`: 661x368, PNG, RGB (sRGB), con transparencia.
- Referencias visuales: PNG RGB entre 1024x1536 y 1254x1254.
- Paleta aproximada detectada (usar como guía junto con referencias):
  - Azul principal: `#4070F0` / `#5070F0`
  - Fondo claro: `#F0F0F0` / `#F6F7FB`
  - Tono crema de apoyo: `#F0F0D0`

> Nota: La implementación debe usar `design/` como guía visual primaria y ajustar tokens finales tras comparación visual directa.

---

## 1) Objetivo v1

Crear web en español para clínica nutricional **Mara Olivares Nutrició** con stack:
- **Astro** + **TypeScript**
- **CSS plano** (sin framework/preprocesador)
- **EmDash CMS** (Cloudflare + integración Astro)

Páginas v1:
1. Inicio (`/`)
2. Blog listado + detalle conectado a EmDash (`/blog`, `/blog/[slug]`)
3. Contacto (`/contacto`) con formulario simulado funcional (sin envío backend)

---

## 2) Arquitectura de información (IA)

## Navegación principal
- Inicio
- Blog
- Contacto

## Jerarquía de contenidos
- **Inicio**
  - Hero (propuesta de valor)
  - Servicios resumidos
    - Salud digestiva
    - Microbiota
    - Salud hormonal
  - Bloque “cómo trabajo” (3 pasos)
  - Llamadas a la acción (Blog + Contacto)
- **Blog**
  - Listado de artículos (EmDash collection `posts`)
  - Filtros básicos por categoría/tag (v1: opcional en UI, obligatorio en estructura de datos)
  - Tarjetas con extracto
- **Detalle de artículo**
  - Cabecera semántica (título, fecha, categoría)
  - Cuerpo rico
  - CTA a contacto
- **Contacto**
  - Texto breve de disponibilidad
  - Formulario simulado con validación cliente
  - Mensaje de estado (éxito/error)

## Footer
- Logo
- Navegación secundaria
- Aviso legal básico pendiente (placeholder textual)
- Copyright

---

## 3) Estructura de rutas

Rutas mínimas:
- `/` → Home
- `/blog` → Listado de posts
- `/blog/[slug]` → Detalle post
- `/contacto` → Formulario
- `/404` → Página no encontrada

Rutas técnicas SEO:
- `/sitemap-index.xml` o `/sitemap.xml`
- `/robots.txt`

Opcional recomendado:
- `/rss.xml` para blog

---

## 4) Arquitectura técnica (Astro + EmDash + Cloudflare)

## Estrategia de render
- **SSG por defecto** (pre-render) para máximo rendimiento.
- Blog generado en build desde EmDash (colección `posts`).
- Rebuild por webhook del CMS en publicación/actualización.

## Integraciones esperadas
- Astro + TypeScript (`strict: true`).
- Integración Astro de EmDash (según paquete oficial de EmDash para Astro).
- Despliegue en Cloudflare Pages/Workers compatible con Astro.

## Requisitos de configuración
- Variables de entorno (ejemplo):
  - `EMDASH_PROJECT_ID`
  - `EMDASH_API_TOKEN` (solo server/build)
  - `SITE_URL`
- Nunca exponer tokens privados en cliente.

---

## 5) Estructura de carpetas y componentes

```text
/
├─ public/
│  ├─ assets/
│  │  └─ logo/main-logo.png
│  └─ favicon.svg
├─ src/
│  ├─ layouts/
│  │  └─ BaseLayout.astro
│  ├─ components/
│  │  ├─ ui/
│  │  │  ├─ Header.astro
│  │  │  ├─ Footer.astro
│  │  │  ├─ SeoHead.astro
│  │  │  └─ SkipLink.astro
│  │  ├─ home/
│  │  │  ├─ HomeHero.astro
│  │  │  ├─ ServicesSummary.astro
│  │  │  ├─ ApproachSteps.astro
│  │  │  └─ HomeCta.astro
│  │  ├─ blog/
│  │  │  ├─ BlogCard.astro
│  │  │  ├─ BlogList.astro
│  │  │  └─ BlogMeta.astro
│  │  └─ contact/
│  │     └─ ContactForm.astro
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ blog/index.astro
│  │  ├─ blog/[slug].astro
│  │  ├─ contacto.astro
│  │  ├─ 404.astro
│  │  ├─ sitemap.xml.ts
│  │  └─ robots.txt.ts
│  ├─ lib/
│  │  ├─ emdash.ts
│  │  ├─ seo.ts
│  │  └─ validators.ts
│  ├─ styles/
│  │  ├─ tokens.css
│  │  ├─ reset.css
│  │  ├─ base.css
│  │  ├─ utilities.css
│  │  └─ components/
│  └─ content/
│     └─ schemas/
│        └─ post.ts
└─ astro.config.*
```

## CSS (sin framework)
- `tokens.css`: colores, spacing, radios, sombras, tipografía.
- `base.css`: estilos globales accesibles.
- CSS por componente/página cuando sea necesario.
- Convención recomendada: clases semánticas de componente (`.home-hero__title`, etc.) evitando sobreespecificación.

---

## 6) Modelo de contenido EmDash (colección `posts`)

Campos obligatorios:
- `title` (string, 60-90 recomendado)
- `slug` (string único, URL-safe)
- `excerpt` (string, 120-180)
- `publishedAt` (datetime ISO)
- `category` (enum)
- `tags` (string[] 1..5)
- `coverImage` (asset image)
- `content` (rich text/markdown)

Campos opcionales:
- `updatedAt` (datetime)
- `seoTitle` (string)
- `seoDescription` (string)
- `canonicalUrl` (url)
- `draft` (boolean, default `false`)

Enums sugeridos:
- `category`: `salud-digestiva | microbiota | salud-hormonal | habitos`

Reglas:
- No publicar si falta `title`, `slug`, `excerpt`, `publishedAt`, `content`.
- `slug` inmutable tras publicación (salvo migración con redirects).
- `coverImage` alt descriptivo obligatorio en frontmatter o campo auxiliar.

---

## 7) Datos de muestra (3 artículos en español)

## Post 1
- `title`: "5 señales de que tu digestión necesita apoyo nutricional"
- `slug`: `senales-digestion-necesita-apoyo`
- `excerpt`: "Hinchazón, pesadez o cambios intestinales pueden indicar un desequilibrio digestivo. Te explico cuándo consultar y cómo empezar a mejorar."
- `publishedAt`: `2026-05-05T09:00:00+02:00`
- `category`: `salud-digestiva`
- `tags`: `["digestión", "inflamación", "hábitos"]`
- `content` (muestra):
  - `## ¿Qué señales observar?`
  - `La hinchazón frecuente, la pesadez tras las comidas y la irregularidad intestinal son señales comunes de que tu sistema digestivo necesita apoyo.`
  - `## Primeros pasos prácticos`
  - `Empieza por ordenar horarios, aumentar fibra progresivamente, hidratarte bien y revisar cómo te sientan los alimentos ultraprocesados.`

## Post 2
- `title`: "Microbiota intestinal: hábitos diarios para cuidarla"
- `slug`: `microbiota-intestinal-habitos-diarios`
- `excerpt`: "La microbiota influye en energía, inmunidad y bienestar digestivo. Estos hábitos prácticos te ayudarán a nutrirla de forma sostenible."
- `publishedAt`: `2026-05-12T09:00:00+02:00`
- `category`: `microbiota`
- `tags`: `["microbiota", "fibra", "prebióticos"]`
- `content` (muestra):
  - `## Tu microbiota en el día a día`
  - `La diversidad bacteriana mejora cuando combinas frutas, verduras, legumbres, descanso adecuado y movimiento diario.`
  - `## Hábitos clave`
  - `Incluye prebióticos naturales (avena, ajo, cebolla), limita antibióticos innecesarios y prioriza una rutina de sueño estable.`

## Post 3
- `title`: "Nutrición y salud hormonal: claves para equilibrar tu día a día"
- `slug`: `nutricion-y-salud-hormonal-claves`
- `excerpt`: "La alimentación puede apoyar el equilibrio hormonal en etapas de estrés y cambios vitales. Revisa las bases que marcan la diferencia."
- `publishedAt`: `2026-05-19T09:00:00+02:00`
- `category`: `salud-hormonal`
- `tags`: `["hormonas", "estrés", "rutina"]`
- `content` (muestra):
  - `## Energía y regulación hormonal`
  - `Comer de forma suficiente y equilibrada ayuda a estabilizar energía, apetito y respuesta al estrés, factores muy relacionados con el eje hormonal.`
  - `## Bases nutricionales`
  - `Asegura proteína en comidas principales, grasas de calidad, carbohidratos complejos y micronutrientes como magnesio y omega-3.`

---

## 8) Criterios de aceptación por página

## Home (`/`)
- Muestra logo oficial en cabecera.
- Hero en español con propuesta clara de la clínica.
- Incluye 3 bloques de servicios: digestivo, microbiota, hormonal.
- CTA visible a `/contacto` y `/blog`.
- Se adapta desde 320px a desktop sin desbordes.

## Blog listado (`/blog`)
- Consume colección EmDash `posts`.
- Muestra posts ordenados por `publishedAt` descendente.
- Cada tarjeta muestra: título, extracto, fecha, categoría, enlace a detalle.
- Si no hay posts, muestra estado vacío accesible.

## Blog detalle (`/blog/[slug]`)
- Renderiza contenido del post con estructura semántica (`article`, headings).
- Muestra metadatos (fecha, categoría, tags).
- Incluye CTA final a contacto.
- Si slug no existe, responde 404.

## Contacto (`/contacto`)
- Campos: nombre, email, motivo (select), mensaje, consentimiento.
- Validaciones cliente:
  - nombre >= 2 caracteres
  - email válido
  - mensaje >= 20 caracteres
  - consentimiento obligatorio
- En submit válido: prevenir envío real, mostrar mensaje de éxito y limpiar formulario.
- En submit inválido: errores asociados por campo con `aria-describedby`.

---

## 9) Requisitos de accesibilidad (A11y)

- Objetivo mínimo: **WCAG 2.2 AA**.
- `lang="es"` en documento.
- Jerarquía de headings sin saltos ilógicos.
- Contraste mínimo AA (texto normal >= 4.5:1).
- Navegación completa por teclado.
- `:focus-visible` claro y consistente.
- Skip link al contenido principal.
- Alt en imágenes informativas; decorativas con `alt=""`.
- Formularios con `label` explícito + mensajes de error anunciables (`aria-live`).

---

## 10) Requisitos de seguridad

- Sanitizar/escapar contenido dinámico de CMS al render.
- No usar `set:html` sin sanitización previa.
- Definir cabeceras HTTP en Cloudflare (o `_headers`):
  - `Content-Security-Policy` estricta (self + dominios necesarios)
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` mínima
  - `Strict-Transport-Security` (producción HTTPS)
- Secretos solo en entorno servidor/build.
- Dependencias mínimas y actualizadas.

---

## 11) Requisitos de rendimiento

- Objetivo Core Web Vitals (móvil):
  - LCP < 2.5s
  - CLS < 0.1
  - INP < 200ms
- Presupuesto inicial:
  - JS enviado al cliente <= 90KB gzip (v1 objetivo)
  - CSS crítico inicial <= 35KB gzip
- Usar `astro:assets` para imágenes (responsive, formatos modernos cuando proceda).
- Cargar fuentes de forma eficiente (system font stack preferente en v1).
- Evitar hidratar componentes innecesarios (islas solo donde haga falta, p.ej. formulario).

---

## 12) SEO básico

- Metadatos únicos por página: `title`, `description`, canonical.
- Open Graph + Twitter cards.
- `sitemap.xml` y `robots.txt` configurados.
- Estructura semántica (`main`, `nav`, `article`, `section`, `footer`).
- Blog con marcado estructurado JSON-LD:
  - `BlogPosting` en detalle
  - `Organization`/`MedicalBusiness` para entidad del sitio (si aplica y con datos reales)

---

## 13) Guía visual obligatoria para implementación

- Usar `design/main-logo.png` como logo oficial (sin redibujar).
- Tomar composición, estilo de bloques y ritmo visual desde los PNG de `design/`.
- Mantener estética limpia: fondo claro, acentos azules, espacios amplios, tarjetas redondeadas suaves.
- No introducir frameworks CSS ni librerías UI.

---

## 14) Definición de terminado (DoD) para implementer

1. Rutas v1 funcionando (`/`, `/blog`, `/blog/[slug]`, `/contacto`, `/404`).
2. Blog conectado a EmDash con 3 entradas de muestra cargadas.
3. Formulario de contacto simulado funcional con validación accesible.
4. Lighthouse (mobile) orientativo:
   - Performance >= 90
   - Accessibility >= 95
   - Best Practices >= 90
   - SEO >= 90
5. Estilo alineado a referencias de `design/` y logo integrado.
