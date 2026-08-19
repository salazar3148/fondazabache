# Fonda Azabache · Carta Digital

> **Aquí se bebe bueno, se canta duro y se sufre bonito.**

Documentación maestra del proyecto. Este folder es la **fuente de verdad**: si el código y el doc no coinciden, se arregla uno de los dos en el mismo PR.

---

## 1. Qué estamos construyendo

Una **carta digital mobile-only** para Fonda Azabache, accesible por código QR desde la mesa. No es un menú en PDF con estilos. Es una pieza de marca: madera, hierro caliente, latón y penumbra de fonda antioqueña, con la sobriedad de un producto digital moderno.

**Restricciones de producto (no negociables):**

| # | Restricción | Por qué |
|---|---|---|
| R1 | **Solo móvil** (360–430 px de ancho de referencia) | Se escanea un QR en la mesa. No hay caso de uso de escritorio. |
| R2 | **Carga rápida con datos móviles pobres** | Wi-Fi saturado, 3G/4G débil dentro de un local con paredes gruesas. |
| R3 | **Legible con trago encima y poca luz** | Tipografía grande, contraste alto, targets grandes, cero ambigüedad. |
| R4 | **Diseño por encima del rendimiento, pero con presupuesto** | Si hay que gastar 30 KB extra para que se vea hermoso, se gastan. Si son 300 KB, no. |
| R5 | **Animación sutil y con propósito** | Nada de parallax, scroll-jacking ni confeti. |
| R6 | **Preparada para cambiar todas las semanas** | Precios y disponibilidad cambian. Editar contenido no debe requerir tocar componentes. |
| R7 | **Solo licores y bebidas, sin fotos de producto** | La fonda no vende comida. No hay equipo para producir fotografía de producto: la identidad visual se construye con textura y tipografía, no con imágenes de los tragos. |

---

## 2. Cómo leer esta documentación

Los documentos están numerados en el orden en que conviene leerlos. Los `01`–`03` son **diseño**, los `04`–`07` son **ingeniería**, los `08`–`11` son **ejecución y calidad**, y el `12` es el prompt one-shot.

| Doc | Contenido | Para quién |
|---|---|---|
| [`01-vision-y-marca.md`](./01-vision-y-marca.md) | Concepto, el porqué del "azabache", voz y tono, copys reales, moodboard verbal | Todos |
| [`02-sistema-de-diseno.md`](./02-sistema-de-diseno.md) | Paleta con ratios de contraste, tipografía, escalas, tokens, sombras, radios | Diseño + Front |
| [`03-texturas-y-efectos.md`](./03-texturas-y-efectos.md) | Fondo de madera, marcos de tabla, **letras quemadas**, grano, latón. CSS real | Front |
| [`04-arquitectura-tecnica.md`](./04-arquitectura-tecnica.md) | Stack, versiones, ADRs, `next.config`, tooling, CI | Front |
| [`05-estructura-y-convenciones.md`](./05-estructura-y-convenciones.md) | Árbol de carpetas, naming, reglas de CSS vs Tailwind, patrones de componente | Front |
| [`06-modelo-de-datos-y-contenido.md`](./06-modelo-de-datos-y-contenido.md) | Tipos, validación Zod, **el mock completo de la carta** | Front + Negocio |
| [`07-catalogo-de-componentes.md`](./07-catalogo-de-componentes.md) | API de cada componente, props, estados, ejemplos | Front |
| [`08-ux-flujos-e-interacciones.md`](./08-ux-flujos-e-interacciones.md) | Wireframes, navegación sticky, bottom sheet, La Ruleta del Azabache, specs de motion | Diseño + Front |
| [`09-rendimiento-accesibilidad-seo.md`](./09-rendimiento-accesibilidad-seo.md) | Presupuestos con cifras, técnicas, checklist WCAG, metadata y QR | Front |
| [`10-roadmap-y-tareas.md`](./10-roadmap-y-tareas.md) | 8 fases con tareas marcables y criterios de aceptación | Todos |
| [`11-qa-checklist-y-deploy.md`](./11-qa-checklist-y-deploy.md) | QA en dispositivo real, deploy estático, generación del QR | Front + Ops |
| [`12-prompt-maestro.md`](./12-prompt-maestro.md) | Prompt único, copiable, para generar el proyecto de cero | Todos |

---

## 3. Resumen ejecutivo de las decisiones

Para quien solo lee esta página:

**Concepto.** *Azabache* es la piedra negra que se le pone a los recién nacidos contra el mal de ojo, y es también el nombre del caballo negro brillante de montura. Esa doble lectura —**amuleto** y **caballo**— es toda la marca: negro lustroso, calor de brasa, latón de montura. Por eso la interfaz es **oscura**, no clara: la fonda se vive de noche, con luz tibia, y una pantalla oscura no encandila ni se pelea con el ambiente.

**Paleta.** *Azabache & Candela*: nogal quemado casi negro de fondo, tabla de nogal medio para las superficies, **hueso** para el texto (15.7:1 de contraste), **latón** para lo decorativo y **candela** (naranja brasa) para lo que hay que mirar. Nada de saturaciones chillonas. Detalle completo en [`02`](./02-sistema-de-diseno.md#2-paleta-azabache--candela).

**El catálogo.** Fonda Azabache es una fonda de trago: **solo licores y bebidas**, sin cocina. El mock de contenido en [`06`](./06-modelo-de-datos-y-contenido.md) cubre 6 secciones y 26 productos (aguardientes, cerveza, whisky/tequila/vodka, cócteles de la casa, vinos y espumosos, y bebidas sin alcohol). Como todavía no hay lista de precios confirmada con el negocio, **todos los productos muestran el mismo precio de relleno, `$100.000`**, a propósito: el objetivo del mock es validar el diseño de la fila, no simular tarifas reales. Y **no hay fotos de producto**: no es una limitación temporal, es una decisión permanente porque no se cuenta con el equipo para producirlas — la identidad visual descansa en la textura y la tipografía, no en imágenes.

**Tipografía.** *Fraunces* variable para display (tiene el alma de rótulo antiguo sin caer en disfraz de western) e *Instrument Sans* variable para cuerpo e interfaz. Dos archivos, subset latino, autohospedados: ~110 KB en total.

**El efecto firma: letras quemadas.** Los títulos de sección se ven como una **marca de hierro caliente sobre la tabla**: relleno en degradado hueso→latón, borde carbonizado con `paint-order: stroke fill`, y un halo de brasa muy tenue detrás. Todo en CSS, cero imágenes. Receta completa en [`03`](./03-texturas-y-efectos.md#4-letras-quemadas-el-efecto-firma).

**El fondo de madera.** Cinco capas CSS + **un tile AVIF de 256×256 (~8 KB)**: base de nogal, tablas verticales con junta y filo iluminado, veta, viñeta y un foco de luz de vela arriba. Pesa menos que una foto de un plato y no se repite de forma obvia.

**Stack.** Next.js 16.3 (App Router) con `output: 'export'` → sitio 100 % estático en CDN, TTFB casi nulo, deploy en cualquier parte. React 19, TypeScript strict, Tailwind v4.3 para layout y espaciado, **CSS Modules para las texturas y efectos** (así el CSS complejo queda separado y versionado, no en clases mágicas). Contenido en módulos TS tipados y validados con Zod en `prebuild`. Justificación y alternativas descartadas en [`04`](./04-arquitectura-tecnica.md#3-decisiones-de-arquitectura-adr).

**La idea que suma valor de verdad.** *La Ruleta del Azabache*: un botón discreto para el que no sabe qué pedir (o ya no está en condiciones de decidir). Elige un plato o trago al azar y lo presenta con un sello de cera: **"El azabache eligió"**. Cuesta ~2 KB de JS y es el detalle que la gente le muestra al de al lado. Spec en [`08`](./08-ux-flujos-e-interacciones.md#6-la-ruleta-del-azabache).

**El segundo detalle con alma.** *El Cancionero de la Casa*: la lista de los clásicos que suenan y se pueden pedir. Darío Gómez, Óscar Agudelo, Las Hermanitas Calle. Es una lista de texto, pesa nada, y es exactamente el "se canta duro y se sufre bonito".

**Presupuesto de rendimiento.** JS inicial ≤ 90 KB gz · CSS ≤ 22 KB gz · fuentes ≤ 115 KB · imágenes above-the-fold ≤ 40 KB · **payload inicial ≤ 300 KB** · LCP < 1.8 s en Moto G mid-range sobre 4G lento. Lighthouse móvil ≥ 95 en rendimiento y 100 en accesibilidad.

---

## 4. Principios de diseño del proyecto

Cinco reglas para resolver discusiones sin reunión:

1. **La madera es el escenario, no el protagonista.** La textura vive detrás y por debajo. Si compite con el nombre de un plato, la textura pierde.
2. **Un solo gesto decorativo por pantalla.** El letrero que se mece está en la portada. El sello de cera está en la ruleta. No se acumulan.
3. **El precio siempre gana el segundo lugar de atención.** Nombre del producto primero, precio inmediatamente después, descripción tercera. Nadie debe buscar un precio.
4. **Si un elemento no se puede tocar con el pulgar de la mano que sostiene el vaso, está mal puesto.** Zona cómoda: los dos tercios inferiores de la pantalla.
5. **Sutil no es tímido.** Bajo contraste de forma, alto contraste de intención. Poco brillo, mucha personalidad.

---

## 5. Glosario del proyecto

Términos que aparecen en el código y en los docs. Se usan tal cual en nombres de componentes y clases.

| Término | Significado en el producto |
|---|---|
| **Tabla** (`plank`) | Superficie de tarjeta o sección, con bisel de madera |
| **Marca / quemado** (`burn`) | Título con efecto de hierro caliente |
| **Candela** | Naranja brasa. Color de acento e interacción |
| **Latón** (`laton`) | Dorado apagado. Herrajes, filetes, remaches |
| **Hueso** (`hueso`) | Crema del texto. El "blanco" de la marca |
| **Remache** (`stud`) | Punto de latón en las esquinas de un marco |
| **Herradura** (`horseshoe`) | Separador decorativo entre bloques |
| **Sello** (`sello`) | Estampa/lacre para destacados ("De la casa", "La favorita") |
| **Ruleta** | La Ruleta del Azabache, selector aleatorio |
| **Cancionero** | Lista de canciones de la casa |

---

## 6. Estado y siguiente paso

Este folder contiene el plan completo. El código todavía no existe.

**Siguiente paso:** ejecutar la Fase 0 de [`10-roadmap-y-tareas.md`](./10-roadmap-y-tareas.md), o pegar [`12-prompt-maestro.md`](./12-prompt-maestro.md) en una sesión nueva para arrancar la implementación de un tirón.
