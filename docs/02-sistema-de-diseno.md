# 02 · Sistema de Diseño

Todo lo que hay aquí se implementa como **variables CSS en `src/styles/tokens.css`** y se expone a Tailwind vía `@theme` en `src/styles/theme.css`. Ningún valor hexadecimal, tamaño o sombra se escribe suelto en un componente. Si un valor no está en este documento, no existe.

---

## 1. Fundamentos de escala

**Base de referencia:** viewport de **390 × 844** (iPhone 14/15, y el promedio del parque Android medio). Rango soportado: **320 px → 480 px**. Por encima de 520 px la carta se centra en una columna de 480 px con la madera extendiéndose a los lados.

**Unidad base:** `4px`. Todo espaciado es múltiplo de 4.

**Root font-size:** el navegador manda (`16px` por defecto). Todo en `rem`. **Prohibido** `maximum-scale=1` o `user-scalable=no`: la gente tiene que poder hacer zoom.

---

## 2. Paleta: *Azabache & Candela*

### 2.1 Neutros de madera (fondos y superficies)

| Token | Hex | Uso |
|---|---|---|
| `--c-azabache` | `#0E0B08` | Negro betún. Backdrop de modales, sombras profundas |
| `--c-madera-900` | `#15100B` | **Fondo base del documento** |
| `--c-madera-800` | `#1C1510` | Superficie de tabla base, barra de navegación |
| `--c-madera-700` | `#2A1F16` | **Superficie de tarjeta / plank elevado** |
| `--c-madera-600` | `#3A2A1D` | Borde de tabla, junta entre tablones |
| `--c-madera-500` | `#4E3826` | Divisores, veta clara, borde en reposo |
| `--c-madera-400` | `#6B4E36` | Borde activo/hover, filete interior |
| `--c-cuero-500` | `#8A5A32` | Cuero de montura. Fondos de chip inactivo intenso |
| `--c-tabaco-400` | `#A6703F` | Madera media. Detalles cálidos |

### 2.2 Texto (hueso)

| Token | Hex | Uso | Contraste sobre `madera-800` |
|---|---|---|---|
| `--c-hueso-100` | `#F6EFE3` | Texto principal, nombres de productos | **15.7 : 1** ✅ AAA |
| `--c-hueso-300` | `#DCCDB6` | Texto secundario, descripciones | **11.9 : 1** ✅ AAA |
| `--c-hueso-500` | `#A8977E` | Meta, unidades, notas al pie | **6.4 : 1** ✅ AA |

> `hueso-500` es el **límite inferior permitido** para texto. Nada más apagado que eso lleva información legible. Punto.

### 2.3 Acentos

| Token | Hex | Uso | Contraste sobre `madera-800` |
|---|---|---|---|
| `--c-candela-500` | `#C6551F` | Brasa profunda. Fondos de acento, borde de foco secundario | 3.8 : 1 — solo superficies |
| `--c-candela-400` | `#E0752F` | **Acento principal.** Precios destacados, chip activo, iconos de acción | **5.8 : 1** ✅ AA |
| `--c-candela-300` | `#F0975A` | Estado presionado, halo | 8.0 : 1 ✅ AAA |
| `--c-laton-500` | `#B08D57` | Herrajes, filetes, bordes decorativos | **5.8 : 1** ✅ AA |
| `--c-laton-300` | `#E3C77E` | **Anillo de foco**, brillo de remache, degradado de quemado | **10.9 : 1** ✅ AAA |
| `--c-vino-600` | `#7B2D26` | Sello de lacre, badge "De la casa" | Fondo (hueso-100 encima: **8.3 : 1** ✅) |
| `--c-musgo-500` | `#7E9B5E` | Badge "sin alcohol" | **5.1 : 1** sobre tarjeta ✅ AA |

### 2.4 Semánticos y de estado

| Token | Valor | Uso |
|---|---|---|
| `--c-fg` | `var(--c-hueso-100)` | Texto por defecto |
| `--c-fg-muted` | `var(--c-hueso-300)` | Texto secundario |
| `--c-fg-subtle` | `var(--c-hueso-500)` | Meta |
| `--c-bg` | `var(--c-madera-900)` | Fondo del documento |
| `--c-surface` | `var(--c-madera-800)` | Superficie nivel 1 |
| `--c-surface-raised` | `var(--c-madera-700)` | Superficie nivel 2 (tarjetas) |
| `--c-border` | `var(--c-madera-500)` | Borde por defecto |
| `--c-border-strong` | `var(--c-madera-400)` | Borde enfatizado |
| `--c-accent` | `var(--c-candela-400)` | Acento interactivo |
| `--c-focus` | `var(--c-laton-300)` | Anillo de foco (obligatorio y visible) |
| `--c-agotado` | `var(--c-hueso-500)` | Producto no disponible (+ `opacity: .55`) |

### 2.5 Reglas de uso del color

1. **Candela nunca es fondo de bloques grandes.** Es filete, texto de precio destacado, icono, chip activo. Un naranja de 300 px de alto mata la elegancia.
2. **Latón es decorativo; candela es interactivo.** Si algo se puede tocar, tiende a candela. Si es un herraje, es latón. La única excepción es el anillo de foco, que es latón-300 porque contrasta mejor sobre naranja.
3. **Máximo dos acentos visibles a la vez** en el viewport. Si hay un chip activo en candela y un precio destacado en candela, el sello de "De la casa" pasa a vino, no a naranja.
4. **Cero color puro.** No hay `#FFFFFF` ni `#000000` en todo el proyecto. El blanco es hueso, el negro es azabache. Regla verificada por lint (ver [`04`](./04-arquitectura-tecnica.md#6-calidad-de-código)).

---

## 3. Tipografía

### 3.1 Familias

| Rol | Familia | Por qué | Peso del archivo |
|---|---|---|---|
| **Display** | **Fraunces** Variable (`opsz`, `wght`, `SOFT`, `WONK`) + itálica | Serif cálida con retorno a los tipos de madera del s. XIX, pero de diseño contemporáneo. El eje `WONK` le da la irregularidad de un rótulo tallado sin caer en disfraz. Una sola familia cubre logotipo, títulos y precios | ~62 KB (subset latino, ejes recortados) |
| **Cuerpo / UI** | **Instrument Sans** Variable | Sans humanista-geométrica, aperturas amplias, excelente en tamaños pequeños y en español con tildes. Neutra pero tibia, no fría como Inter | ~34 KB |

**Total: ~96 KB en woff2.** Autohospedadas en `public/fonts/`, cargadas con `next/font/local`.

Configuración obligatoria:

```ts
// src/styles/fonts.ts
import localFont from 'next/font/local';

export const fraunces = localFont({
  src: [
    { path: '../../public/fonts/Fraunces-Variable.woff2', style: 'normal' },
    { path: '../../public/fonts/Fraunces-Italic-Variable.woff2', style: 'italic' },
  ],
  variable: '--font-display',
  display: 'swap',
  preload: true,                 // es LCP: sí precarga
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
});

export const instrument = localFont({
  src: '../../public/fonts/InstrumentSans-Variable.woff2',
  variable: '--font-body',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});
```

> **Subset obligatorio** con `pyftsubset`/`fonttools` a `latin + latin-ext` y recorte de ejes. Comando exacto en [`09`](./09-rendimiento-accesibilidad-seo.md#33-fuentes).

**Tercera familia (manuscrita): no.** Se evaluó y se descartó. El toque manuscrito se consigue con `Fraunces Italic` + `WONK 1`, que ya está pagada. Ahorro: ~30 KB y una petición.

### 3.2 Escala tipográfica

Escala de 1.25 (mayor tercera) ajustada a mano, con `clamp()` solo donde aporta. Los `line-height` van sin unidad.

| Token | Tamaño | LH | Tracking | Familia / peso | Uso |
|---|---|---|---|---|---|
| `--t-display-xl` | `clamp(2.75rem, 12vw, 3.5rem)` | `0.95` | `-0.01em` | Display 600, `WONK 1` | Wordmark de portada |
| `--t-display-lg` | `clamp(1.75rem, 7vw, 2.25rem)` | `1.05` | `0.02em` | Display 600 | Lema de portada |
| `--t-title` | `1.5rem` (24px) | `1.15` | `0.06em` | Display 600, versalitas | **Título de sección (quemado)** |
| `--t-subtitle` | `0.75rem` (12px) | `1.3` | `0.16em` | Body 500, mayúsculas | Subtítulo literal de sección |
| `--t-item` | `1.0625rem` (17px) | `1.3` | `0` | Body 600 | **Nombre de producto** |
| `--t-price` | `1.0625rem` (17px) | `1.2` | `0.01em` | Display 600, tabular | **Precio** |
| `--t-body` | `0.9375rem` (15px) | `1.5` | `0` | Body 400 | Descripción de producto |
| `--t-meta` | `0.8125rem` (13px) | `1.45` | `0.01em` | Body 400 | Unidad, tamaño, notas |
| `--t-badge` | `0.6875rem` (11px) | `1` | `0.1em` | Body 600, mayúsculas | Etiquetas |
| `--t-chip` | `0.875rem` (14px) | `1` | `0.03em` | Body 600 | Chips de navegación |
| `--t-copla` | `1.0625rem` (17px) | `1.45` | `0.01em` | Display 400 **itálica** | Coplas y separadores |

**Mínimo absoluto: 13 px** para cualquier texto informativo, y **11 px solo para badges de una o dos palabras en mayúsculas**. Restricción R3 (se lee con trago encima y poca luz).

### 3.3 Detalles finos

- **Precios con cifras tabulares:** `font-variant-numeric: tabular-nums;` para que la columna quede alineada. Obligatorio.
- **Versalitas reales:** `font-variant-caps: small-caps` en títulos de sección; si la fuente subseteada las pierde, se usa mayúsculas con `letter-spacing: 0.06em`.
- **Ligaduras discrecionales apagadas** en cuerpo: `font-variant-ligatures: no-discretionary-ligatures;`.
- **Balance de líneas:** `text-wrap: balance` en títulos y lema; `text-wrap: pretty` en descripciones. Soportado en todos los objetivos y degrada sin daño.
- **Guiones:** `hyphens: none`. En una carta, una palabra cortada se lee como error.

---

## 4. Espaciado

| Token | Valor | Uso típico |
|---|---|---|
| `--sp-1` | `4px` | Separación icono-texto |
| `--sp-2` | `8px` | Interno de badge |
| `--sp-3` | `12px` | Gap entre nombre y descripción |
| `--sp-4` | `16px` | **Padding horizontal del contenido (canónico)** |
| `--sp-5` | `20px` | Padding interno de tarjeta |
| `--sp-6` | `24px` | Gap entre productos |
| `--sp-8` | `32px` | Gap antes de un título de sección |
| `--sp-10` | `40px` | Separación entre secciones |
| `--sp-12` | `48px` | Respiro de bloque grande |
| `--sp-16` | `64px` | Aire de portada y pie |

**Gutter lateral canónico: `--sp-4` (16px).** Solo la madera y los separadores de herradura sangran a ancho completo.

**Safe areas iOS/Android — obligatorio:**

```css
:root {
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}
```
El pie y el botón de la ruleta suman `--safe-bottom`. La barra sticky suma `--safe-top`.

---

## 5. Radios, bordes y sombras

### 5.1 Radios

| Token | Valor | Uso |
|---|---|---|
| `--r-sm` | `8px` | Badges, chips pequeños |
| `--r-md` | `12px` | Tarjetas de producto |
| `--r-lg` | `18px` | Marcos de sección, bottom sheet (solo esquinas superiores) |
| `--r-pill` | `999px` | Chips de navegación, botones redondos |

La madera real no tiene esquinas redondas de 18 px, pero una tabla **cepillada y biselada** sí tiene el canto suavizado. Ese es el punto medio entre autenticidad y modernidad: radios generosos + bisel de luz en el borde superior.

### 5.2 Bordes

```css
--b-hairline: 1px solid var(--c-madera-600);   /* junta entre tablas */
--b-default:  1px solid var(--c-madera-500);   /* tarjeta en reposo   */
--b-strong:   1px solid var(--c-madera-400);   /* tarjeta enfatizada  */
--b-brass:    1px solid color-mix(in oklab, var(--c-laton-500) 55%, transparent);
```

### 5.3 Sombras — la clave del bisel de madera

La sensación de "tabla tallada" viene del par **luz arriba / sombra abajo** por dentro, más una sombra proyectada suave por fuera. Estas cuatro sombras son todo el sistema:

```css
/* Tabla en reposo: apoyada sobre la madera */
--sh-plank:
  inset 0 1px 0 rgba(246, 239, 227, 0.09),
  inset 0 -1px 0 rgba(14, 11, 8, 0.60),
  0 1px 1px rgba(14, 11, 8, 0.45),
  0 10px 22px -14px rgba(14, 11, 8, 0.85);

/* Tabla elevada: barra sticky, sheet */
--sh-raised:
  inset 0 1px 0 rgba(246, 239, 227, 0.11),
  0 2px 4px rgba(14, 11, 8, 0.50),
  0 18px 36px -18px rgba(14, 11, 8, 0.90);

/* Talla hacia dentro: campo de búsqueda, hueco de junta */
--sh-carved:
  inset 0 2px 4px rgba(14, 11, 8, 0.75),
  inset 0 -1px 0 rgba(246, 239, 227, 0.06);

/* Halo de brasa: solo detrás de texto quemado y del sello */
--sh-ember: 0 0 14px rgba(224, 117, 47, 0.22);
```

**Regla:** ninguna sombra usa negro puro; siempre `rgba` derivado de `--c-azabache` (`14, 11, 8`). Es lo que hace que la penumbra se vea cálida y no sucia.

---

## 6. Elevación (z-index)

Nombrados, no números sueltos.

| Token | Valor | Capa |
|---|---|---|
| `--z-backdrop-wood` | `0` | Fondo de madera (posición `fixed`, detrás de todo) |
| `--z-grain` | `1` | Grano global (`pointer-events: none`) |
| `--z-content` | `10` | Contenido |
| `--z-sticky` | `50` | Barra de categorías |
| `--z-fab` | `60` | Botón de la ruleta |
| `--z-overlay` | `100` | Backdrop del sheet |
| `--z-sheet` | `110` | Bottom sheet |

---

## 7. Motion

Cinco duraciones, tres curvas. Nada más.

```css
--d-instant: 90ms;   /* feedback de :active                     */
--d-fast:   160ms;   /* cambios de color y estado               */
--d-base:   240ms;   /* aparición de elementos                  */
--d-slow:   320ms;   /* bottom sheet                            */
--d-reveal: 420ms;   /* revelado de sección al entrar en vista  */

--e-out:    cubic-bezier(0.22, 0.61, 0.36, 1);    /* salidas y entradas normales */
--e-spring: cubic-bezier(0.22, 1.00, 0.36, 1);    /* sheet: overshoot mínimo     */
--e-inout:  cubic-bezier(0.45, 0.05, 0.55, 0.95); /* balanceo del letrero        */
```

**Propiedades animables permitidas: `transform`, `opacity`, `filter` y `color`.** Nada más. Cero animación de `height`, `top`, `width`, `box-shadow` o `background-position`.

**Regla de oro innegociable:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

Inventario completo de animaciones (son **seis** en toda la app) en [`08-ux-flujos-e-interacciones.md`](./08-ux-flujos-e-interacciones.md#8-inventario-de-animaciones).

---

## 8. Targets táctiles

| Elemento | Tamaño mínimo | Real |
|---|---|---|
| Cualquier control | **44 × 44** (WCAG 2.5.5 AA) | usamos **48 × 48** |
| Fila de producto tocable | 48 de alto | ~72–88 según contenido |
| Chip de navegación | 44 de alto | 44 (con área táctil de 48 por padding) |
| Botón de la ruleta | 48 | 56 de diámetro |
| Separación entre targets | 8 | 8–12 |

El área táctil se agranda con `padding`, no con `margin` negativo ni pseudo-elementos, salvo en los chips donde se usa `::after` a `-2px` para no romper el layout horizontal.

---

## 9. Apéndice: tema claro "Roble de Mediodía"

No es el tema por defecto. Se documenta para que la arquitectura de tokens lo soporte desde el día uno, sin refactor.

```css
[data-theme='dia'] {
  --c-bg:            #E8DCC8;   /* roble claro asoleado */
  --c-surface:       #F0E6D6;
  --c-surface-raised:#F7EFE2;
  --c-fg:            #241A11;   /* 13.2 : 1 sobre surface */
  --c-fg-muted:      #4A3729;
  --c-fg-subtle:     #6E5641;   /* 5.6 : 1 */
  --c-border:        #C9B79A;
  --c-border-strong: #A88F6C;
  --c-accent:        #9C3D11;   /* candela oscurecida para contraste sobre claro: 6.1 : 1 */
  --c-focus:         #7A4A12;
}
```

En tema claro, el efecto quemado **invierte la lógica**: relleno oscuro carbonizado con halo de brasa muy tenue por debajo, sin borde de stroke. Está resuelto en [`03`](./03-texturas-y-efectos.md#46-variante-de-tema-claro).

---

## 10. Implementación de los tokens

`src/styles/tokens.css` (extracto — el archivo completo se genera en la Fase 1 del roadmap):

```css
:root {
  color-scheme: dark;

  /* ── Color: madera ─────────────────────────────── */
  --c-azabache: #0e0b08;
  --c-madera-900: #15100b;
  --c-madera-800: #1c1510;
  --c-madera-700: #2a1f16;
  --c-madera-600: #3a2a1d;
  --c-madera-500: #4e3826;
  --c-madera-400: #6b4e36;
  --c-cuero-500: #8a5a32;
  --c-tabaco-400: #a6703f;

  /* ── Color: hueso ──────────────────────────────── */
  --c-hueso-100: #f6efe3;
  --c-hueso-300: #dccdb6;
  --c-hueso-500: #a8977e;

  /* ── Color: acentos ────────────────────────────── */
  --c-candela-500: #c6551f;
  --c-candela-400: #e0752f;
  --c-candela-300: #f0975a;
  --c-laton-500: #b08d57;
  --c-laton-300: #e3c77e;
  --c-vino-600: #7b2d26;
  --c-musgo-500: #7e9b5e;

  /* ── Semánticos ────────────────────────────────── */
  --c-bg: var(--c-madera-900);
  --c-surface: var(--c-madera-800);
  --c-surface-raised: var(--c-madera-700);
  --c-fg: var(--c-hueso-100);
  --c-fg-muted: var(--c-hueso-300);
  --c-fg-subtle: var(--c-hueso-500);
  --c-border: var(--c-madera-500);
  --c-border-strong: var(--c-madera-400);
  --c-accent: var(--c-candela-400);
  --c-focus: var(--c-laton-300);

  /* ── Sombra base para derivar rgba ─────────────── */
  --shadow-rgb: 14 11 8;
}
```

Y el puente a Tailwind v4 (`src/styles/theme.css`):

```css
@import 'tailwindcss';

@theme inline {
  --color-bg: var(--c-bg);
  --color-surface: var(--c-surface);
  --color-surface-raised: var(--c-surface-raised);
  --color-fg: var(--c-fg);
  --color-fg-muted: var(--c-fg-muted);
  --color-fg-subtle: var(--c-fg-subtle);
  --color-border: var(--c-border);
  --color-accent: var(--c-accent);
  --color-laton: var(--c-laton-500);
  --color-laton-bright: var(--c-laton-300);
  --color-vino: var(--c-vino-600);

  --font-display: var(--font-display), Georgia, serif;
  --font-body: var(--font-body), system-ui, sans-serif;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;

  --ease-out: cubic-bezier(0.22, 0.61, 0.36, 1);
  --ease-spring: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Con esto, `bg-surface-raised`, `text-fg-muted`, `font-display` y `rounded-md` funcionan en Tailwind y siguen apuntando a la única fuente de verdad.
