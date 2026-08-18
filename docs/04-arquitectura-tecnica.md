# 04 · Arquitectura Técnica

## 1. Stack

Verificado contra las versiones estables de **agosto de 2026**.

| Capa | Herramienta | Versión | Rol |
|---|---|---|---|
| Framework | **Next.js** | `16.3.x` (LTS) | App Router + export estático |
| UI | **React** | `19.x` | Server Components por defecto |
| Lenguaje | **TypeScript** | `5.x` | `strict: true`, sin `any` |
| Estilos utilitarios | **Tailwind CSS** | `4.3.x` | Layout, espaciado, tipografía base |
| Estilos complejos | **CSS Modules** | nativo de Next | Texturas, quemado, herrajes |
| Bottom sheet | **vaul** | `1.x` | Drawer móvil con arrastre y scroll-lock |
| Validación de contenido | **Zod** | `4.x` | Solo en `prebuild` y tests. Cero runtime |
| Utilidad de clases | **clsx** | `2.x` | 0.5 KB |
| Lint | **ESLint** | `9.x` flat config | + `eslint-config-next`, `jsx-a11y` |
| Formato | **Prettier** | `3.x` | + `prettier-plugin-tailwindcss` |
| Tests unitarios | **Vitest** + Testing Library | `3.x` | Fase 6, no bloquea el lanzamiento |
| E2E / visual | **Playwright** | `1.5x` | Un smoke test móvil |
| Hooks de git | **Husky** + **lint-staged** | `9.x` / `16.x` | |
| Gestor de paquetes | **pnpm** | `10.x` | Lockfile determinista, comiteado |
| Node | | `>=20.11` | Fijado en `.nvmrc` y `engines` |

> **Regla de versionado:** se instala con `pnpm add -E` (versiones exactas, sin `^`). En una carta que cambia todas las semanas, un minor sorpresa de Tailwind rompiendo el degradado de un título es un problema real. Actualizaciones por PR explícito con Renovate/Dependabot en agrupación mensual.

**Comando de arranque:**

```bash
pnpm create next-app@latest fonda-azabache \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-pnpm
```

---

## 2. Diagrama de la aplicación

```
                        ┌──────────────────────────────┐
                        │  src/content/**  (TS tipado) │
                        │  menú, sitio, cancionero     │
                        └───────────┬──────────────────┘
                                    │ import estático
      prebuild ──► scripts/validate-content.ts (Zod) ──► falla el build si hay error
                                    │
                        ┌───────────▼──────────────────┐
                        │  app/page.tsx  (RSC)         │
                        │  arma todas las secciones    │
                        └───────────┬──────────────────┘
                                    │
        ┌───────────────────────────┼────────────────────────────┐
        │                           │                            │
  ┌─────▼──────┐          ┌─────────▼─────────┐        ┌─────────▼─────────┐
  │  decor/    │          │  menu/            │        │  features/        │
  │  RSC, 0 JS │          │  RSC + 2 clientes │        │  Client, dinámico │
  │  madera,   │          │  secciones, filas │        │  Ruleta, Sheet    │
  │  quemado   │          │  CategoryNav*     │        │  Cancionero       │
  └────────────┘          └───────────────────┘        └───────────────────┘
                                                          ▲
                    next/dynamic + ssr:false ─────────────┘
                    (no entra en el bundle inicial)

  ── build ──►  out/   HTML + CSS + ~2 chunks JS  ──►  CDN estático
```

**Presupuesto de JS por zona:**

| Zona | Cliente | Peso gz |
|---|---|---|
| `WoodBackdrop`, `BurntTitle`, `MenuItemRow`, `CategorySection`, `Hero`, `Footer` | ❌ RSC | 0 KB |
| `CategoryNav` (IntersectionObserver) | ✅ | ~1.5 KB |
| `ItemSheet` (vaul) | ✅ lazy | ~7 KB, tras la primera interacción |
| `RuletaArriero` | ✅ lazy | ~2 KB, tras la primera interacción |
| React + runtime de Next | | ~62 KB |
| **Total inicial** | | **≈ 66 KB gz** |

---

## 3. Decisiones de arquitectura (ADR)

Formato corto: contexto → decisión → consecuencia → alternativas descartadas.

### ADR-001 · Export estático (`output: 'export'`)

**Contexto.** La carta no tiene login, ni carrito, ni datos por usuario. Cambia por despliegue, no por request.

**Decisión.** `output: 'export'`. Se genera HTML plano en `out/` y se sirve desde CDN.

**Consecuencia.**
- TTFB de CDN puro (~30–80 ms). Es la palanca más grande de las que existen para R2.
- Se puede desplegar en Vercel, Cloudflare Pages, Netlify, S3+CloudFront o un hosting compartido. Cero lock-in.
- Funciona incluso si el backend de la fonda no existe.
- **Coste:** se pierden Route Handlers, ISR, `next/image` con optimización on-demand y middleware. Ninguno se necesita. Para imágenes se usa `images: { unoptimized: true }` y se optimizan a mano en build (son 2 archivos).

**Descartado:** SSR en Vercel (paga cold starts sin ganar nada), SSG con ISR (no hay CMS todavía).

### ADR-002 · Server Components por defecto, cliente por excepción

**Contexto.** El 95 % de la carta es contenido estático.

**Decisión.** Ningún componente lleva `'use client'` salvo que necesite estado, efectos o eventos. La lista de componentes cliente permitidos está cerrada en [`07`](./07-catalogo-de-componentes.md) y **añadir uno requiere justificación en el PR**.

**Consecuencia.** El HTML llega pintado; el JS solo hidrata dos islas pequeñas. LCP casi independiente de la red después del primer byte.

### ADR-003 · Tailwind para layout, CSS Modules para textura

**Contexto.** El requisito pedía explícitamente separación de CSS y reutilización. Tailwind resuelve consistencia de espaciado y velocidad; pero `box-shadow` de cuatro capas y `background-image` de cinco degradados escritos como clases arbitrarias (`shadow-[inset_0_1px_0_rgba(...)]`) son ilegibles e imposibles de revisar.

**Decisión.** Frontera explícita:

| Va en Tailwind | Va en CSS Module |
|---|---|
| `flex`, `grid`, `gap`, `p-*`, `m-*` | `background-image` con más de un stop |
| `text-fg`, `text-sm`, `font-body` | `box-shadow` con más de una capa |
| `rounded-md`, `border`, `truncate` | Cualquier `@keyframes` |
| Estados simples `active:`, `focus-visible:` | `mask-image`, `mix-blend-mode`, `filter` |
| Responsive (`min-[420px]:`) | `-webkit-text-stroke`, `background-clip: text` |

**Regla mecánica para no discutir:** si el valor arbitrario de Tailwind necesitaría más de 40 caracteres o un `_`, va a un CSS Module.

**Descartado:** CSS-in-JS (runtime, y Server Components lo penalizan), Sass (Tailwind v4 no está pensado para preprocesadores), Tailwind puro (ilegible para la textura), CSS puro (se pierde consistencia de escala).

### ADR-004 · Contenido en módulos TypeScript, no en CMS ni JSON

**Contexto.** La carta cambia semanalmente. Hoy no hay presupuesto ni necesidad de CMS.

**Decisión.** `src/content/menu/*.ts` exportando objetos tipados. Validados con Zod en `prebuild`.

**Consecuencia.**
- Autocompletado y errores de tipo al editar contenido. Un precio como string en vez de número no compila.
- Cero peso de runtime: el contenido se hornea en el HTML.
- Un cambio de precio es un PR de una línea, revisable, con historial en git. Auditable, que en precios importa.
- **Camino de migración a CMS ya trazado:** los esquemas Zod son el contrato. Cuando llegue Sanity/Contentful, se reemplaza el módulo por un `fetch` en build y el `parse` de Zod sigue igual. Los componentes no se tocan. Detallado en [`06`](./06-modelo-de-datos-y-contenido.md#7-camino-a-un-cms).

**Descartado:** JSON (sin tipos ni comentarios), Markdown/MDX (overkill para datos tabulares), Google Sheets (dependencia externa en build, frágil).

### ADR-005 · Zod solo en build, no en el bundle

**Contexto.** Zod pesa 12–14 KB gz. Validar en runtime no aporta nada si los datos son estáticos.

**Decisión.** Los esquemas viven en `src/lib/schemas.ts` y se importan **únicamente** desde `scripts/validate-content.ts` y desde los tests. Ningún componente ni módulo de `app/` importa Zod.

**Consecuencia.** Validación fuerte y bundle limpio. Se hace cumplir con una regla de ESLint:

```js
// eslint.config.mjs
{
  files: ['src/app/**', 'src/components/**'],
  rules: {
    'no-restricted-imports': ['error', {
      paths: [{ name: 'zod', message: 'Zod es solo para build/tests. Ver ADR-005.' }],
      patterns: ['@/lib/schemas'],
    }],
  },
}
```

### ADR-006 · `vaul` para el bottom sheet

**Contexto.** El detalle de producto se abre en un panel inferior. Hacerlo bien implica: arrastre para cerrar con inercia, bloqueo del scroll de fondo sin salto, foco atrapado, `aria-modal`, respeto de safe-area y comportamiento correcto del teclado en iOS. Hacerlo mal se siente inmediatamente barato.

**Decisión.** `vaul` (~7 KB gz), cargado con `next/dynamic({ ssr: false })`.

**Consecuencia.** Sensación nativa por 7 KB que solo se descargan si el usuario toca algo. Buen trato.

**Descartado:** `<dialog>` nativo + CSS (no da arrastre con inercia; el `::backdrop` y el scroll-lock en iOS Safari siguen siendo un dolor), Radix Dialog (más pesado y no está pensado para drawer móvil), implementación propia (2–3 días de trabajo para igualar 7 KB).

### ADR-007 · Sin librería de animación

**Contexto.** Son seis animaciones, todas de `transform` y `opacity`.

**Decisión.** `@keyframes` en `src/styles/animations.css` + `IntersectionObserver` en un hook propio para el revelado.

**Consecuencia.** ~35 KB gz de Framer Motion ahorrados. Si en el futuro se necesita animación con gestos, se entra con `LazyMotion` + `domAnimation` (~6 KB), no con el paquete completo.

### ADR-008 · Iconos como componentes React inline, sin librería

**Contexto.** Se necesitan ~8 iconos, de los cuales 3 son motivos propios (herradura, caballo, sello) que ninguna librería tiene.

**Decisión.** `src/components/icons/*.tsx`, un componente por icono, `viewBox="0 0 24 24"`, `stroke="currentColor"`, `fill="none"`, `aria-hidden` por defecto.

**Consecuencia.** Cero peticiones, cero dependencia, tree-shaking perfecto, control total del trazo (que en esta marca es parte del diseño). ~2 KB en total.

**Descartado:** `lucide-react` (bueno, pero no tiene los motivos propios y mezclar dos estilos de trazo se nota), sprite SVG externo (una petición extra que bloquea el render de los iconos).

### ADR-009 · Una sola ruta (`/`), navegación por anclas

**Contexto.** Son ~6 categorías con 3–5 productos cada una: ~26 filas de texto. El HTML completo pesa ~12 KB gz.

**Decisión.** Todo en `app/page.tsx`. Las categorías son `<section id="...">` y la navegación es scroll suave a anclas.

**Consecuencia.**
- Cero navegaciones, cero esperas, cero estados de carga después del primer paint.
- Funciona sin JS: los enlaces `href="#platos"` son anclas HTML reales.
- Buscar con Ctrl+F / "buscar en la página" del navegador encuentra todo.
- **Coste:** el DOM inicial es más grande. Se mitiga con `content-visibility: auto` en las secciones por debajo del pliegue.

**Descartado:** una ruta por categoría (introduce latencia donde no hace falta), pestañas con montaje condicional (rompe el scroll nativo y el buscador del navegador).

### ADR-010 · Tema oscuro fijo, sin selector

**Contexto.** Ver [`01`](./01-vision-y-marca.md#1-el-concepto-por-qué-azabache-resuelve-todo-el-diseño).

**Decisión.** `color-scheme: dark`, sin toggle, sin `prefers-color-scheme`. Pero **todos los colores pasan por tokens semánticos** y existe el bloque `[data-theme='dia']` documentado.

**Consecuencia.** Una sola combinación que probar y pulir al detalle. Si mañana se pide el tema claro, es una hoja de tokens y un `data-attribute`, no un refactor.

---

## 4. Configuración

### `next.config.ts`

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,        // rutas limpias en hostings estáticos
  images: {
    unoptimized: true,        // obligatorio con output: 'export'
  },
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
  experimental: {
    optimizeCss: true,        // critters: CSS crítico inline
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
```

### `tsconfig.json` — lo que no es negociable

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

`noUncheckedIndexedAccess` es el que más molesta y el que más bugs evita cuando se indexa el arreglo de categorías.

### `package.json` · scripts

```jsonc
{
  "scripts": {
    "dev": "next dev",
    "prebuild": "pnpm run content:check",
    "build": "next build",
    "start": "npx serve out",
    "lint": "next lint && tsc --noEmit",
    "format": "prettier --write .",
    "content:check": "tsx scripts/validate-content.ts",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "analyze": "ANALYZE=true next build",
    "lh": "lhci autorun"
  },
  "engines": { "node": ">=20.11" },
  "packageManager": "pnpm@10.0.0"
}
```

`prebuild` corre solo: si un precio está mal tipado o una categoría quedó vacía, **el build falla**. Es la red de seguridad para el flujo "cambio la carta el jueves a las 11 de la noche".

---

## 5. Estructura de `app/`

```
src/app/
├── layout.tsx          # <html lang="es-CO">, fuentes, WoodBackdrop, grano, metadata
├── page.tsx            # la carta completa (RSC)
├── not-found.tsx       # 404 con voz de marca: "Ese plato no está en la carta"
├── globals.css         # importa tokens, theme, base, textures, animations
└── icon.svg / apple-icon.png / manifest.webmanifest
```

### `layout.tsx` de referencia

```tsx
import type { Metadata, Viewport } from 'next';
import { fraunces, instrument } from '@/styles/fonts';
import { WoodBackdrop } from '@/components/decor/WoodBackdrop';
import { FilmGrain } from '@/components/decor/FilmGrain';
import { site } from '@/content/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: 'Fonda Azabache · Carta',
  description: 'Aquí se bebe bueno, se canta duro y se sufre bonito. Carta de la Fonda Azabache.',
  applicationName: 'Fonda Azabache',
  openGraph: {
    title: 'Fonda Azabache',
    description: 'Aquí se bebe bueno, se canta duro y se sufre bonito.',
    locale: 'es_CO',
    type: 'website',
    images: [{ url: '/brand/og.jpg', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // NO se fija maximumScale: el zoom es un derecho de accesibilidad
  themeColor: '#15100b',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${fraunces.variable} ${instrument.variable}`}>
      <body>
        <WoodBackdrop />
        <FilmGrain />
        <a href="#carta" className="skip-link">Ir a la carta</a>
        {children}
      </body>
    </html>
  );
}
```

---

## 6. Calidad de código

### ESLint · reglas propias del proyecto

```js
// eslint.config.mjs (extracto de lo específico de Fonda Azabache)
export default [
  // ...next/core-web-vitals, jsx-a11y strict, typescript-eslint recommended
  {
    files: ['src/**/*.{ts,tsx,css}'],
    rules: {
      // ADR-005: Zod no entra al bundle
      'no-restricted-imports': ['error', {
        paths: [{ name: 'zod', message: 'Zod es solo build/tests. ADR-005.' }],
      }],
      // Sin any
      '@typescript-eslint/no-explicit-any': 'error',
      // Accesibilidad en modo estricto: es una carta pública
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
    },
  },
];
```

### Regla anti-hexadecimales sueltos

Cero colores literales fuera de `tokens.css`. Se verifica con **Stylelint**:

```jsonc
// .stylelintrc.json
{
  "rules": {
    "color-no-hex": [true, {
      "message": "Usa un token de tokens.css (ver docs/02). Excepción: tokens.css y los degradados documentados en docs/03.",
      "ignoreFiles": ["src/styles/tokens.css", "**/BurntTitle.module.css", "**/WoodBackdrop.module.css", "**/Sello.module.css"]
    }],
    "declaration-property-value-no-unknown": true,
    "no-descending-specificity": null
  }
}
```

Los cuatro archivos exentos son los que implementan efectos físicos donde los stops del degradado son parte del efecto, no decisiones de marca reutilizables. Están documentados en [`03`](./03-texturas-y-efectos.md).

### Git

- **Conventional Commits** con `commitlint`. Scopes del proyecto: `carta`, `decor`, `menu`, `ruleta`, `content`, `perf`, `a11y`, `docs`, `chore`.
  - Ejemplo real: `content(menu): sube precio de aguardiente media a 62.000`
- **`lint-staged`** en pre-commit: `eslint --fix`, `stylelint --fix`, `prettier --write`, y `pnpm content:check` si cambió algo en `src/content/`.
- **Pre-push:** `tsc --noEmit`.
- **Ramas:** `main` protegida. `feat/*`, `fix/*`, `content/*`. El flujo de cambio de precios usa `content/*` y puede fusionarse sin revisión de código, pero **sí** con el check verde.

### CI (`.github/workflows/ci.yml`)

```yaml
name: CI
on: [pull_request, push]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm content:check       # 1. el contenido es válido
      - run: pnpm lint                # 2. tipos + lint
      - run: pnpm test                # 3. unitarios
      - run: pnpm build               # 4. compila
      - run: pnpm lh                  # 5. presupuestos de rendimiento
```

El paso 5 **falla el PR** si se rompe el presupuesto de [`09`](./09-rendimiento-accesibilidad-seo.md#1-presupuesto-de-rendimiento). Es la única forma de que un proyecto que cambia todas las semanas no se degrade poco a poco.
