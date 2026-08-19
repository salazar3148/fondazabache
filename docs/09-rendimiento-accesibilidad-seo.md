# 09 · Rendimiento, Accesibilidad y SEO

## 1. Presupuesto de rendimiento

Cifras, no intenciones. Se verifican en CI y **un PR que las rompa no se fusiona**.

### 1.1 Peso

| Recurso | Presupuesto | **Medido** (`pnpm budget`) | Notas |
|---|---|---|---|
| HTML (gz) | ≤ 20 KB | **15.8 KB** ✅ | 46 productos + portada, pie y JSON-LD |
| CSS (gz) | ≤ 22 KB | **9.8 KB** ✅ | Tailwind purgado + módulos de textura |
| JS inicial (gz) | ≤ 90 KB | **173.5 KB** ❌ | Ver la nota de abajo |
| Fuentes | ≤ 115 KB | **95.2 KB** ✅ | 2 woff2 precargados; la itálica no se precarga |
| Imágenes above-the-fold | ≤ 40 KB | **0.6 KB** ✅ | Solo el tile de veta. No hay `wordmark.svg` todavía |
| **Payload inicial total** | **≤ 300 KB** | **294.9 KB** ⚠️ | Cabe, pero sin margen |
| JS diferido (bajo demanda) | ≤ 15 KB | **~10 KB** ✅ | `vaul` + sheet + Ruleta, verificado ausente del bundle inicial |

### El JS inicial: qué pasó y qué no

Los ~66 KB estimados originalmente eran **incorrectos**. Medido sobre el export
real: **173.5 KB gz en 7 chunks**. Lo que se descartó por medición, no por
intuición:

- **No es código nuestro.** Los tres componentes cliente (`CategoryNav`,
  `Reveal`, `CopyButton`) suman poco más de 2 KB. Añadir toda la Fase 5 (sheet
  sobre vaul + Ruleta del Azabache) subió el bundle inicial de 170.7 a 173.5 KB:
  2.8 KB. La carga diferida funciona.
- **No es `vaul` ni Radix filtrándose.** Se verificó buscando `DismissableLayer`,
  `FocusScope`, `react-remove-scroll` y `vaul` en los 7 chunks iniciales:
  ninguno aparece.
- **No es Turbopack.** Se compiló también con `next build --webpack`: 172.9 KB.
  Diferencia despreciable.

Es el **baseline de Next 16 App Router + React 19** en este proyecto. Bajarlo de
verdad implicaría cambiar de framework, y eso costaría más de lo que vale: la
carta ya llega pintada del servidor y funciona completa sin JavaScript, así que
esos 173 KB no bloquean la lectura — se descargan mientras el cliente ya está
leyendo. Lo que sí hay que hacer antes de dar el presupuesto por cerrado:

1. `pnpm analyze` con `@next/bundle-analyzer` para ver qué hay en los dos chunks
   grandes (223 KB y 173 KB en crudo).
2. Medir LCP real en un Moto G con 4G lento. **El número que manda es el LCP, no
   el peso del JS**, y con HTML pintado el JS no está en la ruta crítica del
   primer render.
3. Si el LCP cumple, subir formalmente el presupuesto de JS a lo que dé el
   baseline y dejar el tope en "baseline + 10 KB", que es lo único que de verdad
   protege contra la degradación semana a semana.

El margen de 90 KB que este documento prometía **no existe hoy**. Cualquier idea
de diseño que sume peso tiene que quitar peso de otro lado.

### 1.2 Métricas

| Métrica | Objetivo | Condición de medición |
|---|---|---|
| **LCP** | < 1.8 s | Moto G Power, 4G lento (1.6 Mbps, 150 ms RTT) |
| **CLS** | < 0.02 | Cero saltos. Todo con dimensiones reservadas |
| **INP** | < 120 ms | Toque en un chip y en una fila |
| **TBT** | < 150 ms | |
| **TTFB** | < 200 ms | CDN estático |
| Lighthouse Rendimiento (móvil) | ≥ 95 | |
| Lighthouse Accesibilidad | **100** | Sin excepciones |
| Lighthouse Buenas prácticas | 100 | |
| Lighthouse SEO | 100 | |

### 1.3 CI que lo hace cumplir

`lighthouserc.json`:

```jsonc
{
  "ci": {
    "collect": {
      "staticDistDir": "./out",
      "numberOfRuns": 3,
      "settings": { "preset": "desktop", "formFactor": "mobile", "screenEmulation": { "mobile": true } }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 1 }],
        "categories:best-practices": ["error", { "minScore": 1 }],
        "categories:seo": ["error", { "minScore": 1 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 1800 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.02 }],
        "total-byte-weight": ["error", { "maxNumericValue": 307200 }],
        "unused-javascript": ["warn", { "maxNumericValue": 20480 }],
        "uses-responsive-images": "off"
      }
    }
  }
}
```

---

## 2. Las siete palancas, en orden de impacto

Ordenadas por lo que realmente mueve la aguja. Si hay que priorizar, se empieza por arriba.

### 2.1 Export estático (impacto: enorme)

`output: 'export'` → HTML plano en CDN. Elimina cómputo de servidor del camino crítico. TTFB de 30–80 ms en vez de 300–800 ms. **Es la palanca más grande y es gratis.**

### 2.2 Server Components (impacto: enorme)

28 de los 33 componentes no envían un byte de JS. El contenido está en el HTML: se lee antes de que React hidrate. En una carta, hidratar es opcional para el objetivo principal del usuario.

### 2.3 Cero fotos de producto (impacto: enorme)

33 fotos, incluso bien optimizadas a 25 KB cada una, son **825 KB**. Cuatro veces el presupuesto completo. La decisión de no llevar fotos es, de lejos, la decisión de rendimiento más importante del proyecto — y además es la decisión de diseño correcta (ver [`03 §9`](./03-texturas-y-efectos.md#9-lo-que-se-evaluó-y-se-descartó)).

### 2.4 Texturas procedurales (impacto: alto)

27 KB para toda la identidad visual, en lugar de 200–400 KB de fotos de madera.

### 2.5 `content-visibility: auto` (impacto: alto)

```css
.section:not(.first) {
  content-visibility: auto;
  contain-intrinsic-size: auto 520px;
}
```

El navegador salta el layout y el pintado de las 5 secciones bajo el pliegue hasta que se acercan. Reduce el tiempo de layout inicial en ~30–40 % con un DOM de 26 filas.

**Cuidado obligatorio:** sin `contain-intrinsic-size`, la barra de scroll salta al hacer scroll. El valor (520 px) es la altura media medida de una sección de 5 productos. Se verifica en QA que el scroll no dé tirones.

### 2.6 Fuentes subseteadas y autohospedadas (impacto: medio-alto)

Sin conexión a un tercero, sin `preconnect`, sin salto de layout.

### 2.7 Sin librería de animación (impacto: medio)

~35 KB gz ahorrados frente a Framer Motion.

---

## 3. Detalles de implementación

### 3.1 Imágenes

- `wordmark.svg`: **inlineado en el HTML** (no como `<img>`). Elimina un request del camino crítico del LCP. Se importa como componente React con SVGR o se pega directo en el `Hero`. Coste: ~10 KB de HTML, pero cero latencia.
- `wood-grain-256.avif`: se declara con `image-set` y se **precarga**:

```html
<link rel="preload" as="image" href="/textures/wood-grain-256.avif" type="image/avif" fetchpriority="high" />
```

Es parte del primer paint: si llega tarde, el fondo aparece plano un instante.

- `og.jpg` (1200×630): **nunca se precarga**, no la ve el usuario.
- Con `output: 'export'`, `next/image` no optimiza: todo se optimiza en build con `sharp`/`squoosh` y se comitea. Son 3 archivos, no una pipeline.

### 3.2 CSS crítico

`experimental.optimizeCss: true` (Critters) inlinea el CSS del primer viewport y difiere el resto. Como el CSS total son ~16 KB, la ganancia es moderada, pero elimina un round-trip bloqueante. **Se mide antes y después:** si la diferencia es menor a 40 ms, se desactiva para reducir superficie experimental.

### 3.3 Fuentes

Subset con `fonttools`. Se ejecuta una vez y los `.woff2` se comitean (son binarios estables, no una dependencia de build).

```bash
# scripts/subset-fonts.sh
UNICODES="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,\
U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20A0-20BF,U+2122,U+2191,U+2193,U+2212,U+2215"

pyftsubset Fraunces[SOFT,WONK,opsz,wght].ttf \
  --unicodes="$UNICODES" \
  --layout-features="kern,liga,calt,onum,smcp,c2sc,tnum" \
  --variations="opsz=9:144,wght=400:700,SOFT=0:100,WONK=0:1" \
  --flavor=woff2 --output-file=public/fonts/Fraunces-Variable.woff2

pyftsubset InstrumentSans[wdth,wght].ttf \
  --unicodes="$UNICODES" \
  --layout-features="kern,liga,calt,tnum" \
  --variations="wght=400:700,wdth=100" \
  --flavor=woff2 --output-file=public/fonts/InstrumentSans-Variable.woff2
```

Puntos clave:
- `U+20A0-20BF` incluye el signo de peso. **Sin él, los precios se ven con fuente de respaldo.** Error clásico y muy visible.
- `tnum` es obligatorio: cifras tabulares para la columna de precios.
- `smcp,c2sc` solo en Fraunces, para las versalitas de los títulos.
- Recortar los rangos de los ejes variables (`--variations`) baja el peso ~35 % frente al archivo completo.
- `display: 'swap'` + `adjustFontFallback`: el texto se ve de inmediato con la fuente del sistema con métricas ajustadas, y el cambio no produce CLS medible.

### 3.4 Cabeceras de caché

| Ruta | Cabecera |
|---|---|
| `/index.html` | `Cache-Control: public, max-age=0, must-revalidate` |
| `/_next/static/*` | `Cache-Control: public, max-age=31536000, immutable` |
| `/fonts/*` | `Cache-Control: public, max-age=31536000, immutable` |
| `/textures/*` | `Cache-Control: public, max-age=31536000, immutable` |

El HTML **nunca** se cachea de forma persistente: es el archivo que contiene los precios. Todo lo demás, un año e inmutable.

### 3.5 Lo que está prohibido por rendimiento

| Prohibido | Razón |
|---|---|
| `background-attachment: fixed` | Jank severo en Safari iOS |
| `backdrop-filter` fuera del backdrop del sheet | 4–9 ms/frame en gama media, durante el scroll |
| `filter: url(#svg)` sobre elementos con contenido | Recalcula por frame |
| `feTurbulence` en runtime | 80–200 ms de pintado |
| Animar `width`, `height`, `top`, `left`, `margin` | Fuerza layout |
| `will-change` en más de un elemento | Capas de GPU innecesarias |
| Web fonts de Google Fonts vía CDN | Request a tercero + FOUT sin control |
| Cualquier script de terceros en el camino crítico | |

---

## 4. Accesibilidad

Objetivo: **WCAG 2.2 nivel AA**, y AAA en contraste de texto donde se logra sin pelear (que es en casi todo, gracias a la paleta).

> **Nota honesta:** un 100 de Lighthouse en accesibilidad no significa "accesible". Lighthouse detecta ~30 % de los problemas reales. La validación completa exige pruebas manuales con lector de pantalla y, para una certificación formal, revisión por un especialista. Lo que sigue es el máximo que se puede garantizar desde el código, más la lista de pruebas manuales que sí hay que hacer.

### 4.1 Contraste — tabla de verificación

| Combinación | Ratio | Nivel | Uso |
|---|---|---|---|
| `hueso-100` / `madera-900` | 16.5:1 | AAA | Texto sobre el fondo |
| `hueso-100` / `madera-800` | 15.7:1 | AAA | Texto en barra |
| `hueso-100` / `madera-700` | 14.1:1 | AAA | Nombres de producto en tarjeta |
| `hueso-300` / `madera-700` | 10.7:1 | AAA | Descripciones |
| `hueso-500` / `madera-700` | 5.7:1 | AA | Meta, notas |
| `candela-400` / `madera-700` | 5.2:1 | AA | **Precios** |
| `laton-300` / `madera-700` | 9.8:1 | AAA | Anillo de foco, filetes |
| `laton-500` / `madera-800` | 5.8:1 | AA | Subtítulos de sección |
| `hueso-100` / `vino-600` | 8.3:1 | AAA | Sello de lacre |
| `musgo-500` / `madera-700` | 5.1:1 | AA | Badge "sin alcohol" |

**Todo texto informativo supera 5:1.** El mínimo AA es 4.5:1 para texto normal; se dejó margen deliberado por la restricción R3 (poca luz + alcohol).

**Componentes no textuales** (WCAG 1.4.11, mínimo 3:1): bordes de tarjeta `madera-500`/`madera-900` = 2.1:1 ⚠️ — **es decorativo, no transmite información**, así que no aplica el criterio. Pero el borde del chip activo (`candela-400`/`madera-800` = 5.8:1) y el anillo de foco (9.8:1) sí lo cumplen sobradamente, y esos sí transmiten estado.

### 4.2 Estructura semántica

```html
<html lang="es-CO">
  <body>
    <a class="skip-link" href="#carta">Ir a la carta</a>
    <header>                        <!-- Hero -->
      <h1>Fonda Azabache</h1>       <!-- el wordmark SVG con su título accesible -->
      <p>…lema…</p>
    </header>
    <nav aria-label="Secciones de la carta">
      <ul><li><a href="#del-estante" aria-current="true">Del estante</a></li>…</ul>
    </nav>
    <main id="carta">
      <section id="del-estante" aria-labelledby="del-estante-titulo">
        <h2 id="del-estante-titulo">Del estante</h2>
        <p>Aguardientes y rones</p>
        <ul role="list">
          <li><h3>Aguardiente Antioqueño</h3><p>$100.000</p>…</li>
        </ul>
      </section>
      …
    </main>
    <footer>…</footer>
  </body>
</html>
```

- **Un solo `<h1>`**, en la portada. Es "Fonda Azabache".
- `h2` por sección, `h3` por producto. **Sin saltos de nivel.**
- `role="list"` explícito en los `<ul>` con `list-style: none`: Safari + VoiceOver pierden la semántica de lista sin él. Bug real, no teórico.
- `aria-labelledby` en cada `<section>`, no `aria-label`: reutiliza el texto visible en lugar de duplicarlo.
- El wordmark SVG lleva `<title>Fonda Azabache</title>` y `role="img"`, y el `<h1>` visualmente oculto lo respalda.

### 4.3 Checklist de verificación

Se ejecuta antes de cada release. Marcable.

**Automático (CI):**
- [ ] `eslint-plugin-jsx-a11y` en modo estricto, sin warnings suprimidos
- [ ] Lighthouse accesibilidad = 100
- [ ] `axe-core` vía Playwright, cero violaciones (incluye el sheet abierto)

**Manual — teclado (30 min):**
- [ ] Tab desde el inicio: skip link → CTA → chips → filas tocables → pie → herradura
- [ ] El orden de foco coincide con el orden visual
- [ ] El anillo de foco es visible sobre **todos** los fondos (incluida madera oscura y chip candela)
- [ ] `Enter` en un chip navega a la sección
- [ ] `Enter` en una fila abre el sheet; `Escape` lo cierra; el foco vuelve a la fila
- [ ] Con el sheet abierto, Tab no sale del panel
- [ ] Ningún elemento queda inalcanzable

**Manual — lector de pantalla (45 min):**
- [ ] **VoiceOver en iOS Safari** (el más usado por clientes reales)
  - [ ] Navegación por encabezados recorre las 6 secciones en orden
  - [ ] Cada producto se anuncia como "nombre, precio, descripción"
  - [ ] El sheet se anuncia como diálogo, con su título
  - [ ] El resultado de la Ruleta se anuncia una vez, no siete
  - [ ] El barajeo no se anuncia
  - [ ] "Hoy no hay" se anuncia en los agotados
- [ ] **TalkBack en Android Chrome**: mismos puntos

**Manual — visual y motor (20 min):**
- [ ] Zoom del navegador al 200 %: la carta sigue usable, sin pérdida de contenido
- [ ] Tamaño de fuente del sistema al máximo (Android "Enorme"): nada se corta ni se solapa
- [ ] `prefers-reduced-motion: reduce` activo: cero movimiento, todo funcional
- [ ] Modo de contraste alto de Android: el texto sigue legible
- [ ] Todos los targets ≥ 44×44 (se mide con la superposición de DevTools)
- [ ] Toda acción por gesto (arrastrar el sheet) tiene equivalente por botón

**Manual — simulación de daltonismo (10 min):**
- [ ] Deuteranopia: los badges se distinguen (llevan texto, así que sí)
- [ ] Protanopia: el chip activo se distingue del inactivo por más que el color (lo hace: borde + halo + peso)
- [ ] Escala de grises: la jerarquía completa sigue siendo legible ← **la prueba más útil de todas**

> La prueba en escala de grises es la que más problemas revela y la que menos tiempo toma. Si el diseño funciona en gris, funciona.

---

## 5. SEO y metadata

Una carta de QR no vive del SEO, pero sí se busca: *"fonda azabache carta"*, *"fonda azabache menú"*. Y sobre todo, tiene que verse bien cuando alguien la comparte por WhatsApp.

### 5.1 Metadata

Definida en `layout.tsx` (ver [`04 §5`](./04-arquitectura-tecnica.md#layouttsx-de-referencia)). Puntos que importan:

- `title`: `Fonda Azabache · Carta` — corto, con la marca primero.
- `description`: incluye el lema. Es lo que se lee en el resultado de búsqueda y en la vista previa de WhatsApp.
- `openGraph.images`: `og.jpg` de 1200×630. **Este archivo es más importante de lo que parece:** es lo que la gente ve cuando pasan el enlace por el grupo. Debe mostrar el wordmark quemado sobre la madera, con el lema. Se diseña con el mismo cariño que la portada.
- `locale: 'es_CO'` y `lang="es-CO"`.
- `themeColor: '#15100b'` → la barra del navegador queda en madera. Detalle pequeño, efecto grande de continuidad.

### 5.2 Datos estructurados

JSON-LD de tipo `Restaurant` + `Menu`. Aporta de verdad: habilita el panel de conocimiento de Google y la ficha con horarios.

```tsx
// src/components/layout/JsonLd.tsx  — RSC
const schema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Fonda Azabache',
  servesCuisine: ['Colombiana', 'Antioqueña', 'Paisa'],
  priceRange: '$$',
  address: { '@type': 'PostalAddress', addressLocality: 'Medellín', addressRegion: 'Antioquia', addressCountry: 'CO' },
  hasMenu: {
    '@type': 'Menu',
    hasMenuSection: menu.map((c) => ({
      '@type': 'MenuSection',
      name: `${c.titulo} — ${c.subtitulo}`,
      hasMenuItem: c.items.map((i) => ({
        '@type': 'MenuItem',
        name: i.nombre,
        description: i.descripcion,
        offers: { '@type': 'Offer', price: i.precio, priceCurrency: 'COP' },
      })),
    })),
  },
};
```

Se genera desde `menu`, así que **nunca se desactualiza**. Añade ~4 KB al HTML: aceptable, y se puede recortar si presiona el presupuesto.

### 5.3 El QR

El detalle que casi todo el mundo hace mal.

- **URL corta y legible:** `carta.fondaazabache.co`. Sin parámetros, sin `utm`, sin acortador de terceros. Menos caracteres = QR con menos módulos = **se escanea desde más lejos y con peor cámara**. Esto importa de verdad en una mesa con poca luz.
- **Corrección de errores nivel Q (25 %):** tolera un QR rayado, mojado o con una gota de aguardiente encima. Nivel L es más pequeño pero se vuelve inútil con el primer desgaste.
- **Generado en SVG vectorial** (`scripts/generate-qr.ts`, con `qrcode`), para imprimir a cualquier tamaño sin pixelar.
- **Impresión: 3 cm mínimo de lado**, con `quiet zone` de 4 módulos. Sobre madera clara o metal, nunca sobre negro.
- **Personalización:** se puede poner la herradura en el centro (hasta ~8 % del área, que el nivel Q absorbe sin problema). **No se cambia el color de los módulos**: negro sobre claro. Un QR "bonito" en café sobre madera es un QR que no escanea a la primera, y eso arruina toda la experiencia antes de que empiece.
- **Se prueba en 5 teléfonos reales**, incluido uno de gama baja, y a 40 cm de distancia con luz tenue. Es la prueba que decide si todo este trabajo se ve o no.

### 5.4 `robots.txt` y sitemap

```
User-agent: *
Allow: /
Sitemap: https://carta.fondaazabache.co/sitemap.xml
```

Una sola URL en el sitemap. `app/sitemap.ts` de Next lo genera en build.
