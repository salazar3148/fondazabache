# 03 · Texturas y Efectos

Este es el documento que hace que la carta se vea como se tiene que ver. Todo el CSS de aquí vive en **CSS Modules** dentro de `src/components/decor/` y en `src/styles/textures.css`, nunca en clases de utilidad sueltas.

Índice: [1. Filosofía](#1-filosofía-de-la-textura) · [2. Fondo de madera](#2-el-fondo-de-madera) · [3. Marcos de tabla](#3-marcos-de-tabla-plank) · [4. Letras quemadas](#4-letras-quemadas-el-efecto-firma) · [5. Herrajes](#5-herrajes-de-latón) · [6. Grano global](#6-grano-global) · [7. Sello de lacre](#7-sello-de-lacre) · [8. Presupuesto](#8-presupuesto-de-la-textura)

---

## 1. Filosofía de la textura

Tres reglas que evitan el desastre:

1. **La textura se construye por capas de bajo costo, no con fotos.** Una foto de madera decente en móvil pesa 120–250 KB y se ve estirada. Cinco degradados CSS + un tile de 8 KB se ven mejor y pesan 20 veces menos.
2. **Toda la decoración es una capa `fixed` detrás del contenido, `aria-hidden` y `pointer-events: none`.** Ni un solo píxel decorativo dentro del flujo del documento. Esto mantiene el DOM limpio, el scroll fluido y el lector de pantalla silencioso.
3. **El scroll no repinta la textura.** El fondo es `position: fixed`, así que el compositor lo trata como una capa estática. **Prohibido `background-attachment: fixed`**, que en Safari iOS genera un jank brutal.

---

## 2. El fondo de madera

### 2.1 Anatomía: seis capas

```
┌───────────────────────────────────────────────────┐
│ 6 · Grano de película      opacity .045  soft-light│  ← ruido SVG, 1.6 KB
│ 5 · Luz de vela            radial cálido arriba    │
│ 4 · Viñeta                 radial oscuro en bordes │
│ 3 · Veta de madera         tile AVIF 256²  overlay │  ← 8 KB
│ 2 · Tablones verticales    repeating-linear-grad   │
│ 1 · Base de nogal          linear-gradient vertical│
└───────────────────────────────────────────────────┘
```

### 2.2 Implementación

`src/components/decor/WoodBackdrop.module.css`:

```css
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  /* Aísla el repintado del resto del árbol */
  contain: strict;

  /* ── Capa 1: base de nogal ──────────────────────────── */
  background-color: var(--c-madera-900);
  background-image:
    /* Capa 5: luz de vela, arriba y al centro */
    radial-gradient(
      70% 38% at 50% 4%,
      rgba(224, 117, 47, 0.11) 0%,
      rgba(224, 117, 47, 0.04) 45%,
      transparent 78%
    ),
    /* Capa 4: viñeta */
    radial-gradient(
      130% 88% at 50% 12%,
      transparent 38%,
      rgba(14, 11, 8, 0.34) 74%,
      rgba(14, 11, 8, 0.62) 100%
    ),
    /* Capa 2: tablones verticales de ancho irregular */
    repeating-linear-gradient(
      90deg,
      transparent 0 0,
      /* junta oscura */
      rgba(14, 11, 8, 0.55) 0 1.5px,
      /* filo iluminado del tablón siguiente */
      rgba(246, 239, 227, 0.045) 1.5px 3px,
      transparent 3px 118px
    ),
    /* Capa 1: degradado de profundidad */
    linear-gradient(
      175deg,
      var(--c-madera-800) 0%,
      var(--c-madera-900) 46%,
      #100c07 100%
    );
  background-repeat: no-repeat, no-repeat, repeat, no-repeat;
}

/* ── Capa 3: veta ─────────────────────────────────────── */
.grain {
  position: absolute;
  inset: 0;
  background-image: url('/textures/wood-grain-256.avif');
  background-size: 256px 256px;
  background-repeat: repeat;
  opacity: 0.38;
  mix-blend-mode: overlay;
}

/* Rompe el patrón: una segunda pasada más grande y girada
   elimina la sensación de tile de 256px */
.grainMacro {
  position: absolute;
  inset: 0;
  background-image: url('/textures/wood-grain-256.avif');
  background-size: 512px 768px;
  background-repeat: repeat;
  opacity: 0.16;
  mix-blend-mode: soft-light;
  transform: scaleX(-1);
}
```

> **El truco de las dos pasadas.** Un tile de 256 px repetido en una pantalla de 390 px se nota. Superponer el mismo tile a 512×768 y espejado en X rompe la periodicidad y el ojo deja de percibir la retícula. Coste: **cero bytes extra**, porque es el mismo archivo cacheado.

### 2.3 El tile de veta: cómo generarlo

Se genera **una sola vez** con un filtro SVG y se exporta a AVIF. No se ejecuta `feTurbulence` en runtime jamás: en Android medio cuesta 80–200 ms de pintado.

`tools/wood-grain-source.svg` (se abre en el navegador, se captura a 256×256, se convierte):

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <filter id="veta" x="0" y="0" width="100%" height="100%">
      <!-- Ruido muy estirado en Y = veta larga de madera -->
      <feTurbulence type="fractalNoise"
                    baseFrequency="0.9 0.012"
                    numOctaves="4" seed="7" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncR type="linear" slope="1.35" intercept="-0.18"/>
        <feFuncG type="linear" slope="1.35" intercept="-0.18"/>
        <feFuncB type="linear" slope="1.35" intercept="-0.18"/>
      </feComponentTransfer>
    </filter>
  </defs>
  <rect width="256" height="256" filter="url(#veta)"/>
</svg>
```

Conversión (una vez, se comitea el resultado):

```bash
# 1. Render del SVG a PNG con seamless tiling manual en el editor
#    (o con resvg-js: npx @resvg/resvg-js-cli wood-grain-source.svg -o tile.png -w 256)
# 2. Compresión a AVIF
npx @squoosh/cli --avif '{"cqLevel":42,"cqAlphaLevel":-1,"speed":2}' tile.png
# Resultado esperado: 6-10 KB
```

**Fallback:** si AVIF no está soportado (< 3 % de móviles en 2026), el `background-image` degrada y el fondo se queda con las capas de degradado. Sigue viéndose bien. Se puede añadir `image-set()` con un WebP de respaldo:

```css
background-image: image-set(
  url('/textures/wood-grain-256.avif') type('image/avif'),
  url('/textures/wood-grain-256.webp') type('image/webp')
);
```

### 2.4 Componente

```tsx
// src/components/decor/WoodBackdrop.tsx  — Server Component, cero JS al cliente
import styles from './WoodBackdrop.module.css';

export function WoodBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.grain} />
      <div className={styles.grainMacro} />
    </div>
  );
}
```

Se monta **una sola vez** en `app/layout.tsx`, antes del `<main>`.

---

## 3. Marcos de tabla (`plank`)

Las tarjetas y secciones son tablas cepilladas. Sin imágenes: el volumen es puro `box-shadow` interior.

`src/styles/textures.css`:

```css
/* ── Tabla base ────────────────────────────────────────── */
.plank {
  position: relative;
  background:
    linear-gradient(
      180deg,
      color-mix(in oklab, var(--c-madera-700) 92%, var(--c-hueso-100)) 0%,
      var(--c-madera-700) 34%,
      color-mix(in oklab, var(--c-madera-700) 90%, var(--c-azabache)) 100%
    );
  border: 1px solid var(--c-madera-500);
  border-radius: var(--r-md);
  box-shadow: var(--sh-plank);
  isolation: isolate;
}

/* Veta interna sutil, distinta de la del fondo: rayado fino
   para que la tarjeta no se lea como plástico */
.plank::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background-image: repeating-linear-gradient(
    92deg,
    transparent 0 2px,
    rgba(14, 11, 8, 0.055) 2px 3px,
    transparent 3px 9px
  );
  opacity: 0.7;
  z-index: -1;
}

/* ── Marco tallado: para portada y cabeceras de sección ── */
.plankFramed {
  border: 1px solid var(--c-madera-500);
  border-radius: var(--r-lg);
  padding: var(--sp-5);
  box-shadow:
    /* filete interior de latón */
    inset 0 0 0 1px rgba(176, 141, 87, 0.16),
    /* separación entre filete y borde: aire tallado */
    inset 0 0 0 5px rgba(14, 11, 8, 0.30),
    inset 0 6px 12px -6px rgba(14, 11, 8, 0.55),
    var(--sh-plank);
}

/* ── Talla hacia dentro ────────────────────────────────── */
.carved {
  background: color-mix(in oklab, var(--c-madera-900) 80%, var(--c-azabache));
  border: 1px solid var(--c-madera-600);
  border-radius: var(--r-md);
  box-shadow: var(--sh-carved);
}
```

### 3.1 Junta de tablón como separador

En lugar de un `<hr>` gris, los divisores son la **junta entre dos tablas**: una línea oscura con un filo de luz debajo. Detalle diminuto, diferencia enorme.

```css
.seam {
  height: 2px;
  border: 0;
  background: linear-gradient(
    180deg,
    rgba(14, 11, 8, 0.85) 0 1px,
    rgba(246, 239, 227, 0.07) 1px 2px
  );
}
```

---

## 4. Letras quemadas: el efecto firma

El efecto tiene que leerse como **hierro caliente aplicado sobre madera oscura**. Físicamente eso deja: un **surco carbonizado** en el contorno, una **fibra tostada más clara** en el interior, y un **rescoldo tibio** alrededor.

Se traduce en cuatro capas CSS, en este orden exacto.

### 4.1 Anatomía

| Capa | Fenómeno físico | CSS |
|---|---|---|
| 1 | Rescoldo alrededor | `filter: drop-shadow()` naranja muy difuso |
| 2 | Surco carbonizado | `-webkit-text-stroke` oscuro + `paint-order: stroke fill` |
| 3 | Fibra tostada | `background: linear-gradient()` + `background-clip: text` |
| 4 | Chispa alta | segundo `drop-shadow` de 1 px hacia arriba en latón claro |

### 4.2 Implementación

`src/components/decor/BurntTitle.module.css`:

```css
.burnt {
  /* ── Capa 3: la fibra tostada (relleno en degradado) ── */
  color: transparent;
  background-image: linear-gradient(
    177deg,
    #f7e8cd 0%,     /* hueso muy cálido: el borde superior recibe luz */
    #e6c793 38%,    /* latón claro                                    */
    #c08c4d 72%,    /* tabaco tostado                                 */
    #8a5a2c 100%    /* cuero: la parte baja del trazo quemó más       */
  );
  -webkit-background-clip: text;
  background-clip: text;

  /* ── Capa 2: el surco carbonizado ─────────────────────
     paint-order dibuja el trazo ANTES del relleno, así el
     contorno no se come la letra: queda por fuera.        */
  -webkit-text-stroke: 3px #180d05;
  paint-order: stroke fill;

  /* ── Capas 1 y 4: rescoldo y chispa ───────────────────
     Se usa filter (no text-shadow) porque con background-clip:text
     el text-shadow se pinta detrás del glifo transparente y se ve.  */
  filter:
    drop-shadow(0 1px 0 rgba(246, 239, 227, 0.10))   /* chispa alta   */
    drop-shadow(0 2px 3px rgba(14, 11, 8, 0.85))     /* profundidad   */
    drop-shadow(0 0 12px rgba(224, 117, 47, 0.26))   /* rescoldo      */
    drop-shadow(0 0 30px rgba(198, 85, 31, 0.14));   /* halo lejano   */

  /* Higiene tipográfica */
  font-family: var(--font-display);
  font-weight: 600;
  font-variation-settings: 'SOFT' 24, 'WONK' 1, 'opsz' 72;
  letter-spacing: 0.06em;
  text-wrap: balance;

  /* Evita que el stroke se recorte en descendentes */
  padding-block: 0.08em;
}
```

### 4.3 Fallback obligatorio

`-webkit-text-stroke` + `background-clip: text` funciona en Chromium, WebKit y Firefox modernos, pero el resultado sin ellos sería **texto invisible**. Eso es inaceptable. Detección con `@supports` **invertido**, para que el estado por defecto sea el seguro:

```css
/* Estado seguro por defecto: texto sólido legible */
.burnt {
  color: var(--c-laton-300);
  background-image: none;
}

/* El efecto solo se activa si el navegador puede pintarlo */
@supports (-webkit-background-clip: text) and (-webkit-text-stroke: 1px #000) {
  .burnt {
    color: transparent;
    background-image: linear-gradient(/* ... */);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-stroke: 3px #180d05;
    paint-order: stroke fill;
    filter: /* ... */;
  }
}
```

> **Test manual obligatorio:** en Chrome DevTools, desactivar `paint-order` y comprobar que el título sigue legible. Si en algún navegador el trazo se come el relleno (falta de soporte de `paint-order` en HTML), el título se ve más delgado pero legible. Aceptable.

### 4.4 Variantes por jerarquía

Tres intensidades. Se pasa por prop `intensity`.

```css
/* Marca profunda: solo el lema de portada */
.hot {
  -webkit-text-stroke-width: 4px;
  filter:
    drop-shadow(0 1px 0 rgba(246, 239, 227, 0.13))
    drop-shadow(0 3px 4px rgba(14, 11, 8, 0.9))
    drop-shadow(0 0 16px rgba(224, 117, 47, 0.32))
    drop-shadow(0 0 40px rgba(198, 85, 31, 0.18));
}

/* Estándar: títulos de sección */
.warm { /* valores base de .burnt */ }

/* Roce leve: badges "De la casa", chip activo */
.scorch {
  -webkit-text-stroke-width: 0;
  background-image: linear-gradient(180deg, #f2dcb4 0%, #c99a5c 100%);
  filter: drop-shadow(0 1px 1px rgba(14, 11, 8, 0.8));
}
```

### 4.5 Dónde se usa y dónde NO

| Elemento | Efecto |
|---|---|
| Wordmark de portada | **SVG horneado**, no CSS (ver [`01`](./01-vision-y-marca.md#6-el-logo)) |
| Lema de portada | `.burnt .hot` |
| Título de sección | `.burnt .warm` ← el uso principal |
| Badge "De la casa" | `.scorch` |
| Nombre de producto | **NO.** Hueso plano. La legibilidad manda |
| Precio | **NO.** Candela plano |
| Descripción | **NO** |
| Botones | **NO** |

**Máximo de elementos quemados visibles a la vez: 2.** Por eso el título de sección es sticky-adjacent pero no sticky: cuando entra el siguiente, el anterior ya salió.

### 4.6 Variante de tema claro

Sobre madera clara el hierro deja una marca **oscura**. Se invierte:

```css
[data-theme='dia'] .burnt {
  color: transparent;
  background-image: linear-gradient(178deg, #4a2c12 0%, #2a1608 55%, #180d05 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-stroke: 0;
  filter:
    drop-shadow(0 1px 0 rgba(255, 250, 240, 0.55))    /* relieve sobre claro */
    drop-shadow(0 0 8px rgba(120, 60, 20, 0.18));
}
```

### 4.7 Componente

```tsx
// src/components/decor/BurntTitle.tsx
import type { ElementType, ReactNode } from 'react';
import { clsx } from 'clsx';
import styles from './BurntTitle.module.css';

type Intensity = 'hot' | 'warm' | 'scorch';

interface BurntTitleProps {
  children: ReactNode;
  as?: ElementType;
  intensity?: Intensity;
  className?: string;
  id?: string;
}

export function BurntTitle({
  children,
  as: Tag = 'h2',
  intensity = 'warm',
  className,
  id,
}: BurntTitleProps) {
  return (
    <Tag id={id} className={clsx(styles.burnt, styles[intensity], className)}>
      {children}
    </Tag>
  );
}
```

Server Component. Cero JS.

---

## 5. Herrajes de latón

### 5.1 Remache (`BrassStud`)

Cuatro por marco, en las esquinas. Puro degradado radial: 6 px, sin imagen.

```css
.stud {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background:
    radial-gradient(
      circle at 32% 28%,
      #f0d79b 0%,
      #b08d57 42%,
      #6a4f2c 78%,
      #2c1e0f 100%
    );
  box-shadow:
    0 1px 1.5px rgba(14, 11, 8, 0.9),
    inset 0 0 1px rgba(246, 239, 227, 0.35);
}
.studTL { top: 8px; left: 8px; }
.studTR { top: 8px; right: 8px; }
.studBL { bottom: 8px; left: 8px; }
.studBR { bottom: 8px; right: 8px; }
```

Se usan **solo** en el marco de la portada y en el marco de los títulos de sección. En 30 tarjetas de producto serían 120 remaches: ruido visual.

### 5.2 Filete de latón

```css
.brassRule {
  height: 1px;
  border: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(176, 141, 87, 0.55) 22%,
    rgba(227, 199, 126, 0.85) 50%,
    rgba(176, 141, 87, 0.55) 78%,
    transparent 100%
  );
}
```

### 5.3 Separador de herradura

El separador entre secciones grandes: filete de latón que se abre para dejar pasar una herradura de trazo.

```tsx
// src/components/decor/HorseshoeRule.tsx
import styles from './HorseshoeRule.module.css';

export function HorseshoeRule() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <span className={styles.rule} />
      <svg viewBox="0 0 24 24" className={styles.shoe} fill="none">
        {/* Herradura abierta hacia abajo: la suerte se guarda */}
        <path
          d="M6 20.5V12a6 6 0 0 1 12 0v8.5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="8.6" cy="10" r="0.85" fill="currentColor" />
        <circle cx="15.4" cy="10" r="0.85" fill="currentColor" />
        <circle cx="7.4" cy="14.4" r="0.85" fill="currentColor" />
        <circle cx="16.6" cy="14.4" r="0.85" fill="currentColor" />
      </svg>
      <span className={styles.rule} />
    </div>
  );
}
```

```css
.wrap {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  color: var(--c-laton-500);
  padding-block: var(--sp-8);
}
.rule {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(176, 141, 87, 0.5), transparent);
}
.shoe {
  width: 22px;
  height: 22px;
  flex: none;
  filter: drop-shadow(0 1px 0 rgba(14, 11, 8, 0.9));
}
```

---

## 6. Grano global

Una única capa de ruido sobre TODA la app une visualmente madera, tarjetas y texto. Es el detalle que separa "web con fondo de madera" de "objeto físico".

```css
/* src/styles/textures.css */
.filmGrain {
  position: fixed;
  inset: 0;
  z-index: var(--z-grain);
  pointer-events: none;
  opacity: 0.045;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");
  background-size: 120px 120px;
}
```

**Advertencia de rendimiento y su mitigación.** Un `data:` URI con `feTurbulence` se rasteriza **una vez** al cargar y luego se cachea como imagen: no es un filtro vivo. El coste real es ~8 ms de decodificación inicial en Android medio. Aceptable. Lo que **no** se debe hacer nunca es aplicar `filter: url(#n)` a un elemento con contenido, porque eso sí recalcula en cada frame.

Si la auditoría de rendimiento muestra caída de FPS al hacer scroll, la mitigación es reemplazar el `data:` URI por un **PNG de 120×120 con ruido** (~1.2 KB) y quitar `mix-blend-mode`, cambiándolo por `opacity` sobre un `background-color` transparente. Se pierde un 5 % de gracia y se gana un 100 % de fluidez.

---

## 7. Sello de lacre

Para "El azabache eligió" y el badge "De la casa". Círculo de vino con borde irregular simulado, herradura en relieve y una rotación de −6°.

```css
.sello {
  --sello-size: 84px;
  width: var(--sello-size);
  height: var(--sello-size);
  display: grid;
  place-items: center;
  transform: rotate(-6deg);
  color: color-mix(in oklab, var(--c-hueso-100) 85%, var(--c-vino-600));
  background:
    radial-gradient(circle at 34% 30%, rgba(246, 239, 227, 0.22) 0%, transparent 46%),
    radial-gradient(circle at 50% 50%, #94382f 0%, #7b2d26 62%, #58201b 100%);
  /* Borde irregular: 8 radios distintos = lacre derramado */
  border-radius: 48% 52% 46% 54% / 53% 47% 53% 47%;
  box-shadow:
    inset 0 2px 4px rgba(246, 239, 227, 0.18),
    inset 0 -3px 6px rgba(14, 11, 8, 0.55),
    0 4px 10px -2px rgba(14, 11, 8, 0.75);
}
```

Uso restringido: **una aparición por pantalla**. Es el gesto más fuerte del sistema.

---

## 8. Presupuesto de la textura

| Recurso | Peso | Cuenta contra |
|---|---|---|
`wood-grain-256.avif` | ~8 KB | Imágenes |
`wood-grain-256.webp` (fallback) | ~11 KB | Solo se descarga en navegadores sin AVIF |
| Grano de película (data URI en CSS) | ~1.6 KB | CSS |
| `wordmark.svg` (logo horneado) | ~10 KB | Imágenes, inlineado |
| Iconos SVG (herradura, chili, hoja, copa) | ~2 KB | JS/HTML, inline |
| CSS de todas las texturas | ~5 KB gz | CSS |
| **Total de la capa decorativa** | **≈ 27 KB** | |

27 KB para toda la identidad visual. Menos que una sola foto de un plato. Ese es el punto medio que se pidió: diseño primero, sin pagarlo caro.

---

## 9. Lo que se evaluó y se descartó

| Idea | Por qué no |
|---|---|
| Foto real de madera de fondo | 120–250 KB, se estira mal entre 320 y 480 px, y el color no se puede tokenizar |
| `feTurbulence` en vivo sobre los títulos | 80–200 ms de pintado por título en Android medio. Inviable |
| Fotos de los platos | Multiplica el peso por 10 y una foto mediocre de una bandeja paisa hace más daño que no tener foto. Además obliga a sesión fotográfica antes de lanzar |
| `backdrop-filter: blur()` en la barra sticky | Cuesta 4–9 ms por frame en gama media, justo durante el scroll, que es el momento crítico. Se reemplaza por gradiente de madera semiopaco |
| Efecto de "madera que se mueve" con parallax al scroll | Rompe R5 (animación sutil), marea a quien lleva trago y cuesta repintados constantes |
| Cursor / hover personalizado | Es mobile-only. No hay cursor |
| Lottie para el letrero que se mece | 40 KB de runtime para lo que hacen 6 líneas de `@keyframes` |
