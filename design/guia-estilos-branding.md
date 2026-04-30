# Guia de estilos web - Mara Olivares Nutricion

## 1) Direccion visual
- Personalidad: cercana, amable, profesional y basada en evidencia.
- Sensacion: bienestar, calma y confianza.
- Lenguaje formal: lineas redondeadas, bordes suaves, bloques con aire y acentos pastel.
- Composicion: fondos claros con formas organicas y clusters de puntos.

## 2) Paleta de color (extraida del branding)
### Color principal
- Azul marca: #5D7BFF
  - Uso: botones primarios, iconos, titulares, enlaces activos, acentos de trazo.

### Acentos pastel
- Crema: #FFF3C4
  - Uso: botones secundarios, bloques de CTA, rellenos suaves de iconos.
- Lila claro: #EAF1FF
  - Uso: fondos suaves de tarjetas y secciones, fondos de chips.
- Verde menta: #DFF3E6
  - Uso: formas decorativas, estados positivos, rellenos suaves.
- Melocoton: #FFE0D1
  - Uso: acentos de equilibrio visual y elementos decorativos.

### Neutros funcionales
- Fondo base: #F6F8FF
- Superficie: #FFFFFF
- Texto principal: #38456D
- Texto secundario: #4E5F8F
- Borde: #CED9FF

## 3) Tipografia
- Titulares y destacados: Lilita One.
- Texto corrido e interfaz: Poppins (400, 500, 600, 700).
- Jerarquia:
  - H1 grande y expresivo, foco en mensaje emocional.
  - H2 claro y amigable.
  - Texto de apoyo con buena legibilidad y line-height amplio.

## 4) Sistema de iconografia
- Estilo: iconos lineales con esquinas redondeadas y grosor uniforme.
- Trazo: azul marca.
- Rellenos: pastel en zonas clave para reforzar calidez.
- Forma: simple, amigable y reconocible a primera vista.
- Recomendacion tecnica:
  - SVG inline para control de color via CSS.
  - Mantener stroke-linecap y stroke-linejoin en round.
  - Mantener consistencia de grosor entre iconos.

## 5) Componentes UI clave
- Boton primario:
  - Fondo azul marca, texto blanco, radio pill, sombra suave.
- Boton secundario:
  - Fondo crema, borde azul suave, texto azul oscuro.
- Tarjeta:
  - Fondo blanco, borde lila, radio amplio, sombra ligera.
- FAQ:
  - Acordeon limpio sobre superficie blanca con borde suave.
- Footer:
  - Gradiente azul, texto blanco, acentos organicos pastel.

## 6) Patrones y recursos decorativos
- Formas organicas tipo blob con colores pastel.
- Clusters de puntos para ritmo visual.
- Linea ondulada como separador de secciones.
- Uso controlado: decorar sin competir con el contenido.

## 7) Espaciado y layout
- Espaciado amplio en secciones para respiracion visual.
- Grids responsivos de tarjetas.
- Prioridad de lectura en movil: CTA y contenidos clave primero.

## 8) Movimiento e interaccion
- Hover suave en tarjetas y botones (elevacion ligera).
- Transiciones cortas y calmadas.
- Sin efectos agresivos ni distractores.

## 9) Accesibilidad
- Contraste suficiente entre texto y fondo.
- Estados de foco visibles.
- Elementos interactivos con etiquetas y jerarquia semantica.

## 10) Implementacion en este proyecto
- Tokens globales de color y tipografia definidos en src/styles/tokens.css.
- Base visual global en src/styles/base.css y src/styles/utilities.css.
- Header y Footer alineados con marca en src/styles/components/layout.css.
- Home rediseñado en src/components/home y src/styles/components/home.css.
- Iconografia SVG de marca en src/components/ui/BrandIcon.astro.
- Blog y Contacto alineados en src/styles/components/blog.css y src/styles/components/contact.css.
