# 05 · Estructura de Carpetas y Convenciones

## 1. Árbol completo

```
fonda-azabache/
│
├── .github/
│   └── workflows/ci.yml
├── .husky/
│   ├── pre-commit
│   └── pre-push
├── docs/                              ← esta documentación viaja con el código
│
├── public/
│   ├── fonts/
│   │   ├── Fraunces-Variable.woff2            (~62 KB, subset latin)
│   │   ├── Fraunces-Italic-Variable.woff2     (~28 KB)
│   │   └── InstrumentSans-Variable.woff2      (~34 KB)
│   ├── textures/
│   │   ├── wood-grain-256.avif                (~8 KB)
│   │   └── wood-grain-256.webp                (fallback)
│   ├── brand/
│   │   ├── wordmark.svg                       (logo quemado horneado)
│   │   ├── og.jpg                             (1200×630, ~45 KB)
│   │   ├── icon.svg
│   │   └── apple-icon.png                     (180×180)
│   ├── manifest.webmanifest
│   └── robots.txt
│
├── scripts/
│   ├── validate-content.ts            ← corre en prebuild. Falla el build
│   ├── subset-fonts.sh                ← genera los woff2 subseteados
│   └── generate-qr.ts                 ← QR de mesa en SVG vectorial
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── not-found.tsx
│   │   └── globals.css
│   │
│   ├── styles/                        ← TODO el CSS global vive aquí
│   │   ├── fonts.ts                   ← next/font/local (es TS, pero es tipografía)
│   │   ├── tokens.css                 ← variables CSS. Única fuente de verdad
│   │   ├── theme.css                  ← @theme de Tailwind → puente a tokens
│   │   ├── base.css                   ← reset, tipografía base, focus, skip-link
│   │   ├── textures.css               ← .plank, .carved, .seam, .filmGrain, .brassRule
│   │   └── animations.css             ← los 6 @keyframes + prefers-reduced-motion
│   │
│   ├── components/
│   │   ├── primitives/                ← sin conocimiento del dominio
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.module.css
│   │   │   ├── Chip/
│   │   │   ├── Badge/
│   │   │   ├── Sheet/                 ← wrapper de vaul (client)
│   │   │   └── VisuallyHidden/
│   │   │
│   │   ├── decor/                     ← puramente visual, aria-hidden, 0 JS
│   │   │   ├── WoodBackdrop/
│   │   │   ├── FilmGrain/
│   │   │   ├── BurntTitle/
│   │   │   ├── PlankFrame/
│   │   │   ├── BrassStud/
│   │   │   ├── HorseshoeRule/
│   │   │   └── Sello/
│   │   │
│   │   ├── layout/
│   │   │   ├── Hero/                  ← portada: letrero colgado, lema, CTA
│   │   │   ├── CategoryNav/           ← client: barra sticky de chips
│   │   │   ├── Footer/                ← horario, dirección, wifi, redes, copla
│   │   │   └── Reveal/                ← client: IntersectionObserver de entrada
│   │   │
│   │   ├── menu/                      ← dominio: la carta
│   │   │   ├── CategorySection/
│   │   │   ├── MenuItemRow/
│   │   │   ├── PriceTag/
│   │   │   ├── ItemBadges/
│   │   │   └── ItemSheet/             ← client, lazy: detalle del producto
│   │   │
│   │   ├── features/                  ← funcionalidades con alma
│   │   │   ├── RuletaAzabache/         ← client, lazy
│   │   │   ├── Cancionero/
│   │   │   └── InfoFonda/
│   │   │
│   │   └── icons/                     ← un archivo por icono, RSC
│   │       ├── Horseshoe.tsx
│   │       ├── HorseHead.tsx
│   │       ├── Chili.tsx
│   │       ├── Leaf.tsx
│   │       ├── Share.tsx
│   │       ├── Wifi.tsx
│   │       ├── Clock.tsx
│   │       └── index.ts
│   │
│   ├── content/                       ← lo único que se toca cada semana
│   │   ├── site.ts                    ← nombre, lema, horarios, wifi, redes
│   │   ├── cancionero.ts
│   │   └── menu/                      ← solo licores y bebidas, sin comida
│   │       ├── index.ts               ← ordena y exporta las categorías
│   │       ├── aguardientes.ts
│   │       ├── cervezas.ts
│   │       ├── whisky-y-otros.ts
│   │       ├── de-la-casa.ts
│   │       ├── vinos-y-espumosos.ts
│   │       └── pa-la-sed.ts
│   │
│   ├── lib/
│   │   ├── schemas.ts                 ← Zod. Solo build y tests (ADR-005)
│   │   ├── format.ts                  ← formatCOP, formatVolumen
│   │   ├── cn.ts                      ← clsx reexportado
│   │   └── constants.ts               ← IDs de sección, alturas de barra
│   │
│   ├── hooks/
│   │   ├── useActiveSection.ts        ← IntersectionObserver → chip activo
│   │   ├── useReducedMotion.ts
│   │   ├── useHaptics.ts              ← navigator.vibrate con guardas
│   │   └── useRandomItem.ts           ← lógica de la Ruleta
│   │
│   └── types/
│       └── menu.ts                    ← tipos del dominio (sin Zod)
│
├── tests/
│   ├── unit/format.test.ts
│   ├── unit/content.test.ts
│   └── e2e/carta.spec.ts
│
├── .nvmrc · .prettierrc · .stylelintrc.json · eslint.config.mjs
├── next.config.ts · tsconfig.json · vitest.config.ts · playwright.config.ts
├── lighthouserc.json
└── package.json · pnpm-lock.yaml
```

---

## 2. Las cuatro reglas de la estructura

Estas reglas son las que mantienen el proyecto sano cuando lleve dos años cambiando.

### Regla 1 · Una carpeta por componente, colocalizada

```
Button/
├── Button.tsx           # el componente
├── Button.module.css    # sus estilos, si tiene
└── index.ts             # export { Button } from './Button';
```

Nada de un `styles/components/button.css` a diez carpetas de distancia. Si se borra el componente, se borra la carpeta y no queda CSS huérfano. Esto es lo que hace que la app siga limpia después de veinte iteraciones de diseño.

**`index.ts` es obligatorio** para que los imports queden `@/components/primitives/Button` y no `.../Button/Button`.

### Regla 2 · Cuatro niveles de componente, con dependencias en una sola dirección

```
icons  ←  primitives  ←  decor  ←  menu / layout / features  ←  app
```

| Nivel | Puede importar de | Conoce el dominio | Cliente permitido |
|---|---|---|---|
| `icons/` | nada | ❌ | ❌ |
| `primitives/` | `icons`, `lib` | ❌ | solo `Sheet` |
| `decor/` | `icons`, `lib` | ❌ | ❌ nunca |
| `menu/`, `layout/`, `features/` | todo lo anterior + `content`, `hooks`, `types` | ✅ | con justificación |
| `app/` | todo | ✅ | ❌ (las páginas son RSC) |

**Una flecha al revés es un error de arquitectura.** Si `Button` necesita saber qué es un producto, el diseño está mal. Se puede hacer cumplir con `eslint-plugin-boundaries`; mínimo, se revisa en el PR.

### Regla 3 · El contenido nunca importa componentes, y los componentes nunca escriben contenido

`src/content/` es datos puros: strings, números, booleanos, arreglos. Ni JSX, ni imports de React, ni funciones.

Al revés: **ningún componente contiene texto de negocio hardcodeado.** Ni "Fonda Azabache", ni "¿No sabe qué pedir?", ni un horario. Todo sale de `site.ts`. Se puede verificar con un grep en revisión.

Excepción única y explícita: etiquetas puramente estructurales de accesibilidad (`aria-label="Cerrar"`), que son parte del componente, no del negocio.

### Regla 4 · Cliente por excepción, y siempre en la hoja del árbol

Un `'use client'` se pone en el componente **más profundo** que lo necesite, nunca en un contenedor.

❌ Mal: `CategorySection` como cliente porque contiene una fila que abre un sheet → arrastra toda la sección al bundle.
✅ Bien: `CategorySection` es RSC, renderiza `MenuItemRow` (RSC) que renderiza un `<SheetTrigger>` cliente diminuto.

**Componentes cliente autorizados (lista cerrada, ampliar requiere ADR):**

1. `primitives/Sheet` — necesita estado y portal
2. `layout/CategoryNav` — `IntersectionObserver` + scroll
3. `layout/Reveal` — `IntersectionObserver`
4. `menu/ItemSheet` — abre el sheet
5. `features/RuletaAzabache` — `Math.random` + estado
6. `features/Cancionero` — solo si es colapsable; si no, RSC

---

## 3. Convenciones de nombres

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componente y su carpeta | `PascalCase` | `MenuItemRow/MenuItemRow.tsx` |
| Hook | `camelCase` con `use` | `useActiveSection.ts` |
| Utilidad / módulo `lib` | `camelCase` | `format.ts` |
| Archivo de contenido | `kebab-case`, en español | `de-la-casa.ts` |
| Tipo / interfaz | `PascalCase`, sin prefijo `I` | `MenuItem`, `MenuCategory` |
| Union de literales | `PascalCase` singular | `type ItemTag = 'picante' \| 'sin-alcohol'` |
| Token CSS | `--{grupo}-{nombre}-{escala}` | `--c-madera-700`, `--sp-4`, `--t-item` |
| Clase de CSS Module | `camelCase` | `.plankFramed`, `.studTL` |
| Clase global en `styles/` | `kebab-case` | `.skip-link`, `.film-grain` |
| `id` de sección (ancla) | `kebab-case`, en español, **estable** | `id="del-estante"` |
| `id` de producto | `kebab-case`, **inmutable** | `'coctel-azabache'` |
| Constante | `SCREAMING_SNAKE` | `NAV_HEIGHT_PX` |
| Booleano | `is` / `has` / `esta` | `isAgotado`, `hasStory` |

### Nombres en español o en inglés

**Convención mixta, deliberada y consistente:**

- **Código, tipos, props, hooks: inglés.** `MenuItem`, `isAgotado`... no: `isSoldOut`. Hmm. Regla precisa abajo.
- **Dominio y contenido: español.** `Picada`, `Aguardiente`, `Cancionero`, `Ruleta`, ids de sección, nombres de archivos de contenido.

Regla exacta para no dudar:

> Si el término existe en el vocabulario de la fonda, va en español (`plank` es una excepción histórica aceptada porque es CSS: se usa `plank`). Si es un término de programación, va en inglés.

Ejemplos resueltos: `MenuItemRow` (inglés, es UI), `CategoryNav` (inglés), `RuletaAzabache` (español, es un concepto de la marca), `Cancionero` (español), `item.disponible: boolean` (español, es dato de negocio), `isOpen` (inglés, es estado de UI).

---

## 4. Anatomía de un componente

Plantilla obligatoria. El orden de las secciones es siempre el mismo, para que cualquiera pueda escanear un archivo en dos segundos.

```tsx
// src/components/menu/MenuItemRow/MenuItemRow.tsx

// 1 · Imports: externos → internos absolutos → relativos → estilos
import type { MenuItem } from '@/types/menu';
import { formatCOP } from '@/lib/format';
import { cn } from '@/lib/cn';
import { ItemBadges } from '../ItemBadges';
import { PriceTag } from '../PriceTag';
import styles from './MenuItemRow.module.css';

// 2 · Props: interface exportada, una prop por línea, con comentario si no es obvia
export interface MenuItemRowProps {
  item: MenuItem;
  /** Resalta la fila. Se usa como resultado de la Ruleta del Azabache. */
  destacado?: boolean;
  className?: string;
}

// 3 · Componente: export nombrado. Nunca export default (salvo páginas de Next)
export function MenuItemRow({ item, destacado = false, className }: MenuItemRowProps) {
  const agotado = item.disponible === false;

  return (
    <li
      className={cn(styles.row, destacado && styles.destacado, agotado && styles.agotado, className)}
      aria-disabled={agotado || undefined}
    >
      <div className={styles.head}>
        <h3 className={styles.nombre}>{item.nombre}</h3>
        <PriceTag valor={item.precio} agotado={agotado} />
      </div>

      {item.descripcion && <p className={styles.descripcion}>{item.descripcion}</p>}

      {(item.etiquetas?.length || item.volumen) && (
        <div className={styles.meta}>
          {item.volumen && <span className={styles.volumen}>{item.volumen}</span>}
          <ItemBadges etiquetas={item.etiquetas} />
        </div>
      )}
    </li>
  );
}
```

**Prohibiciones a nivel de componente:**

- ❌ `export default` (excepto `page.tsx`, `layout.tsx`, `not-found.tsx`, que Next exige)
- ❌ `React.FC<Props>` — usa la firma de función directamente
- ❌ Más de **120 líneas**. Si crece, se divide. Sin excusas
- ❌ Estilos inline, salvo variables CSS calculadas (`style={{ '--delay': `${i * 40}ms` }}`)
- ❌ `useEffect` para derivar estado
- ❌ Lógica de negocio en el JSX. Se extrae arriba, en constantes con nombre

---

## 5. Orden de imports en `globals.css`

El orden importa: la cascada depende de él.

```css
/* src/app/globals.css */
@import '../styles/tokens.css';      /* 1. variables. Nada las usa todavía */
@import '../styles/theme.css';       /* 2. Tailwind + @theme (incluye el reset) */
@import '../styles/base.css';        /* 3. reset propio, tipografía base, focus  */
@import '../styles/textures.css';    /* 4. clases de textura reutilizables       */
@import '../styles/animations.css';  /* 5. keyframes + reduced-motion (al final) */
```

`animations.css` va último para que el bloque `@media (prefers-reduced-motion)` con `!important` gane a cualquier cosa.

---

## 6. `base.css` de referencia

Lo mínimo indispensable y nada más. Tailwind Preflight ya hace el reset básico.

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  /* Nadie selecciona texto en una carta; evita el menú contextual accidental
     al arrastrar. Se reactiva en los datos que sí se copian (wifi, dirección). */
  -webkit-tap-highlight-color: transparent;
}

html {
  /* El scroll suave lo maneja el navegador; se desactiva con reduced-motion */
  scroll-behavior: smooth;
  /* Compensa la altura de la barra sticky al saltar a un ancla */
  scroll-padding-top: calc(var(--nav-h) + var(--safe-top) + var(--sp-3));
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  min-height: 100dvh;                /* dvh, no vh: la barra de Safari se mueve */
  background-color: var(--c-bg);
  color: var(--c-fg);
  font-family: var(--font-body);
  font-size: var(--t-body);
  line-height: 1.5;
  font-synthesis-weight: none;
  text-rendering: optimizeLegibility;
  /* Sin scroll horizontal jamás */
  overflow-x: hidden;
}

h1, h2, h3, p, ul, ol, dl, figure {
  margin: 0;
}
ul, ol {
  padding: 0;
  list-style: none;
}

/* ── Foco: visible, de latón, y nunca eliminado ─────────── */
:focus-visible {
  outline: 2px solid var(--c-focus);
  outline-offset: 3px;
  border-radius: var(--r-sm);
}
:focus:not(:focus-visible) {
  outline: none;
}

/* ── Skip link ──────────────────────────────────────────── */
.skip-link {
  position: absolute;
  left: 50%;
  translate: -50% -200%;
  z-index: 200;
  padding: var(--sp-3) var(--sp-4);
  background: var(--c-surface-raised);
  color: var(--c-fg);
  border: 1px solid var(--c-laton-500);
  border-radius: var(--r-sm);
  transition: translate var(--d-fast) var(--e-out);
}
.skip-link:focus {
  translate: -50% var(--sp-3);
}

/* ── Texto seleccionable solo donde sirve ───────────────── */
.selectable {
  user-select: text;
  -webkit-user-select: text;
}

::selection {
  background: var(--c-candela-500);
  color: var(--c-hueso-100);
}
```

---

## 7. Cómo se hace el cambio más frecuente

Documentado explícitamente porque va a pasar cincuenta veces al año.

### Subir un precio

1. `git checkout -b content/precio-aguardiente`
2. Abrir `src/content/menu/aguardientes.ts`
3. Cambiar `precio: 58_000` → `precio: 62_000`
4. Commit: `content(menu): sube aguardiente media a 62.000`
5. Push. CI corre `content:check` + build. Verde → merge → deploy automático.

**Tiempo total: menos de dos minutos.** Ese es el objetivo de toda la arquitectura de contenido.

### Agregar un producto

Igual, pero el objeto nuevo necesita `id` único (el `content:check` falla si se duplica) y pasar el esquema Zod.

### Agregar una categoría nueva

1. Crear `src/content/menu/nueva-categoria.ts`
2. Registrarla en `src/content/menu/index.ts` en la posición deseada del arreglo
3. Listo: la barra de navegación, las anclas y la sección se generan solas

**Ningún componente se modifica.** Si hubiera que tocar un componente para agregar una categoría, la arquitectura estaría mal.

### Marcar algo como agotado

`disponible: false`. La fila se atenúa al 55 %, el precio se tacha y aparece "Hoy no hay". No se borra el producto: mantener el historial es útil y evita que el `id` se recicle.
