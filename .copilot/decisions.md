# Mara Olivares Nutrició — Decisiones de Arquitectura (v1)

## D-01 — Astro con render estático por defecto
**Decisión:** usar SSG (pre-render) para páginas públicas y blog.

**Rationale:** minimiza latencia, reduce superficie de ataque y simplifica despliegue en Cloudflare.

**Impacto:** publicación de nuevos posts depende de rebuild (automatizable por webhook EmDash).

---

## D-02 — EmDash como fuente de verdad del blog
**Decisión:** centralizar artículos en colección `posts` de EmDash.

**Rationale:** facilita edición no técnica, versionado editorial y escalado de contenido.

**Impacto:** se define contrato de campos estricto y validaciones obligatorias.

---

## D-03 — TypeScript estricto + utilidades tipadas de CMS
**Decisión:** `strict: true` y capa `src/lib/emdash.ts` para mapear/validar datos.

**Rationale:** reduce errores de integración y endurece consistencia de datos editoriales.

**Impacto:** mayor robustez en build; fallos de contenido se detectan antes de publicar.

---

## D-04 — CSS plano con design tokens
**Decisión:** no usar frameworks/preprocesadores CSS; construir sistema con `tokens.css`.

**Rationale:** cumple requisito, mantiene control fino de rendimiento y coherencia visual.

**Impacto:** disciplina de naming y organización por componentes para evitar deuda CSS.

---

## D-05 — Arquitectura de componentes desacoplada por dominio
**Decisión:** separar componentes `ui`, `home`, `blog`, `contact`.

**Rationale:** mejora mantenibilidad y facilita evolución por secciones sin acoplamiento excesivo.

**Impacto:** estructura predecible para implementers y futuras iteraciones.

---

## D-06 — Formulario de contacto simulado en cliente (sin backend)
**Decisión:** implementar validación cliente + feedback en UI sin envío real.

**Rationale:** cumple alcance v1 permitiendo probar UX y accesibilidad antes de integrar backend.

**Impacto:** se deberá sustituir handler por endpoint real en v2 manteniendo mismo contrato de campos.

---

## D-07 — Seguridad por defecto en cabeceras y sanitización de contenido
**Decisión:** aplicar CSP y cabeceras de hardening; evitar inyección HTML no sanitizada.

**Rationale:** sitio sanitario/informativo requiere confianza y minimización de riesgos XSS/mixed content.

**Impacto:** cualquier script externo requiere explicitación en CSP.

---

## D-08 — A11y como criterio de aceptación, no post-proceso
**Decisión:** WCAG 2.2 AA integrada desde diseño de componentes.

**Rationale:** reduce retrabajo y garantiza inclusión desde v1.

**Impacto:** se definen checks obligatorios de foco, contraste, labels y semántica.

---

## D-09 — SEO técnico básico incorporado en layout base
**Decisión:** centralizar metadatos, canonical y OG en `SeoHead` + JSON-LD en blog.

**Rationale:** mejora indexación desde lanzamiento sin complejidad excesiva.

**Impacto:** cada página solo define props SEO específicas; consistencia global garantizada.

---

## D-10 — Uso obligatorio de activos locales de `design/`
**Decisión:** implementar UI tomando `design/` como guía visual y `main-logo.png` como identidad oficial.

**Rationale:** asegurar fidelidad de marca desde la primera entrega.

**Impacto:** cambios visuales mayores requerirán actualización explícita de referencias.
