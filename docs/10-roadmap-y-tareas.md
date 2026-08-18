# 10 · Roadmap y Tareas

> **Nota de estado (verificada contra el código):**
>
> El proyecto vive en `app/` (Next.js 16.3.1, React 19.2.8, Tailwind 4.3.3, pnpm 10, `output: 'export'`). Estado real por fase:
>
> | Fase | Estado |
> |---|---|
> | 0 · Fundación | **Hecha.** Scaffolding, `next.config.ts`, `tsconfig` endurecido, ESLint flat + regla ADR-005, Stylelint con `color-no-hex`, Prettier, Husky (pre-commit / pre-push / commit-msg), commitlint, CI en `.github/workflows/ci.yml`. Repo git en la raíz del workspace, con `docs/` dentro. |
> | 1 · Sistema de diseño | **Hecha**, salvo la página `/__tokens` (se omitió: se validó contra la carta real). Fuentes autohospedadas vía `scripts/fetch-fonts.ps1`. |
> | 2 · Texturas | **Hecha** en código: `WoodBackdrop`, `FilmGrain`, `BurntTitle` (con su `@supports`), `PlankFrame` + remaches, `HorseshoeRule`, `Sello`, iconos. Falta la verificación en dispositivo real. El tile de veta es un SVG servido como archivo, precargado; pasarlo a AVIF sigue pendiente. |
> | 3 · Contenido y validación | **Hecha.** Catálogo real de `carta`: **6 secciones, 46 productos**, con los nombres tal cual la carta física. Esquema Zod + `scripts/validate-content.ts` con 4 invariantes, conectado a `prebuild`. Faltan los tests unitarios. |
> | 4 · La carta | **Hecha.** `Hero`, `CategoryNav` (sticky + sección activa + centrado manual del chip), `Reveal`, `CategorySection`, `MenuItemRow`, `PriceTag`, `ItemBadges`, `Footer`, `InfoFonda`, `Cancionero`, `CopyButton`, `JsonLd`, `not-found`. |
> | 5 · Sheet y Ruleta | **Hecha.** `Sheet` (vaul), `ItemSheetTrigger` + `ItemSheetContent` con carga diferida, `RuletaArriero` con FAB que aparece al pasar la portada, tooltip de primera vez en `sessionStorage`, barajeo de 7 pasos, `Sello`, destello de brasa, resaltado de 3 s al volver a la carta, `useRandomItem`, `useHaptics`. Verificado: nada de esto entra en el bundle inicial. |
> | 6 · Rendimiento y a11y | **Parcial.** Hechos: `pnpm budget`, metadata completa, `og.jpg`, `icon.svg`, `apple-icon.png`, manifest, `robots.txt`, `sitemap.xml`, JSON-LD, preload del tile. Pendientes: `pnpm analyze`, Lighthouse CI, axe, calibrar `contain-intrinsic-size`, medición en dispositivo real. |
> | 7 · QA y lanzamiento | **Parcial.** `netlify.toml` + `DEPLOY.md` listos. Faltan el QR, los tests E2E y el QA en dispositivos. |
>
> **Presupuesto medido** (`pnpm budget`, primera visita, gzip): HTML 15.8 KB · CSS 9.8 KB · fuentes 95.2 KB · texturas 0.6 KB · **JS 173.5 KB** · total **294.9 KB**. Cabe en los 300 KB, sin margen. El JS está al doble del tope de 90 KB y **no es código nuestro**: el análisis completo está en [`09 §1.1`](./09-rendimiento-accesibilidad-seo.md#11-peso).
>
> **Pendientes de negocio que bloquean el lanzamiento:** 9 precios sin confirmar (se muestran como "Pregunte"), los volúmenes exactos de cada presentación, y `wordmark.svg` — el wordmark de portada se compone hoy con la tipografía display y el mismo efecto quemado.

Ocho fases. Cada una tiene **tareas marcables** y un **criterio de aceptación verificable**. Se ejecutan en orden: cada fase depende de la anterior.

Estimación total para una persona: **5 a 7 días de trabajo enfocado.**

---

## Fase 0 · Fundación

**Objetivo:** proyecto que arranca, compila y exporta.

- [ ] `pnpm create next-app@latest fonda-azabache --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm`
- [ ] Fijar `next.config.ts` con `output: 'export'`, `trailingSlash`, `images.unoptimized` (ver [`04 §4`](./04-arquitectura-tecnica.md#nextconfigts))
- [ ] Endurecer `tsconfig.json`: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`
- [ ] `.nvmrc` con `20.11`, `engines` y `packageManager` en `package.json`
- [ ] Instalar dependencias con versiones exactas: `pnpm add -E clsx vaul` · `pnpm add -DE zod tsx stylelint stylelint-config-standard prettier prettier-plugin-tailwindcss husky lint-staged @commitlint/cli @commitlint/config-conventional`
- [ ] ESLint flat config: `next/core-web-vitals`, `jsx-a11y` estricto, la regla `no-restricted-imports` de Zod (ADR-005)
- [ ] `.stylelintrc.json` con `color-no-hex` y las excepciones documentadas
- [ ] Husky: pre-commit (`lint-staged`) y pre-push (`tsc --noEmit`)
- [ ] `commitlint` con los scopes del proyecto
- [ ] Crear el árbol de carpetas vacío de [`05 §1`](./05-estructura-y-convenciones.md#1-árbol-completo)
- [ ] `.github/workflows/ci.yml`
- [ ] Copiar `docs/` dentro del repo

**✅ Aceptación:** `pnpm build` genera `out/` sin errores ni warnings. `pnpm lint` limpio. Un commit con mensaje mal formado es rechazado por el hook.

---

## Fase 1 · Sistema de diseño

**Objetivo:** todos los tokens vivos y una página de prueba que los muestre.

- [ ] `src/styles/tokens.css` completo: colores, espaciado, tipografía, radios, sombras, z-index, motion, safe-areas
- [ ] `src/styles/theme.css` con el `@theme inline` de Tailwind
- [ ] `src/styles/base.css` (ver [`05 §6`](./05-estructura-y-convenciones.md#6-basecss-de-referencia))
- [ ] `src/styles/animations.css` con los 6 `@keyframes` + el bloque `prefers-reduced-motion`
- [ ] `globals.css` con los imports en el orden correcto
- [ ] Descargar Fraunces e Instrument Sans desde Google Fonts (repos oficiales, archivos `.ttf` variables)
- [ ] Ejecutar `scripts/subset-fonts.sh`. **Verificar que `U+20A0-20BF` está incluido** (el signo `$`)
- [ ] `src/styles/fonts.ts` con `next/font/local`
- [ ] `src/lib/format.ts` con `formatCOP` + su test
- [ ] `src/lib/cn.ts`, `src/lib/constants.ts` (`NAV_HEIGHT_PX = 56`)
- [ ] Página temporal `/__tokens` que renderiza toda la paleta, la escala tipográfica, las sombras y los radios

**✅ Aceptación:** en `/__tokens`, con DevTools, cada par de color de la tabla de [`09 §4.1`](./09-rendimiento-accesibilidad-seo.md#41-contraste--tabla-de-verificación) da el ratio documentado (±0.2). Los precios se renderizan con `$` en Fraunces y cifras alineadas. Comparar `/__tokens` con las fuentes desactivadas: el layout no salta.

---

## Fase 2 · Texturas y decor

**Objetivo:** la app se ve como una tabla de madera, sin contenido todavía.

- [ ] Generar `wood-grain-256.avif` (+ fallback `.webp`) con el SVG de [`03 §2.3`](./03-texturas-y-efectos.md#23-el-tile-de-veta-cómo-generarlo). **Verificar que hace tile sin costura visible**
- [ ] `decor/WoodBackdrop` con las 6 capas + la doble pasada de veta
- [ ] `decor/FilmGrain`
- [ ] `styles/textures.css`: `.plank`, `.plankFramed`, `.carved`, `.seam`, `.brassRule`
- [ ] `decor/PlankFrame` con variantes y `studs`
- [ ] `decor/BrassStud`
- [ ] `decor/BurntTitle` con las 3 intensidades **y el `@supports` de fallback**
- [ ] `decor/HorseshoeRule`
- [ ] `decor/Sello`
- [ ] `components/icons/`: `Horseshoe`, `HorseHead`, `Chili`, `Leaf`, `Wifi`, `Clock`, `Share`
- [ ] Montar `WoodBackdrop` y `FilmGrain` en `layout.tsx`
- [ ] Página `/__decor` con todos los elementos decorativos juntos

**✅ Aceptación:**
- El fondo se ve como madera, sin retícula perceptible al mirarlo de frente en un celular real (**probar en dispositivo, no en el emulador de DevTools** — la densidad de píxeles cambia todo).
- `BurntTitle` se ve como marca de hierro. Con `-webkit-text-stroke` desactivado en DevTools, el título sigue **legible**.
- El fondo no repinta al hacer scroll: verificado en el panel Layers de DevTools.
- FPS estable durante scroll rápido en un dispositivo de gama media.

---

## Fase 3 · Contenido y validación

**Objetivo:** la carta existe como datos tipados y validados.

- [ ] `src/types/menu.ts`
- [ ] `src/lib/schemas.ts` con Zod y todos los límites de [`06 §2`](./06-modelo-de-datos-y-contenido.md#2-validación-con-zod)
- [ ] Los 7 archivos de `src/content/menu/` con el mock completo de [`06 §4`](./06-modelo-de-datos-y-contenido.md#4-la-carta-mock-completo)
- [ ] `src/content/menu/index.ts` con `menu` y `todosLosItems`
- [ ] `src/content/site.ts` (incluyendo `avisos.alcohol`, obligatorio por ley)
- [ ] `src/content/cancionero.ts`
- [ ] `scripts/validate-content.ts` con las 4 invariantes: esquema, ids duplicados, tope de relatos, referencias de `vaBienCon`
- [ ] `prebuild` conectado en `package.json`
- [ ] `tests/unit/content.test.ts`

**✅ Aceptación:** `pnpm content:check` imprime `✔ Carta válida: 6 secciones, 26 productos.` Al introducir a propósito un id duplicado, un precio de `23_780` y un `vaBienCon` a un id inexistente, el script falla con los tres mensajes claros y `exit 1`.

---

## Fase 4 · La carta

**Objetivo:** la carta completa se ve y se navega. Es la fase que entrega el valor principal.

- [ ] `primitives/Button` con las 3 variantes
- [ ] `primitives/Chip`
- [ ] `primitives/Badge` con el mapa de las 7 etiquetas
- [ ] `primitives/VisuallyHidden`
- [ ] `menu/PriceTag`
- [ ] `menu/ItemBadges`
- [ ] `menu/MenuItemRow`
- [ ] `menu/CategorySection` con `content-visibility` y `scroll-margin-top`
- [ ] `layout/Hero`: wordmark SVG inlineado, letrero que se mece, lema quemado, CTA
- [ ] `hooks/useReducedMotion`
- [ ] `hooks/useActiveSection` con el `rootMargin` calculado
- [ ] `layout/CategoryNav` con centrado manual del chip (sin `scrollIntoView`)
- [ ] `layout/Reveal`
- [ ] `layout/Footer` + `features/InfoFonda` + `features/Cancionero` + `CopyButton`
- [ ] `layout/JsonLd`
- [ ] `app/page.tsx` (ver [`07 §8`](./07-catalogo-de-componentes.md#8-estructura-de-pagetsx))
- [ ] `app/not-found.tsx`
- [ ] Borrar `/__tokens` y `/__decor`

**✅ Aceptación:**
- La carta completa se lee de arriba abajo en un iPhone 14 y en un Android de gama media, sin scroll horizontal en ningún punto.
- Tocar cada uno de los 6 chips deja el título de la sección **completamente visible**, no tapado por la barra.
- Al hacer scroll, el chip activo cambia sin parpadeo y se centra en la barra sin mover el scroll vertical.
- **Con JavaScript desactivado, la carta es completamente legible y las anclas funcionan.**
- La clave del wifi se puede seleccionar y copiar.

---

## Fase 5 · Sheet y Ruleta

**Objetivo:** las interacciones que dan el "flow".

- [ ] `primitives/Sheet` sobre `vaul` con los 6 requisitos de [`07 §2.4`](./07-catalogo-de-componentes.md#24-sheet--cli)
- [ ] `menu/ItemSheet` con `next/dynamic({ ssr: false })`
- [ ] Conectar el sheet solo en las filas con `relato` (4 de 26)
- [ ] `hooks/useRandomItem` + `tests/unit/ruleta.test.ts`
- [ ] `hooks/useHaptics`
- [ ] `features/RuletaArriero`: botón flotante, aparición tras el hero, barajeo, sello, resultado, "Otra vez", "Ver en la carta"
- [ ] Resaltado temporal de 3 s en la fila al llegar desde la Ruleta
- [ ] Tooltip-chip de primera vez, con `sessionStorage`
- [ ] `aria-live="polite"` en el resultado, `aria-hidden` durante el barajeo

**✅ Aceptación:**
- El sheet se cierra por las 4 vías: arrastre, backdrop, `Escape`, botón.
- El foco vuelve exactamente al disparador.
- El scroll de fondo está bloqueado y al cerrar la página no salta.
- "Otra vez" 10 veces seguidas: nunca repite el inmediato anterior y nunca sale un agotado.
- "Ver en la carta" lleva a la sección correcta y la fila queda resaltada 3 s.
- Con `prefers-reduced-motion`: sin barajeo, sin destello, sin vibración, todo funcional.
- En el análisis de bundle, `vaul` está en un chunk aparte que **no** se descarga al cargar la página.

---

## Fase 6 · Rendimiento, accesibilidad y SEO

**Objetivo:** cumplir los números del presupuesto.

- [ ] `pnpm analyze` y confirmar el JS inicial ≤ 90 KB gz
- [ ] `<link rel="preload">` para el tile de veta
- [ ] Inlinear `wordmark.svg` en el `Hero`
- [ ] Calibrar `contain-intrinsic-size` midiendo la altura real de cada sección
- [ ] Metadata completa + `og.jpg` diseñada (1200×630, ≤ 60 KB)
- [ ] `icon.svg`, `apple-icon.png`, `manifest.webmanifest`, `robots.txt`, `app/sitemap.ts`
- [ ] Cabeceras de caché en el hosting
- [ ] `lighthouserc.json` y `pnpm lh` en verde
- [ ] `axe-core` vía Playwright, incluyendo el sheet abierto
- [ ] Recorrer el checklist manual de accesibilidad de [`09 §4.3`](./09-rendimiento-accesibilidad-seo.md#43-checklist-de-verificación) completo
- [ ] Medir en dispositivo real con throttling de 4G lento

**✅ Aceptación:** Lighthouse móvil ≥ 95 rendimiento y **100** en accesibilidad, buenas prácticas y SEO. LCP < 1.8 s y CLS < 0.02 en Moto G con 4G lento. Cero violaciones de `axe`. Checklist manual completo, incluida la prueba con VoiceOver en iOS.

---

## Fase 7 · QA y lanzamiento

- [ ] QA en dispositivos reales según [`11 §1`](./11-qa-checklist-y-deploy.md#1-matriz-de-dispositivos)
- [ ] `tests/e2e/carta.spec.ts`: smoke test móvil
- [ ] `scripts/generate-qr.ts` y generar el QR en SVG
- [ ] Imprimir el QR y **probarlo en 5 teléfonos, a 40 cm, con luz tenue**
- [ ] Deploy a producción
- [ ] Verificar la vista previa del enlace en WhatsApp, Instagram y iMessage
- [ ] Confirmar **con el negocio** los 33 precios, los horarios, la dirección y la clave del wifi
- [ ] Verificar que el aviso de Ley 30 de 1986 está visible

**✅ Aceptación:** el QR impreso escanea a la primera en los 5 teléfonos. La carta carga en menos de 2 s sobre los datos móviles del local. La vista previa en WhatsApp muestra el wordmark y el lema.

---

## Fase 8 · Evolución

Lo que se hará después, con lo que **ya está preparado** para que no sea un refactor.

| Mejora | Preparación existente | Esfuerzo |
|---|---|---|
| **CMS** (Sanity/Payload) | Los esquemas Zod son el contrato. Los componentes no se tocan ([`06 §7`](./06-modelo-de-datos-y-contenido.md#7-camino-a-un-cms)) | 2–3 días |
| **Tema claro** | Los tokens semánticos y el bloque `[data-theme='dia']` ya están escritos | 4 horas |
| **Inglés** | `site.ts` y `content/menu/` ya centralizan todo el texto. Falta el enrutado i18n | 1–2 días |
| **Carta de temporada** (diciembre) | La etiqueta `temporada` ya existe. Basta con una sección más | 2 horas |
| **Varias sedes** | Se pasa `menu` como prop en lugar de importarlo, y se generan rutas estáticas | 1 día |
| **Analítica** | Vercel Analytics o Umami, cargado de forma diferida | 2 horas |
| **Service worker** | Solo si se mide revisita real ([`08 §10`](./08-ux-flujos-e-interacciones.md#10-sobre-offline-y-pwa)) | 1 día |
| **Fotos de 3 botellas insignia** | Habría que añadir `imagen?` al tipo y renegociar el presupuesto de peso. Requiere equipo de fotografía, que hoy no existe | 1 día + sesión de fotos |

### Ideas evaluadas y aparcadas

| Idea | Veredicto |
|---|---|
| Pedir desde la carta | **No.** Requiere backend, integración con caja y personal capacitado. Rompe la relación con el mesero, que en una fonda es parte del producto |
| Buscador de productos | **No.** Con 26 productos en 6 secciones, la barra de chips es más rápida que escribir. Y en móvil abrir el teclado es un coste real |
| Calificar productos | **No.** Nadie califica una carta de papel. Sería un formulario sin dueño |
| Modo "fiesta" con colores cambiantes | **No.** Rompe R5 y la identidad |
| Filtros (sin alcohol, por tipo de licor) | **Quizá.** Cuando la carta pase de ~60 productos. Antes de eso, `Pa' la sed` ya es el filtro de "sin alcohol" |
| Historia de la fonda como sección aparte | **Quizá.** Los `relato` en los sheets ya cuentan la historia repartida, que se lee mejor que un bloque de texto que nadie abre |

---

## Ruta rápida

Si hay que mostrar algo funcionando en un día, en este orden:

1. **Fase 0** (1 h) → **Fase 1** (2 h) → **Fase 2** solo `WoodBackdrop` + `BurntTitle` (2 h)
2. **Fase 3** solo dos categorías (30 min)
3. **Fase 4** solo `Hero` + `CategorySection` + `MenuItemRow` (3 h)

En ~8 horas hay una demo que **ya transmite el diseño completo**. La Ruleta, el sheet y el pulido de rendimiento vienen después. El orden de las fases está pensado justamente para que el impacto visual llegue temprano y se pueda validar la dirección con el negocio antes de invertir en lo demás.
