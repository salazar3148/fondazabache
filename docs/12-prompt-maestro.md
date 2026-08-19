# 12 · Prompt Maestro

Dos versiones:

- **§1 · Prompt corto** — para cuando los docs `01`–`11` están disponibles en el workspace. Es el que conviene usar: delega el detalle en los documentos y no gasta contexto repitiéndolo.
- **§2 · Prompt autocontenido** — para arrancar en un workspace vacío, sin acceso a los otros documentos. Lleva toda la información esencial embebida.

---

## 1. Prompt corto (con `docs/` disponible)

> Copiar desde aquí:

```
Construye la carta digital de "Fonda Azabache": una web mobile-only para escanear
por QR en la mesa de una fonda antioqueña.

La documentación completa está en el folder `docs/`. Léela ANTES de escribir código,
en este orden: README, 01-vision-y-marca, 02-sistema-de-diseno, 03-texturas-y-efectos,
04-arquitectura-tecnica, 05-estructura-y-convenciones, 06-modelo-de-datos-y-contenido,
07-catalogo-de-componentes, 08-ux-flujos-e-interacciones, 09-rendimiento-accesibilidad-seo.

Ejecuta el roadmap de `docs/10-roadmap-y-tareas.md` en orden, fase por fase.
Al terminar cada fase, verifica su criterio de aceptación antes de continuar.

Reglas que no se negocian:
1. Los tokens de `docs/02` son la única fuente de color, tamaño y sombra.
   Ni un hexadecimal suelto fuera de tokens.css y los 4 archivos exentos.
2. Server Components por defecto. Máximo 5 componentes cliente, los listados en `docs/07`.
3. Seis animaciones en total, las del inventario de `docs/08 §8`. Todas respetan
   prefers-reduced-motion.
4. El presupuesto de `docs/09 §1` se cumple. Si una decisión lo rompe, avísame antes.
5. El efecto de letras quemadas de `docs/03 §4` lleva su fallback @supports.
   Que el texto nunca quede invisible.
6. Sin fotos de producto (decisión permanente, sin equipo para producirlas). Sin
   librería de animación. Sin librería de iconos.
7. Español de Colombia en todo el contenido. Usted, no tú.
8. Solo licores y bebidas: sin cocina, sin platos, sin postres.
9. Todos los precios del mock son $100.000 hasta que el negocio confirme la lista real.

Empieza por la Fase 0 y avísame cuando `pnpm build` genere `out/` limpio.
```

---

## 2. Prompt autocontenido

> Para usar sin acceso a los demás documentos. Copiar todo el bloque:

```
Construye una carta digital mobile-only para "Fonda Azabache", una fonda antioqueña
QUE SOLO VENDE LICORES Y BEBIDAS (sin cocina, sin comida, sin postres). Se accede
escaneando un QR en la mesa. Solo se ve en celular (360–430 px). Tiene que ser ligera
para datos móviles pobres Y visualmente excepcional: cuando alguien la vea, la
reacción esperada es "¿esto lo hizo una IA?". El diseño tiene prioridad sobre el
rendimiento, pero con presupuesto estricto.

RESTRICCIÓN DE CONTENIDO NO NEGOCIABLE: NO se usan fotos ni imágenes de producto en
ningún punto de la carta. No es una limitación temporal del mock: es una decisión
permanente porque no se cuenta con el equipo para producir esa fotografía. Toda la
identidad visual se construye con textura (madera, letras quemadas, herrajes) y
tipografía, nunca con imágenes de las botellas o los tragos.

PRECIOS MOCK: mientras no exista una lista de precios real confirmada por el negocio,
TODOS los productos del catálogo muestran el mismo precio de relleno: $100.000. Es
deliberado y visible como tal: el objetivo es validar el diseño de la fila (alineación,
tipografía, columna de precios), no simular tarifas reales. Antes de publicar, cada
precio se reemplaza uno por uno.

════════════════════════════════════════════════════════════════
CONCEPTO
════════════════════════════════════════════════════════════════

"Azabache" es la piedra negra amuleto contra el mal de ojo, y también el nombre del
caballo negro lustroso de montura. De ahí sale todo: negro brillante, calor de brasa,
latón de montura, madera de nogal.

Lema: "Aquí se bebe bueno, se canta duro y se sufre bonito."

La interfaz es OSCURA, no clara. Razones: la fonda se vive de noche con luz tibia y
una pantalla clara encandila; sobre madera oscura la madera se lee como madera de
verdad; y sobre todo, el efecto de LETRAS QUEMADAS (marca de hierro caliente) solo
funciona bonito sobre oscuro, donde la marca es el borde carbonizado más el brillo
de la brasa.

Se siente como: una tabla de nogal marcada con hierro, colgada con herrajes de latón,
bajo una bombilla amarilla. Impecable, no rústico de mentiras.
NO se siente como: restaurante mexicano de centro comercial, western de Hollywood,
tipografía de cartel de rodeo, ni menú de app de delivery.

Motivos gráficos permitidos, solo tres: herradura (el principal), silueta de caballo
(UNA aparición, al 6 % de opacidad en el pie), remache de latón. Prohibido: cactus,
cuerdas, revólveres, barriles, ruedas de carreta. Cero emojis.

════════════════════════════════════════════════════════════════
USUARIO Y RESTRICCIONES
════════════════════════════════════════════════════════════════

Está sentado en la mesa, con ruido, poca luz, brillo al 40 %, sosteniendo el celular
con una mano porque la otra tiene un vaso, y probablemente con dos o tres tragos encima.
Ya decidió comer ahí: no hay que persuadirlo, hay que informarlo rápido.

Consecuencias: texto grande (mínimo 13 px), contraste alto (mínimo 5:1 en todo lo
informativo), targets de 48 px, cero gestos secretos, cero onboarding, máximo 3 toques
desde el QR hasta "ya sé qué pido".

Objetivo: del escaneo a la decisión en menos de 20 segundos.

════════════════════════════════════════════════════════════════
STACK (versiones estables de agosto 2026)
════════════════════════════════════════════════════════════════

Next.js 16.3 App Router con output: 'export' (sitio 100 % estático, TTFB de CDN,
cero lock-in) · React 19 · TypeScript strict con noUncheckedIndexedAccess y
exactOptionalPropertyTypes · Tailwind CSS 4.3 (@theme, sin config file) para layout
y espaciado · CSS MODULES para texturas y efectos complejos · vaul para el bottom
sheet · Zod solo en prebuild y tests, nunca en el bundle · clsx · pnpm con versiones
exactas (-E).

Sin librería de animación (CSS keyframes + IntersectionObserver).
Sin librería de iconos (componentes SVG propios inline).
Sin fotos de producto (33 fotos serían 825 KB: cuatro veces el presupuesto).

Frontera Tailwind / CSS Module: si el valor arbitrario de Tailwind necesitaría más de
40 caracteres o un guion bajo, va a un CSS Module. Todo background-image con más de un
stop, todo box-shadow multicapa, todo @keyframes, filter, mask-image, mix-blend-mode y
-webkit-text-stroke va en CSS Module.

════════════════════════════════════════════════════════════════
PALETA "AZABACHE & CANDELA" (todo en tokens.css, nada suelto)
════════════════════════════════════════════════════════════════

Madera:  --c-azabache #0E0B08 · --c-madera-900 #15100B (fondo del documento)
         --c-madera-800 #1C1510 (barra, superficie 1) · --c-madera-700 #2A1F16 (tarjetas)
         --c-madera-600 #3A2A1D · --c-madera-500 #4E3826 · --c-madera-400 #6B4E36
         --c-cuero-500 #8A5A32 · --c-tabaco-400 #A6703F
Hueso:   --c-hueso-100 #F6EFE3 (texto, 15.7:1) · --c-hueso-300 #DCCDB6 (secundario, 11.9:1)
         --c-hueso-500 #A8977E (meta, 6.4:1 — límite inferior permitido)
Acentos: --c-candela-500 #C6551F · --c-candela-400 #E0752F (acento principal: precios,
         chip activo, 5.8:1) · --c-candela-300 #F0975A
         --c-laton-500 #B08D57 (herrajes) · --c-laton-300 #E3C77E (anillo de foco, 10.9:1)
         --c-vino-600 #7B2D26 (sello de lacre) · --c-musgo-500 #7E9B5E (badge sin carne)

Reglas: candela nunca es fondo de bloques grandes. Latón es decorativo, candela es
interactivo. Máximo dos acentos visibles a la vez. CERO #FFFFFF y #000000 en todo el
proyecto: el blanco es hueso y el negro es azabache. Todas las sombras usan rgba(14,11,8),
nunca negro puro: es lo que hace la penumbra cálida y no sucia.

Tipografía: Fraunces Variable (display: wordmark, títulos, precios; ejes opsz/wght/SOFT/WONK)
+ Instrument Sans Variable (cuerpo y UI). Autohospedadas con next/font/local, subset
latin, ~96 KB en total. CRÍTICO: incluir U+20A0-20BF en el subset o el signo $ de los
precios sale con fuente de respaldo. Activar tnum (cifras tabulares) para que la columna
de precios quede alineada.

Escala: display-xl clamp(2.75rem,12vw,3.5rem) · display-lg clamp(1.75rem,7vw,2.25rem)
title 24px versalitas tracking .06em · subtitle 12px mayúsculas tracking .16em
item 17px peso 600 · price 17px display tabular · body 15px · meta 13px · badge 11px
Mínimo absoluto: 13 px para información, 11 px solo para badges de 1-2 palabras.

Espaciado múltiplo de 4. Gutter lateral canónico 16 px. Radios 8/12/18/999.
env(safe-area-inset-*) aplicado arriba (barra) y abajo (pie y botón flotante).

════════════════════════════════════════════════════════════════
TEXTURAS
════════════════════════════════════════════════════════════════

FONDO DE MADERA — un solo div position:fixed, aria-hidden, pointer-events:none,
contain:strict, detrás de todo. Prohibido background-attachment:fixed (jank en Safari).
Seis capas:
 1. linear-gradient(175deg, madera-800, madera-900, #100C07)
 2. repeating-linear-gradient(90deg) → tablones de 118 px con junta oscura de 1.5 px
    y filo iluminado de 1.5 px
 3. tile de veta AVIF 256×256 (~8 KB), repeat, opacity .38, mix-blend-mode overlay
 3b. EL MISMO tile a 512×768 espejado en X, opacity .16, soft-light → rompe la
    periodicidad del tile. Cero bytes extra porque es el mismo archivo cacheado
 4. radial-gradient de viñeta oscura en los bordes
 5. radial-gradient cálido arriba al centro: luz de vela, rgba(224,117,47,.11)
 6. grano de película: SVG feTurbulence como data URI, 120×120, opacity .045, soft-light
El tile se genera UNA VEZ con feTurbulence (baseFrequency="0.9 0.012" para veta larga)
y se exporta a AVIF. Nunca se ejecuta feTurbulence en runtime: cuesta 80–200 ms.

TABLAS (.plank) — el volumen es puro box-shadow, sin imágenes:
  inset 0 1px 0 rgba(246,239,227,.09)     ← luz arriba
  inset 0 -1px 0 rgba(14,11,8,.6)         ← sombra abajo
  0 1px 1px rgba(14,11,8,.45)
  0 10px 22px -14px rgba(14,11,8,.85)
Variante "framed" añade un filete de latón interior a 1 px y aire tallado a 5 px.
Los separadores no son <hr> gris: son la JUNTA entre dos tablas (1 px oscuro + 1 px
de filo de luz debajo).

LETRAS QUEMADAS — el efecto firma. Cuatro capas que imitan la física del hierro caliente:
  color: transparent;
  background-image: linear-gradient(177deg,#F7E8CD 0%,#E6C793 38%,#C08C4D 72%,#8A5A2C 100%);
  background-clip: text;
  -webkit-text-stroke: 3px #180D05;   ← surco carbonizado
  paint-order: stroke fill;           ← el trazo va por fuera, no se come la letra
  filter: drop-shadow(0 1px 0 rgba(246,239,227,.10))    ← chispa alta
          drop-shadow(0 2px 3px rgba(14,11,8,.85))      ← profundidad
          drop-shadow(0 0 12px rgba(224,117,47,.26))    ← rescoldo
          drop-shadow(0 0 30px rgba(198,85,31,.14));    ← halo lejano
  font-variation-settings: 'SOFT' 24, 'WONK' 1, 'opsz' 72;
Se usa filter y no text-shadow porque con background-clip:text el text-shadow se pinta
detrás del glifo transparente y se ve.
OBLIGATORIO: el estado por defecto es color:var(--c-laton-300) sólido, y el efecto se
activa dentro de @supports (-webkit-background-clip:text) and (-webkit-text-stroke:1px #000).
Que el texto NUNCA quede invisible.
Tres intensidades: hot (lema de portada), warm (títulos de sección), scorch (badges).
El wordmark de la portada NO usa este CSS: es un SVG con los degradados horneados,
por consistencia entre navegadores y porque es el elemento LCP.
Máximo 2 elementos quemados visibles a la vez. Nombres de producto y precios NUNCA
van quemados: ahí manda la legibilidad.

HERRAJES — remache de latón de 6 px con radial-gradient (#F0D79B→#B08D57→#6A4F2C→#2C1E0F),
solo 4 por marco y solo en la portada y las cabeceras de sección. Filete de latón que se
desvanece a los lados. Separador de herradura: filete que se abre para una herradura SVG
de trazo, abierta hacia abajo. Máximo 3 herraduras separadoras en toda la página.

SELLO DE LACRE — para "El azabache eligió" y el badge "De la casa": radial-gradient de
vino con brillo arriba a la izquierda, border-radius de 8 valores distintos
(48% 52% 46% 54% / 53% 47% 53% 47%) para el borde irregular del lacre, rotate(-6deg).
Una sola aparición por pantalla.

════════════════════════════════════════════════════════════════
ESTRUCTURA
════════════════════════════════════════════════════════════════

src/
  app/         layout.tsx (lang="es-CO", fuentes, WoodBackdrop, FilmGrain, skip-link),
               page.tsx (una sola ruta), not-found.tsx, globals.css
  styles/      fonts.ts, tokens.css, theme.css, base.css, textures.css, animations.css
               (globals.css los importa en ESE orden: animations al final para que su
                bloque prefers-reduced-motion con !important gane)
  components/  primitives/ decor/ layout/ menu/ features/ icons/
  content/     site.ts, cancionero.ts, menu/{7 archivos}.ts + index.ts
  lib/         schemas.ts (Zod, solo build), format.ts, cn.ts, constants.ts
  hooks/       useActiveSection, useReducedMotion, useHaptics, useRandomItem
  types/       menu.ts
scripts/       validate-content.ts, subset-fonts.sh, generate-qr.ts

Reglas de estructura:
· Una carpeta por componente, con su .module.css al lado y un index.ts. Si se borra el
  componente, se borra la carpeta y no queda CSS huérfano.
· Dependencias en una sola dirección:
  icons ← primitives ← decor ← menu/layout/features ← app
  Una flecha al revés es un error de arquitectura.
· decor/ NUNCA es cliente y NUNCA conoce el dominio. Todo aria-hidden.
· content/ es datos puros: sin JSX, sin imports de React, sin funciones.
· NINGÚN componente contiene texto de negocio hardcodeado. Todo sale de site.ts.
· 'use client' va en el componente MÁS PROFUNDO que lo necesite, nunca en un contenedor.
· export nombrado siempre. Nunca export default (salvo lo que Next exige).
· Máximo 120 líneas por componente.
· Nombres: código y props en inglés; dominio y contenido en español (RuletaAzabache,
  Cancionero, item.disponible, ids de sección en kebab-case español).

Componentes cliente permitidos, SOLO estos cinco:
  primitives/Sheet · layout/CategoryNav · layout/Reveal · menu/ItemSheet ·
  features/RuletaAzabache
(más un CopyButton diminuto para la clave del wifi)
Todo lo demás es Server Component: 0 KB de JS.

════════════════════════════════════════════════════════════════
DATOS
════════════════════════════════════════════════════════════════

type ItemTag = 'casa'|'favorita'|'picante'|'sin-alcohol'|'compartir'|'fuerte'|'temporada'

interface MenuItem {
  id: string;            // kebab-case, estable, inmutable
  nombre: string;
  descripcion?: string;  // máximo 12 palabras, ingredientes/notas reales, cero adjetivos
  precio: number;        // entero COP. TODOS en 100_000 (mock deliberado, ver arriba)
  volumen?: string;      // "Botella 750 ml", "Media", "Trago 2 oz"
  etiquetas?: ItemTag[]; // máximo 2
  disponible?: boolean;  // default true. false → fila atenuada, precio tachado, "Hoy no hay"
  relato?: string;       // 1-2 frases. SU PRESENCIA HABILITA EL BOTTOM SHEET.
                         // Máximo 8 en toda la carta: si todo tiene historia,
                         // nada tiene historia
  vaBienCon?: string[];  // máximo 2 ids
  // SIN campo imagen. No se añade: no hay equipo para fotografía de producto.
}

interface MenuCategory {
  id: string;         // ancla, kebab-case
  titulo: string;     // voz de fonda, va quemado: "De la olla"
  subtitulo: string;  // literal, en mayúsculas pequeñas: "Platos fuertes"
  chip: string;       // ≤14 caracteres para que quepa en la barra
  nota?: string;
  items: MenuItem[];  // entre 2 y 9
}

Sin campo `imagen`: es decisión de diseño, no omisión.
Sin campo `orden`: el orden es el del arreglo. Reordenar es mover líneas.

Validación con Zod en scripts/validate-content.ts, conectado a `prebuild`. Los límites
del esquema SON el diseño hecho código: precio múltiplo de 500 (nadie cobra $23.780),
descripción ≤14 palabras, ≤2 etiquetas, chip ≤14 caracteres, 2-9 items por sección,
≤9 secciones. Más cuatro invariantes propias: ids únicos, ≤8 relatos, referencias de
vaBienCon existentes. Si algo falla, el build falla.

formatCOP: Intl.NumberFormat('es-CO', {style:'currency', currency:'COP',
maximumFractionDigits:0}) instanciado UNA vez a nivel de módulo, y se le quitan los
espacios del resultado (Intl varía entre runtimes y "$ 100.000" en Android con
"$100.000" en iOS se nota).

LAS 6 SECCIONES Y 26 PRODUCTOS (mock; TODOS los precios en $100.000, ver arriba):

1. "Del estante" / AGUARDIENTES Y RONES / id: del-estante
   nota: "La botella se sirve con mezcladores y hielo."
   · Aguardiente Antioqueño $100.000 · Media 375 ml · [favorita] · relato
     "En la fonda no se pregunta 'cuál aguardiente'. Se pregunta 'media o botella'."
   · Aguardiente Antioqueño $100.000 · Botella 750 ml · [compartir]
   · Aguardiente sin azúcar $100.000 · Media 375 ml
   · Ron Medellín 8 años $100.000 · Botella 750 ml · [fuerte]
   · Viejo de Caldas $100.000 · Trago 2 oz

2. "Bien fría" / CERVEZAS / id: bien-fria
   · Pilsen $100.000 · 330 ml · [favorita] · "La de la casa. Bien fría, siempre."
   · Poker $100.000 · Águila Light $100.000 · Club Colombia Dorada $100.000
   · Artesanal de la región $100.000 · [temporada] · "Rotativa. Pregunte cuál hay hoy."

3. "De fuera" / WHISKY, TEQUILA Y VODKA / id: de-fuera
   nota: "Se sirven derechos, con hielo o con mezclador. Usted decide."
   · Old Parr 12 años $100.000 · Botella 750 ml · [favorita]
   · Buchanan's 12 años $100.000 · Botella 750 ml · [compartir]
   · José Cuervo Reposado $100.000 · Trago 2 oz · [fuerte]
   · Absolut $100.000 · Botella 700 ml
   · Macallan 12 años $100.000 · Botella 750 ml · disponible: false (edición limitada agotada)

4. "De la casa" / CÓCTELES / id: de-la-casa
   nota: "Los preparamos uno por uno. Se demoran, pero valen."
   · Azabache $100.000 · 8 oz · [casa] · relato
     "Aguardiente, maracuyá, hierbabuena y un toque de panela. Negro por fuera,
      dulce por dentro, y le pega. Como el caballo que nos dio el nombre."
   · Guaro sour $100.000 · 6 oz · [fuerte]
   · Canelazo $100.000 · 8 oz · relato
     "Para las noches frías y las conversaciones largas."
   · Mojito de lulo $100.000 · 10 oz
   · Michelada de la fonda $100.000 · 12 oz · [picante]

5. "De la cava" / VINOS Y ESPUMOSOS / id: de-la-cava
   · Vino tinto de la casa $100.000 · Copa 5 oz · [favorita]
   · Vino tinto de la casa $100.000 · Botella 750 ml · [compartir]
   · Espumoso Brut $100.000 · Botella 750 ml · [temporada]

6. "Pa' la sed" / SIN ALCOHOL / id: pa-la-sed
   · Limonada de coco $100.000 · 16 oz · [favorita, sin-alcohol]
   · Jugo de mora en leche $100.000 · 12 oz · [sin-alcohol]
   · Claro de panela $100.000 · 12 oz · [sin-alcohol]
   · Tinto campesino $100.000 · 6 oz · [sin-alcohol] · relato
     "El que no se toma un tinto antes de irse, no vino a la fonda: pasó por la fonda."

site.ts: nombre, url, lema (3 líneas), bajada "Trago derecho, cerveza bien fría y
música de la que duele. Bienvenido a la mesa.", 2 coplas, horarios (martes-jueves
4pm-12am, viernes-sábado 2pm-2am, domingo 12m-10pm, lunes cerrado), contacto, wifi
{red:'FondaAzabache', clave:'sesufrebonito'}, y avisos: propina, precios, y
OBLIGATORIO POR LEY el de Ley 30 de 1986 sobre alcohol y venta a menores.

cancionero.ts: 8 clásicos para pedir en la barra. Darío Gómez "Nadie es eterno",
Óscar Agudelo "El as de corazones", Las Hermanitas Calle "La cuchilla", Alci Acosta
"La copa rota", Julio Jaramillo "Nuestro juramento", Vicente Fernández "El rey",
Javier Solís "Sombras nada más". Pesa 600 bytes y es literalmente "se canta duro y
se sufre bonito".

════════════════════════════════════════════════════════════════
PANTALLA
════════════════════════════════════════════════════════════════

PORTADA (min-height:100dvh, no vh)
  Letrero de madera colgado de dos cadenas SVG, con el wordmark quemado (SVG horneado,
  inlineado en el HTML, con priority: es el LCP) y 4 remaches de latón.
  El letrero SE MECE: rotate ±0.5°, 7 s, ease-in-out, alternate, infinite,
  transform-origin: top center. Se PAUSA al salir del viewport. Es la única animación
  continua de la app y la única con will-change.
  Lema en 3 líneas con .burnt.hot, la tercera en itálica de Fraunces.
  El lema NO se anima al entrar: ya está visible y animarlo retrasaría el LCP.
  Bajada en hueso-300. Botón "Ver la carta" (52 px, href="#carta"). Chevron sutil.

BARRA STICKY (56 px + safe-top, z-index 50)
  6 chips con scroll horizontal. FONDO DE MADERA SEMIOPACO, NO backdrop-filter
  (el blur cuesta 4–9 ms por frame justo durante el scroll, que es el momento crítico).
  mask-image que desvanece 24 px en el borde derecho, y el último chip cortado a
  propósito: es el afordance más honesto de que hay más.
  Los chips son <a href="#..."> REALES, no botones con scrollIntoView: funcionan sin JS.
  El chip activo se detecta con UN IntersectionObserver, rootMargin
  '-{56+safeTop+12}px 0px -55% 0px'. El -55% inferior es lo que evita el parpadeo
  entre dos secciones visibles. Devuelve la ÚLTIMA sección que entró, no la de mayor
  ratio. Al llegar al final de la página fuerza la última sección.
  Centrar el chip activo se hace con contenedor.scrollTo({left: calculado}), NUNCA con
  scrollIntoView: scrollIntoView mueve el scroll vertical de la página. Es el bug clásico.
  La sombra --sh-raised aparece solo cuando scrollY > 8.
  html { scroll-padding-top } + section { scroll-margin-top }: los dos, porque el
  navegador usa uno u otro según cómo se dispare el scroll.

SECCIÓN
  Cabecera en PlankFrame framed con studs: título quemado (h2, versalitas, centrado),
  subtítulo literal en laton-500, filete de latón corto, nota en itálica.
  content-visibility:auto + contain-intrinsic-size:auto 520px en todas menos la primera
  (ahorra ~35 % del layout inicial; sin el intrinsic-size la barra de scroll salta).
  <section id> + aria-labelledby apuntando al h2.

FILA DE PRODUCTO
  Nombre (17px hueso-100) y precio (17px candela-400, Fraunces, tabular-nums) en la
  misma línea, alineados por BASELINE, no center: es lo que los hace leer como una
  unidad. El precio nunca se parte (nowrap, flex:none).
  SIN puntos de relleno entre nombre y precio: en móvil con nombres largos se ve sucio.
  Descripción en hueso-300. Volumen y badges abajo. Separador .seam entre filas.
  Solo las 7 filas con relato son tocables, y lo dicen con "⌄ leer". Las otras 26 no
  parecen tocables: cero falsas promesas.
  :active → scale(.99) + fondo madera-600 al 40 %, 90 ms. Confirma el toque antes de
  que abra el sheet; sin esto la app "no responde" durante 300 ms.

BOTTOM SHEET (vaul, next/dynamic ssr:false, ~7 KB solo tras la primera interacción)
  Panel .plank con radio 18 px arriba, asa de arrastre de 36×4, backdrop
  rgba(14,11,8,.72) + blur(6px) — EL ÚNICO backdrop-filter permitido en toda la app,
  porque es un overlay estático que no compite con el scroll.
  Entra translateY(100%)→0 en 320 ms con cubic-bezier(.22,1,.36,1).
  Cierra por CUATRO vías: arrastre, backdrop, Escape y botón "Cerrar" visible. Alguien
  con dos aguardientes encima no va a descubrir un gesto.
  Foco atrapado y devuelto al disparador. aria-modal, role=dialog, aria-labelledby.
  Deja ver ~15 % de la carta arriba. padding-bottom con safe-area.
  Contenido: nombre, precio, badges, descripción, filete, relato en Fraunces itálica,
  "VA BIEN CON" con 2 relacionados que navegan a su sección y cierran el sheet
  (NUNCA abren otro sheet: encadenar modales es un laberinto, peor con trago).
  NO hay carrito ni "agregar al pedido": la carta informa, el mesero atiende.
  Meter un pedido falso sería mentirle al usuario.

LA RULETA DEL AZABACHE (la idea diferenciadora, ~2 KB, lazy)
  Por qué existe: a las dos horas en una fonda el problema no es no saber qué hay, es
  no poder decidir. Y "azabache" es amuleto: la casa le echa la suerte.
  Botón flotante de 56 px con herradura de latón, abajo a la derecha + safe-area.
  Aparece SOLO después de pasar la portada (en la primera pantalla estorbaría).
  aria-label "Que la casa elija por usted". Tooltip de primera vez, una sola vez por
  sesión (sessionStorage).
  Secuencia: toque → vibración de 8 ms → sheet → barajeo de nombres al azar cada 90 ms
  durante 700 ms → resultado con scale(1.06)→1 en 240 ms + destello de brasa de 400 ms
  + vibración de 12 ms + sello de lacre "EL AZABACHE ELIGIÓ" → producto completo →
  botones "Otra vez" (brass) y "Ver en la carta" (primary).
  Reglas: nunca elige agotados; NUNCA repite el inmediato anterior (que "Otra vez"
  devuelva lo mismo mata la magia al primer intento). Con prefers-reduced-motion salta
  directo al resultado, sin barajeo ni destello ni vibración.
  "Ver en la carta": cierra el sheet, salta a la sección y resalta la fila 3 SEGUNDOS
  con borde candela y halo de brasa, que se quita solo. Sin el resaltado, el usuario
  llega a la sección y tiene que buscar el producto entre cinco.
  La lógica va en hooks/useRandomItem.ts, no en el componente, y es la única lógica
  de la app que merece un test unitario propio.
  aria-live="polite" en el resultado; el área de barajeo va aria-hidden para que el
  lector anuncie una vez y no siete.

PIE
  HorseshoeRule, copla en Fraunces itálica, horarios en <dl> real, dirección, teléfono,
  y LA CLAVE DEL WIFI en un hueco tallado (.carved) con la clave en Fraunces,
  seleccionable, y un botón "Copiar" de 44 px con feedback textual "Copiada" durante 2 s
  (no un toast). Es el dato más útil de todo el pie.
  Cancionero en <details> nativo colapsado: cero JS, accesible de fábrica, y Chrome lo
  expande al buscar con Ctrl+F.
  3 botones de redes de 48 px. Avisos legales legibles, no gris sobre gris.
  Silueta de caballo al 6 % de opacidad, como marca de agua.
  padding-bottom con 72 px extra para que el botón flotante no tape los avisos legales.

════════════════════════════════════════════════════════════════
MOTION: SEIS ANIMACIONES EN TODA LA APP
════════════════════════════════════════════════════════════════

1. mecer-letrero    7 s ∞ alterna    rotate ±0.5°
2. revelar          420 ms 1 vez     opacity + translateY(10px), SOLO en cabeceras de
                                     sección, nunca en las 33 filas
3. sheet-entrar     320 ms           translateY
4. backdrop-entrar  240 ms           opacity
5. barajear         90 ms × 7        opacity (cambio de texto)
6. destello-brasa   400 ms           box-shadow (la única excepción permitida a la
                                     prohibición de animar box-shadow, y se justifica:
                                     400 ms, elemento pequeño, en un overlay sin scroll
                                     simultáneo, y es el clímax de la interacción)

Duraciones: 90/160/240/320/420 ms. Curvas: cubic-bezier(.22,.61,.36,1) para salidas,
(.22,1,.36,1) para el sheet, (.45,.05,.55,.95) para el balanceo.
Solo se animan transform, opacity, filter y color. Cero animación de height, top,
width, margin o background-position.
prefers-reduced-motion: reduce → animation-duration:1ms !important en todo, con el
bloque al final de la cascada.
will-change SOLO en el letrero. Ponerlo en todo crea capas de GPU que consumen memoria
en gama baja.
NO se implementan: hover (no existe en móvil), ripple, toasts, pull-to-refresh,
skeletons, scroll infinito, parallax.

════════════════════════════════════════════════════════════════
PRESUPUESTO (se cumple; si una decisión lo rompe, avisar antes)
════════════════════════════════════════════════════════════════

HTML ≤20 KB · CSS ≤22 KB · JS inicial ≤90 KB gz · fuentes ≤115 KB ·
imágenes above-the-fold ≤40 KB · TOTAL INICIAL ≤300 KB (estimado real: ~210 KB,
con 90 KB de margen deliberado para decir sí a una idea de diseño en tres meses).
LCP <1.8 s en Android de gama media con 4G lento · CLS <0.02 · INP <120 ms.
Lighthouse móvil ≥95 rendimiento, 100 en accesibilidad, buenas prácticas y SEO.

Prohibido por rendimiento: background-attachment:fixed · backdrop-filter fuera del
backdrop del sheet · filter:url(#svg) sobre contenido · feTurbulence en runtime ·
animar width/height/top/left/margin · will-change en más de un elemento · Google Fonts
por CDN · cualquier script de terceros en el camino crítico.

════════════════════════════════════════════════════════════════
ACCESIBILIDAD (WCAG 2.2 AA, objetivo 100 en Lighthouse)
════════════════════════════════════════════════════════════════

Todo texto informativo supera 5:1 (el mínimo AA es 4.5; se dejó margen a propósito por
la poca luz y el alcohol). Un solo <h1> (la portada), h2 por sección, h3 por producto,
sin saltos de nivel. role="list" EXPLÍCITO en los <ul> con list-style:none, porque
Safari + VoiceOver pierden la semántica de lista sin él (bug real, no teórico).
:focus-visible con anillo de latón de 2 px y offset 3, nunca outline:none sin reemplazo.
Skip link. lang="es-CO". Targets de 48 px. Sin maximum-scale (el zoom es un derecho).
Toda acción por gesto tiene equivalente por botón. Los badges llevan texto, no solo
color. "Hoy no hay" es texto, no solo opacidad.

════════════════════════════════════════════════════════════════
VOZ
════════════════════════════════════════════════════════════════

Paisa, cálido, breve, digno. USTED, no tú. Elisión ("Pa' picar", "Bien fría") SOLO en
etiquetas decorativas, nunca en la información crítica. Doble capa en cada título de
sección: nombre con voz + subtítulo literal, porque la gracia no puede costarle a nadie
entender dónde está. Descripciones de máximo 12 palabras con ingredientes reales.
NI UNA exclamación: el énfasis se hace con tipografía. Cero emojis.
Copys: "Ver la carta" · "¿No sabe qué pedir?" · "El azabache eligió" · "Otra vez" ·
"Clave del wifi" · "Hoy no hay" · "Cerrar" ·
"La propina es voluntaria y va completa para el equipo."
404: "Eso no está en la carta."

════════════════════════════════════════════════════════════════
ORDEN DE TRABAJO
════════════════════════════════════════════════════════════════

F0 Fundación: proyecto, config, lint, hooks, CI, árbol de carpetas.
   ✅ pnpm build genera out/ limpio.
F1 Sistema de diseño: tokens, theme, base, animations, fuentes subseteadas, formatCOP.
   ✅ Cada par de color da el ratio documentado. Los precios salen con $ en Fraunces
      y en columna alineada.
F2 Texturas: tile AVIF, WoodBackdrop, FilmGrain, .plank, BurntTitle con su fallback,
   herrajes, iconos.
   ✅ En un CELULAR REAL el fondo se ve como madera sin retícula perceptible. Con
      -webkit-text-stroke desactivado, el título sigue LEGIBLE. El fondo no repinta
      al hacer scroll.
F3 Contenido: tipos, esquemas Zod, los 7 archivos, validador con las 4 invariantes.
   ✅ Un id duplicado, un precio de 23.780 y un vaBienCon inexistente hacen fallar
      el build con mensajes claros.
F4 La carta: primitives, filas, secciones, Hero, CategoryNav, Reveal, Footer, page.
   ✅ Los 6 chips dejan el título visible. El chip activo no parpadea ni mueve el
      scroll vertical. CON JAVASCRIPT DESACTIVADO LA CARTA SE LEE COMPLETA.
F5 Sheet y Ruleta.
   ✅ El sheet cierra por las 4 vías y devuelve el foco. "Otra vez" 15 veces sin
      repetir ni sacar agotados. vaul en un chunk que no se descarga al cargar.
F6 Rendimiento, a11y y SEO: preload, inline del wordmark, metadata, JSON-LD, Lighthouse,
   axe, checklist manual.
   ✅ Los números del presupuesto, medidos en dispositivo real.
F7 QA en iPhone SE + iPhone 14 + Android de gama media REALES, con brillo al 40 % y
   datos móviles. QR nivel Q, ≥3 cm, negro sobre claro, probado en 5 teléfonos a 40 cm
   con luz tenue.
   ✅ Escanea a la primera en los 5.

Verifica el criterio de aceptación de cada fase antes de pasar a la siguiente.
Si algo de este prompt entra en conflicto con una buena práctica que conoces, dilo
antes de desviarte.
```

---

## 3. Notas sobre el uso de estos prompts

**Por qué el prompt corto es mejor cuando hay docs.** El prompt autocontenido son ~1.100 líneas. Gastarlo en cada sesión consume contexto que se necesita para el código. Con los docs en el workspace, el modelo lee solo el documento que le hace falta en cada fase.

**Cómo usarlos por partes.** No hay que hacer todo de un tirón. Sesión por fase funciona mejor:

```
Sesión 1:  "Ejecuta la Fase 0 y la Fase 1 de docs/10-roadmap-y-tareas.md."
Sesión 2:  "Ejecuta la Fase 2. La referencia completa está en docs/03-texturas-y-efectos.md."
Sesión 3:  "Ejecuta las Fases 3 y 4."
Sesión 4:  "Ejecuta la Fase 5."
Sesión 5:  "Ejecuta la Fase 6 y reporta las métricas medidas."
```

Cada fase tiene su criterio de aceptación, así que cada sesión termina con algo verificable. Eso es lo que evita el "parece que funciona".

**Lo que hay que revisar con ojo humano, sí o sí:**

1. **El fondo de madera en un celular real.** En el emulador de DevTools la densidad de píxeles es otra y la textura miente. Es la primera cosa que hay que ver en un dispositivo.
2. **El efecto quemado.** Los valores de `drop-shadow` y del degradado están calculados, pero el ajuste final es de ojo. Hay que sentarse a moverlos ±20 % hasta que se vea como hierro caliente y no como texto con brillo.
3. **La velocidad del letrero al mecerse.** Si se nota, está mal.
4. **El QR impreso.** Es el punto de falla más caro del proyecto: si no escanea, nada de lo demás existe.
5. **Los 26 precios mock.** Todos están en `$100.000` a propósito, como valor de relleno visible. Antes de publicar, cada uno se reemplaza por el precio real que confirme el negocio.
