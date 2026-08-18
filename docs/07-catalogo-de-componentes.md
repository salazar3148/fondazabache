# 07 · Catálogo de Componentes

Contrato de cada componente: props, estados, HTML semántico y si es servidor o cliente. Si un componente no está aquí, no se construye sin antes agregarlo.

Leyenda: **RSC** = Server Component (0 KB de JS) · **CLI** = Client Component

---

## 1. Índice

| Componente | Tipo | Nivel |
|---|---|---|
[`Button`](#21-button) | RSC | primitive |
[`Chip`](#22-chip) | RSC | primitive |
[`Badge`](#23-badge) | RSC | primitive |
[`Sheet`](#24-sheet) | **CLI** | primitive |
[`VisuallyHidden`](#25-visuallyhidden) | RSC | primitive |
[`WoodBackdrop`](#31-woodbackdrop) | RSC | decor |
[`FilmGrain`](#32-filmgrain) | RSC | decor |
[`BurntTitle`](#33-burnttitle) | RSC | decor |
[`PlankFrame`](#34-plankframe) | RSC | decor |
[`HorseshoeRule`](#35-horseshoerule) | RSC | decor |
[`Sello`](#36-sello) | RSC | decor |
[`Hero`](#41-hero) | RSC | layout |
[`CategoryNav`](#42-categorynav) | **CLI** | layout |
[`Reveal`](#43-reveal) | **CLI** | layout |
[`Footer`](#44-footer) | RSC | layout |
[`CategorySection`](#51-categorysection) | RSC | menu |
[`MenuItemRow`](#52-menuitemrow) | RSC | menu |
[`PriceTag`](#53-pricetag) | RSC | menu |
[`ItemBadges`](#54-itembadges) | RSC | menu |
[`ItemSheet`](#55-itemsheet) | **CLI** lazy | menu |
[`RuletaArriero`](#61-ruletaarriero) | **CLI** lazy | features |
[`Cancionero`](#62-cancionero) | RSC | features |
[`InfoFonda`](#63-infofonda) | RSC | features |

**Total de componentes cliente: 5.** Presupuesto cumplido (ADR-002).

---

## 2. Primitives

### 2.1 `Button`

```ts
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'brass';
  size?: 'md' | 'lg';
  /** Si se pasa, renderiza <a> en vez de <button>. */
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}
```

| Variante | Uso | Aspecto |
|---|---|---|
| `primary` | CTA de portada | Fondo `candela-500` → `candela-400` en degradado, texto `azabache`, filete de latón interior |
| `ghost` | Cerrar sheet, secundarios | Transparente, borde `madera-400`, texto `hueso-300` |
| `brass` | Repetir ruleta | Borde de latón, texto `laton-300`, fondo `madera-800` |

**Estados:** reposo · `:active` (`scale(.97)` + `filter: brightness(1.08)`, `--d-instant`) · `:focus-visible` (anillo de latón, 2 px, offset 3) · `[disabled]` (`opacity: .45`, `pointer-events: none`).

**Altura:** `md` = 44 px, `lg` = 52 px. Ancho mínimo 120 px. Nunca menos de 44 de alto.

**Semántica:** con `href` → `<a>`. Sin `href` → `<button type="button">`. Nunca un `<div>` con `onClick`; ESLint lo bloquea.

### 2.2 `Chip`

Chip de la barra de categorías.

```ts
interface ChipProps {
  children: ReactNode;
  href: string;              // ancla: "#de-la-olla"
  active?: boolean;
  onSelect?: () => void;
}
```

- Es un **`<a href="#...">` real**, no un botón con `scrollIntoView`. Así funciona sin JS, se puede compartir el enlace y el navegador maneja el scroll suave con `scroll-padding-top`.
- `active` → `aria-current="true"`, fondo `candela-500` a 18 %, borde `candela-400`, texto con `.scorch`, y `--sh-ember` de halo.
- Inactivo → fondo `madera-700`, borde `madera-500`, texto `hueso-300`.
- 44 px de alto, `border-radius: var(--r-pill)`, padding `0 var(--sp-4)`, `white-space: nowrap`.
- Área táctil ampliada a 48 con `::after { inset: -2px }`.

### 2.3 `Badge`

```ts
interface BadgeProps {
  tag: ItemTag;
}
```

Mapa fijo, definido una sola vez:

| `tag` | Texto | Color | Icono |
|---|---|---|---|
| `casa` | DE LA CASA | fondo `vino-600`, texto `hueso-100` | — |
| `favorita` | LA FAVORITA | borde `laton-500`, texto `laton-300` | — |
| `picante` | PICANTE | texto `candela-400` | `Chili` |
| `sin-alcohol` | SIN ALCOHOL | texto `musgo-500` | `Leaf` |
| `compartir` | PARA COMPARTIR | texto `hueso-500` | — |
| `fuerte` | CARGADO | texto `candela-400` | — |
| `temporada` | DE TEMPORADA | texto `hueso-500` | — |

`--t-badge` (11 px), mayúsculas, `letter-spacing: .1em`, `border-radius: var(--r-sm)`, padding `3px 7px`. El icono es de 12 px, `aria-hidden`, y el texto lo acompaña siempre (nunca icono solo: sin texto es adivinanza).

### 2.4 `Sheet` — **CLI**

Wrapper delgado sobre `vaul`. Aísla la dependencia en un único archivo: si `vaul` se cambia por otra cosa, se toca aquí y nada más.

```ts
interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;              // obligatorio: es el nombre accesible del diálogo
  children: ReactNode;
}
```

Requisitos, todos obligatorios:

- Backdrop `rgba(14, 11, 8, .72)` + `backdrop-filter: blur(6px)`. **Este es el único lugar de la app donde se permite `backdrop-filter`**, porque es un overlay estático y no compite con el scroll.
- El panel es un `.plank` con `border-radius: var(--r-lg) var(--r-lg) 0 0` y `--sh-raised`.
- Asa de arrastre: barra de 36×4 px en `madera-400`, centrada, `margin-top: var(--sp-3)`.
- `padding-bottom: calc(var(--sp-6) + var(--safe-bottom))`.
- Entrada: `translateY(100%) → 0`, `--d-slow`, `--e-spring`. Salida: `--d-base`, `--e-out`.
- Cierre por: arrastre hacia abajo, toque en el backdrop, `Escape`, y **botón "Cerrar" visible**. Las cuatro vías. Alguien con dos aguardientes encima no va a descubrir un gesto.
- Foco atrapado dentro, y devuelto al disparador al cerrar (lo hace `vaul`, pero se verifica en QA).
- `aria-modal="true"`, `role="dialog"`, `aria-labelledby` apuntando al título.
- Bloqueo del scroll de fondo sin salto de posición.

### 2.5 `VisuallyHidden`

Texto para lector de pantalla. Técnica estándar de `clip-path`, no `display: none` ni `visibility: hidden` (que lo ocultan también al lector).

---

## 3. Decor

Todos son RSC, todos llevan `aria-hidden="true"` y `pointer-events: none`. Ninguno recibe props de dominio.

### 3.1 `WoodBackdrop`
Sin props. Se monta una vez en `layout.tsx`. Implementación completa en [`03 §2`](./03-texturas-y-efectos.md#2-el-fondo-de-madera).

### 3.2 `FilmGrain`
Sin props. Se monta una vez en `layout.tsx`, después de `WoodBackdrop`. Ver [`03 §6`](./03-texturas-y-efectos.md#6-grano-global).

### 3.3 `BurntTitle`

```ts
interface BurntTitleProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
  intensity?: 'hot' | 'warm' | 'scorch';
  id?: string;
  className?: string;
}
```

`as` es obligatorio en la práctica: el nivel de encabezado es semántica, no estilo. `h1` solo en la portada. Ver [`03 §4`](./03-texturas-y-efectos.md#4-letras-quemadas-el-efecto-firma).

### 3.4 `PlankFrame`

```ts
interface PlankFrameProps {
  children: ReactNode;
  /** Añade los 4 remaches de latón en las esquinas. */
  studs?: boolean;
  variant?: 'plank' | 'framed' | 'carved';
  as?: ElementType;
  className?: string;
}
```

`studs` solo se usa en la portada y en las cabeceras de sección. Ver [`03 §3`](./03-texturas-y-efectos.md#3-marcos-de-tabla-plank).

### 3.5 `HorseshoeRule`
Sin props. Separador entre bloques mayores. **Máximo 3 en toda la página.** Ver [`03 §5.3`](./03-texturas-y-efectos.md#53-separador-de-herradura).

### 3.6 `Sello`

```ts
interface SelloProps {
  children: ReactNode;         // texto corto, 2–4 palabras
  size?: 'sm' | 'md';          // 56px | 84px
}
```

**Una sola aparición por pantalla.** Ver [`03 §7`](./03-texturas-y-efectos.md#7-sello-de-lacre).

---

## 4. Layout

### 4.1 `Hero`

Sin props (lee de `site`). RSC. Es el LCP de la página.

```
┌──────────────────────────────────────┐
│                                      │  ← 100dvh menos la barra
│              ⌒⌒⌒⌒⌒                    │     letrero colgado (2 cadenas SVG)
│         ╔══════════════╗             │
│      ●  ║ FONDA        ║  ●          │     wordmark.svg, quemado horneado
│         ║   AZABACHE   ║             │     remaches de latón en esquinas
│      ●  ╚══════════════╝  ●          │
│                                      │
│         Aquí se bebe bueno,          │     .burnt .hot, tres líneas
│           se canta duro              │     la 3.ª en itálica
│         y se sufre bonito.           │
│                                      │
│   Trago derecho, cerveza bien fría   │     bajada, hueso-300, --t-body
│   y música de la que duele.          │
│                                      │
│        ┌──────────────────┐          │
│        │   Ver la carta   │          │     Button primary lg, href="#carta"
│        └──────────────────┘          │
│                 ⌄                    │     chevron sutil, opacity .5
└──────────────────────────────────────┘
```

Detalles:

- **Altura:** `min-height: 100dvh` menos la barra. `dvh`, no `vh`, para que la barra de Safari no rompa el encuadre.
- El wordmark es `<Image priority>` sobre `wordmark.svg`, con `width`/`height` explícitos. Nada de lazy: es el LCP.
- **La única animación decorativa continua de la app:** el letrero se mece. `transform-origin: top center`, ±0.5°, 7 s, `--e-inout`, `alternate`, `infinite`. **Se detiene cuando sale del viewport** (`animation-play-state: paused` vía IntersectionObserver, o `content-visibility`) y con `prefers-reduced-motion`.
- El lema NO se anima al entrar: ya está visible al cargar; animarlo retrasaría el LCP.
- El chevron inferior es decorativo. El CTA es el que lleva.

### 4.2 `CategoryNav` — **CLI**

```ts
interface CategoryNavProps {
  categorias: Array<Pick<MenuCategory, 'id' | 'chip'>>;
}
```

```
┌──────────────────────────────────────┐
│ [Pa' picar] [De la olla] [Del est… → │  sticky top, scroll horizontal
└──────────────────────────────────────┘
```

Especificación:

- `position: sticky; top: 0; z-index: var(--z-sticky)`.
- Alto `var(--nav-h)` = **56 px** + `var(--safe-top)` de padding superior.
- Fondo: **degradado de madera semiopaco, sin blur** (ADR: el blur cuesta 4–9 ms por frame justo durante el scroll). `linear-gradient(180deg, color-mix(in oklab, var(--c-madera-800) 96%, transparent), color-mix(in oklab, var(--c-madera-900) 92%, transparent))` + `border-bottom` de junta + `--sh-raised` que solo aparece cuando `scrollY > 8`.
- Scroll horizontal: `overflow-x: auto`, `scroll-snap-type: x proximity`, `scrollbar-width: none`, `-webkit-overflow-scrolling: touch`. **Sin barra de scroll visible**, pero con **degradado de desvanecido de 24 px en el borde derecho** (`mask-image`) que grita "hay más a la derecha". Y el 4.º chip queda cortado a propósito: es el afordance más honesto que existe.
- Detección de sección activa con `useActiveSection` (ver §7.1).
- Cuando cambia el chip activo, se hace `scrollIntoView({ inline: 'center', behavior: 'smooth' })` **solo sobre el contenedor horizontal**, nunca sobre la página. Bug clásico: mover el scroll vertical al centrar un chip. Se usa `scrollTo` calculado a mano en el contenedor para evitarlo.
- Semántica: `<nav aria-label="Secciones de la carta">` → `<ul>` → `<li>` → `Chip`.

### 4.3 `Reveal` — **CLI**

```ts
interface RevealProps {
  children: ReactNode;
  /** Retardo en ms. Máximo 120. */
  delay?: number;
}
```

- `IntersectionObserver` con `threshold: 0.1`, `rootMargin: '0px 0px -8% 0px'`.
- Anima **una sola vez** (se desconecta el observador) `opacity 0→1` + `translateY(10px→0)`, `--d-reveal`, `--e-out`.
- **Solo se aplica a las cabeceras de sección**, nunca a las 33 filas de productos. Animar 33 elementos al hacer scroll es exactamente el abuso de animación que se pidió evitar, y además cuesta.
- Con `prefers-reduced-motion`: renderiza sin observador ni transición.
- El primer bloque visible al cargar **no** lleva `Reveal`.
- Un solo observador compartido por instancia; el hook usa un `WeakMap` para no crear 7 observadores.

### 4.4 `Footer`

RSC. Contiene: `InfoFonda`, `Cancionero`, la copla de cierre, la marca de agua del caballo (6 % de opacidad), redes, y los avisos legales.

```
┌──────────────────────────────────────┐
│         ═══ ⌒ ═══                    │  HorseshoeRule
│                                      │
│  "Al que le sirvan poco, que         │  copla, Fraunces itálica
│   reclame. Al que le duela el         │
│   pecho, que cante."                  │
│                                      │
│  ── Info de la fonda ──              │  InfoFonda
│  ── Cancionero (colapsado) ──        │  <details>
│                                      │
│  [Instagram]  [WhatsApp]  [Mapa]     │  3 botones ghost, 48px
│                                      │
│  La propina es voluntaria…            │  --t-meta, hueso-500
│  Precios en pesos colombianos…        │
│  El exceso de alcohol…  Ley 30/1986   │  legal, obligatorio
│                                      │
│       [silueta de caballo, 6%]       │
└──────────────────────────────────────┘
```

`padding-bottom: calc(var(--sp-16) + var(--safe-bottom) + 72px)` — los 72 px extra dejan aire para que el botón flotante de la Ruleta no tape los avisos legales.

---

## 5. Menu

### 5.1 `CategorySection`

```ts
interface CategorySectionProps {
  categoria: MenuCategory;
  /** true para la primera sección: no lleva Reveal ni content-visibility. */
  first?: boolean;
}
```

```
┌──────────────────────────────────────┐
│  ●                              ●    │
│         D E   L A   O L L A          │  BurntTitle warm, h2, centrado
│           PLATOS FUERTES             │  subtítulo, --t-subtitle, laton-500
│  ●        ─── ⌒ ───             ●    │  filete de latón corto
│                                      │
│  Cocina lenta. La bandeja se         │  nota, --t-meta, itálica
│  demora quince minutos.              │
├──────────────────────────────────────┤
│  MenuItemRow ×5                      │
└──────────────────────────────────────┘
```

- `<section id={categoria.id} aria-labelledby={`${categoria.id}-titulo`}>`.
- La cabecera va en un `PlankFrame variant="framed" studs`.
- Los productos van en un `<ul>`; cada uno es un `<li>`.
- **`content-visibility: auto` + `contain-intrinsic-size: auto 520px`** en todas las secciones salvo la primera. Ahorra ~35 % del tiempo de layout inicial. El `contain-intrinsic-size` estimado evita que la barra de scroll dé saltos.
- `scroll-margin-top: calc(var(--nav-h) + var(--safe-top) + var(--sp-4))` para que el ancla no quede debajo de la barra sticky.

### 5.2 `MenuItemRow`

```ts
interface MenuItemRowProps {
  item: MenuItem;
  destacado?: boolean;      // resultado de la Ruleta
  className?: string;
}
```

```
┌──────────────────────────────────────┐
│  Aguardiente Antioqueño   $100.000   │  nombre --t-item hueso-100
│                                      │  precio --t-price candela-400 tabular
│  El de siempre. Con hielo y limón.   │  descripción --t-body hueso-300
│                                      │
│  Media · 375 ml  [LA FAVORITA] ⌄ leer│  badges + afordance de relato
└──────────────────────────────────────┘
     ↑ junta de tablón como separador
```

Reglas de layout:

- Fila superior en `display: flex; justify-content: space-between; align-items: baseline; gap: var(--sp-3)`. **Alineación por `baseline`**, no `center`: es lo que hace que el nombre y el precio se lean como una línea, y no como dos cosas puestas al lado.
- El nombre puede ocupar dos líneas; el precio nunca se parte (`white-space: nowrap; flex: none`).
- **No hay puntos de relleno entre nombre y precio.** Se consideró (es el clásico de las cartas de papel) y se descartó: en móvil, con nombres largos, se ve sucio y complica el `flex`. El espacio en blanco cumple mejor.
- Padding vertical `var(--sp-4)`, separador `.seam` entre filas (`:not(:last-child)`).
- Con `item.relato`: la fila entera es tocable (`ItemSheet` la envuelve en un `<button>`) y aparece la afordance "leer" en `--t-meta` con un chevron. Sin relato, la fila **no es tocable** — cero falsas promesas.
- `destacado`: borde `candela-400`, `--sh-ember`, y `background` con `candela-500` al 8 %.
- Agotado: `opacity: .55`, precio con `text-decoration: line-through` y `<span>` "Hoy no hay" en `--t-meta`. Sin `pointer-events: none` para que el lector de pantalla lo alcance; `aria-disabled="true"`.

### 5.3 `PriceTag`

```ts
interface PriceTagProps {
  valor: number;
  agotado?: boolean;
}
```

`<span>` con `formatCOP(valor)`, `font-variant-numeric: tabular-nums`, `--t-price`, `color: var(--c-candela-400)`, `font-family: var(--font-display)`.

Cuando `agotado`: color `hueso-500`, tachado, y un `VisuallyHidden` con "No disponible hoy".

### 5.4 `ItemBadges`

```ts
interface ItemBadgesProps {
  etiquetas?: ItemTag[];
}
```

Renderiza `null` si está vacío. Máximo 2 (garantizado por Zod). `<ul>` con `display: flex; gap: var(--sp-2)` y `role="list"` explícito (Safari lo pierde cuando `list-style: none`).

### 5.5 `ItemSheet` — **CLI, lazy**

```ts
interface ItemSheetProps {
  item: MenuItem;
  children: ReactNode;     // la fila, como disparador
  relacionados?: MenuItem[];
}
```

Solo se renderiza si `item.relato` existe. Carga:

```tsx
const ItemSheet = dynamic(() => import('./ItemSheet').then((m) => m.ItemSheet), {
  ssr: false,
  loading: () => null,
});
```

Contenido del sheet:

```
┌──────────────────────────────────────┐
│              ▬▬▬▬                    │  asa de arrastre
│                                      │
│  Aguardiente Antioqueño   $100.000   │  --t-display-lg / --t-price
│  [LA FAVORITA]                       │
│                                      │
│  El de siempre. Con hielo y limón.   │  descripción, hueso-300
│                                      │
│      ─── ⌒ ───                       │  filete de latón
│                                      │
│  "En la fonda no se pregunta 'cuál   │  relato, Fraunces itálica
│   aguardiente'. Se pregunta 'media   │  --t-copla, hueso-300
│   o botella'. Todo lo demás es       │
│   conversación."                     │
│                                      │
│  VA BIEN CON                         │  --t-subtitle, laton-500
│  · Pilsen              $100.000      │  relacionados, tocables
│  · Guaro sour          $100.000      │
│                                      │
│        [    Cerrar    ]              │  Button ghost lg
└──────────────────────────────────────┘
```

Los relacionados **navegan a su sección** (`href="#bien-fria"`) y cierran el sheet. No abren otro sheet: encadenar modales es un laberinto, y peor con trago.

---

## 6. Features

### 6.1 `RuletaArriero` — **CLI, lazy**

La idea que más valor aporta por byte invertido.

```ts
interface RuletaArrieroProps {
  items: ItemConCategoria[];
}
```

**Disparador:** botón flotante, `position: fixed`, `bottom: calc(var(--sp-4) + var(--safe-bottom))`, `right: var(--sp-4)`, 56 px de diámetro, `z-index: var(--z-fab)`. Fondo `madera-700` con borde de latón, icono de herradura en `laton-300`. **Solo aparece después de que el usuario pasa la portada** (`IntersectionObserver` sobre el Hero): en la primera pantalla estorbaría.

Texto accesible: `aria-label="Que la casa elija por usted"`. Etiqueta visible en un tooltip-chip que se muestra una sola vez, a los 3 s de aparecer, y se guarda en `sessionStorage` para no repetir.

**Flujo:**

1. Toque → abre `Sheet`.
2. **Fase de barajeo, 700 ms:** se muestran nombres de productos al azar cambiando cada 90 ms (7 cambios). Es un `setInterval` con `clearInterval`; barato y comunica "estoy eligiendo".
3. **Resultado:** el nombre se fija con un `scale(1.06) → 1` de 240 ms, aparece el `Sello` con "El azabache eligió" y un destello de brasa (`--sh-ember` que sube de 0 a 0.5 y baja, 400 ms).
4. Se muestra el producto completo: nombre, precio, descripción, categoría.
5. Dos acciones: **`Otra vez`** (variante `brass`) y **`Ver en la carta`** (`primary`, ancla a la sección + cierra el sheet + resalta la fila con `destacado`).
6. Vibración de 12 ms al fijar el resultado, vía `useHaptics`. Se omite si `prefers-reduced-motion` o si `navigator.vibrate` no existe.

**Reglas:**

- Nunca elige productos con `disponible: false`.
- No repite el resultado inmediatamente anterior (se guarda el `id` previo).
- El "barajeo" respeta `prefers-reduced-motion`: salta directo al resultado.
- La lógica vive en `hooks/useRandomItem.ts`, no en el componente. Es la única lógica de la app que merece un test unitario propio.

**Coste total: ~2 KB gz**, cargados solo al primer toque.

### 6.2 `Cancionero`

RSC. `<details>` nativo, colapsado por defecto.

```
▸ Cancionero de la casa            (8)
```

Al abrir: la lista de canciones con título en `hueso-100` y artista en `hueso-500`, separadas por `.seam`. Intro: "Pídala en la barra. Si está en la lista, suena."

`<details>` nativo porque: cero JS, accesible de fábrica, funciona con Ctrl+F del navegador (Chrome expande automáticamente los `<details>` al buscar dentro) y anima con `interpolate-size: allow-keywords` + `transition: height` donde esté soportado, degradando a un cambio instantáneo donde no. Se estiliza el `::marker` con un chevron de latón.

### 6.3 `InfoFonda`

RSC. Horarios (`<dl>` real: `<dt>` día, `<dd>` hora), dirección, teléfono y **clave del wifi**.

La clave del wifi merece atención especial porque es el dato más útil de todo el pie:

- Va en un `.carved` (hueco tallado), con la clave en `font-family: var(--font-display)`, tamaño `--t-item`, `letter-spacing: .05em` y clase `.selectable`.
- Un botón "Copiar" al lado, 44 px, que usa `navigator.clipboard.writeText` con feedback textual ("Copiada") durante 2 s.
- Si `navigator.clipboard` no existe, el botón no se renderiza y el texto sigue seleccionable. Degradación limpia.
- **Este es el único componente cliente que se añadiría a la lista** si se implementa el botón de copiar. Se acepta la excepción: son ~0.4 KB y el valor de uso real es alto. Se aísla en un `CopyButton` diminuto para que `InfoFonda` siga siendo RSC.

---

## 7. Hooks

### 7.1 `useActiveSection`

```ts
function useActiveSection(ids: readonly string[]): string | null;
```

- Un único `IntersectionObserver` para todas las secciones.
- `rootMargin: '-{navH + safeTop + 12}px 0px -55% 0px'` → la sección se considera activa cuando su parte alta cruza justo debajo de la barra. Ese `-55%` inferior es lo que evita el parpadeo entre dos secciones cuando ambas son visibles.
- Devuelve la **última** sección que entró, no la de mayor `intersectionRatio`: con secciones de altura muy distinta, el ratio da resultados contraintuitivos.
- Al llegar al final de la página, fuerza la última sección: si no, la última nunca se activa porque no alcanza a cruzar el umbral.
- Limpia el observador en el unmount.

### 7.2 `useReducedMotion`

```ts
function useReducedMotion(): boolean;
```

`matchMedia('(prefers-reduced-motion: reduce)')` con listener. Devuelve `true` en el primer render del servidor para evitar animar antes de saber (fail-safe hacia la opción accesible).

### 7.3 `useHaptics`

```ts
function useHaptics(): (ms?: number) => void;
```

Guarda contra `navigator.vibrate` ausente (iOS Safari no lo soporta) y contra `prefers-reduced-motion`. Nunca vibra más de 15 ms. Se usa **solo** en el resultado de la Ruleta.

### 7.4 `useRandomItem`

```ts
function useRandomItem(items: ItemConCategoria[]): {
  actual: ItemConCategoria | null;
  barajeando: boolean;
  girar: () => void;
};
```

Toda la lógica de la Ruleta. Testeable sin renderizar nada.

---

## 8. Estructura de `page.tsx`

Cómo queda todo montado:

```tsx
import { menu, todosLosItems } from '@/content/menu';
import { site } from '@/content/site';
// ...

export default function CartaPage() {
  const navItems = menu.map(({ id, chip }) => ({ id, chip }));

  return (
    <>
      <Hero />
      <CategoryNav categorias={navItems} />

      <main id="carta">
        {menu.map((categoria, i) => (
          <Fragment key={categoria.id}>
            {i === 1 && <HorseshoeRule />}
            <CategorySection categoria={categoria} first={i === 0} />
          </Fragment>
        ))}
      </main>

      <Footer />
      <RuletaArriero items={todosLosItems} />
    </>
  );
}
```

Un componente de página de ~25 líneas que solo compone. Toda la complejidad está distribuida y encapsulada. Eso es la señal de que la arquitectura está bien.
