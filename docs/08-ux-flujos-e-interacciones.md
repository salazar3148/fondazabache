# 08 · UX, Flujos e Interacciones

## 1. El usuario real

No es un usuario genérico. Es una persona concreta en una situación concreta, y todo el diseño se decide desde ahí.

| Rasgo | Consecuencia de diseño |
|---|---|
| Está **sentado en una mesa**, con ruido y conversación | Nada de instrucciones largas. Nada de onboarding |
| Sostiene el celular **con una mano**, la otra tiene un vaso | Todo lo tocable en los dos tercios inferiores o al alcance del pulgar |
| Puede llevar **dos o tres tragos** | Texto grande, contraste alto, targets de 48 px, cero gestos secretos |
| **Poca luz** ambiente, pantalla al 40 % de brillo | Tema oscuro, contraste mínimo 6:1 en todo lo informativo |
| **Datos móviles regulares**, Wi-Fi saturado | Payload < 300 KB, todo en un solo request de HTML |
| Ya decidió que va a beber **acá**. No está comparando | Cero persuasión, cero fotos de producto, cero "¡el más vendido!" |
| Quiere **decidir rápido** y volver a la conversación | Máximo 3 toques desde el QR hasta saber qué pedir |

**Métrica de éxito del diseño:** *del escaneo del QR a "ya sé qué pido" en menos de 20 segundos.*

---

## 2. Flujo principal

```
        [ Escanea el QR ]
                │
                ▼
   ┌─────────────────────────┐
   │  PORTADA                │   ~1.6 s hasta pintado completo
   │  letrero + lema + CTA   │   El lema es lo primero que se lee
   └───────────┬─────────────┘
               │  toca "Ver la carta"  ── o simplemente hace scroll
               ▼
   ┌─────────────────────────┐
   │  BARRA STICKY + CARTA   │   La barra aparece y se queda
   │  Del estante (1.ª sección)│ El chip activo se mueve solo al hacer scroll
   └───────────┬─────────────┘
               │
    ┌──────────┼───────────────────────┬──────────────────────┐
    │          │                       │                      │
    ▼          ▼                       ▼                      ▼
 Scroll     Toca un chip          Toca un producto      Toca la herradura
 libre      → salta a la sección  con relato            flotante
    │          │                  → bottom sheet        → LA RULETA
    │          │                       │                      │
    │          │                       │  cierra              │  "El azabache eligió"
    └──────────┴───────────────────────┴──────────────────────┤
                                                              │  "Ver en la carta"
                                                              ▼
                                                     salta a la sección
                                                     y resalta la fila
                                │
                                ▼
                    ┌───────────────────────┐
                    │  PIE                  │
                    │  horario · wifi ·     │
                    │  cancionero · redes   │
                    └───────────────────────┘
```

**Cuenta de toques:**
- Camino más común: **1 toque** (el CTA) + scroll. O **0 toques**, solo scroll.
- Camino dirigido: **2 toques** (CTA → chip de categoría).
- Camino indeciso: **2 toques** (herradura → "Otra vez" si no gustó).

Nadie necesita más de 3.

---

## 3. Wireframe de la pantalla completa

Viewport de referencia 390 × 844.

```
╔══════════════════════════════════════╗ 0
║              ⌒⌒⌒⌒⌒                    ║   ← letrero colgado (se mece)
║         ╔══════════════╗             ║
║      ●  ║    FONDA     ║  ●          ║   wordmark.svg, 240×86
║         ║   AZABACHE   ║             ║
║      ●  ╚══════════════╝  ●          ║
║                                      ║
║         Aquí se bebe bueno,          ║   .burnt .hot · 32px
║           se canta duro              ║
║        y se sufre bonito.            ║   ← 3.ª línea en itálica
║                                      ║
║  Trago derecho, cerveza bien fría y  ║   15px · hueso-300
║  música de la que duele.             ║
║                                      ║
║        ┌──────────────────┐          ║
║        │   Ver la carta   │          ║   52px de alto
║        └──────────────────┘          ║
║                 ⌄                    ║
╠══════════════════════════════════════╣ 844
║▓[Del estante][Bien fría][De fuera…  ▒║ ← sticky, 56px, desvanece a la derecha
╠══════════════════════════════════════╣
║  ●                              ●   ║
║      D E L   E S T A N T E          ║   BurntTitle · 24px · versalitas
║        AGUARDIENTES Y RONES          ║   12px · laton-500 · tracking .16em
║  ●         ─── ⌒ ───            ●   ║
║  La botella se sirve con hielo.     ║   13px itálica · hueso-500
╠══════════════════════════════════════╣
║                                      ║
║  Aguardiente Antioqueño   $100.000  ║   17px hueso-100 / 17px candela-400
║  El de siempre. Con hielo y limón.  ║   15px hueso-300
║  Media · 375 ml  [LA FAVORITA]    ⌄ ║   13px hueso-500 + badges + afordance
║ ────────────────────────────────────  ║   .seam (junta de tablón)
║  Aguardiente Antioqueño   $100.000  ║
║  Botella · 750 ml  [COMPARTIR]      ║
║ ────────────────────────────────────  ║
║  ...                                 ║
╠══════════════════════════════════════╣
║          ═══ ⌒ ═══                   ║   HorseshoeRule (1 de 3 en total)
╠══════════════════════════════════════╣
║        B I E N   F R Í A            ║
║           ...                        ║
╚══════════════════════════════════════╝
                                    (⌒)  ← herradura flotante, 56px
                                          bottom+safe, right 16
```

---

## 4. Navegación: la barra de categorías

Es el componente que más se usa y el que más fácil se hace mal.

### 4.1 Comportamiento

| Evento | Respuesta |
|---|---|
| La página carga en la portada | La barra **no** se ve (está debajo del hero) |
| El usuario pasa la portada | La barra se pega arriba y se queda. Sin animación de entrada: `sticky` puro |
| `scrollY > 8` | Aparece `--sh-raised` en la barra, transición de 160 ms. Da la sensación de que la tabla se despega |
| Scroll vertical | El chip de la sección visible se activa. La barra hace scroll horizontal para centrarlo |
| Toque en un chip | Ancla nativa. Scroll suave hasta la sección, con `scroll-padding-top` compensando la barra |
| Sección activa cambia | `aria-current="true"` se mueve. Transición de color de 160 ms, sin animación de layout |
| Última sección / pie | El último chip queda activo y se mantiene |

### 4.2 Los cuatro errores que hay que evitar

1. **Centrar el chip moviendo el scroll de la página.** `scrollIntoView` en un elemento dentro de un contenedor horizontal mueve *todos* los ancestros scrolleables. Solución: calcular `scrollLeft` a mano sobre el contenedor.

```ts
function centrarChip(contenedor: HTMLElement, chip: HTMLElement) {
  const objetivo = chip.offsetLeft - contenedor.clientWidth / 2 + chip.clientWidth / 2;
  contenedor.scrollTo({
    left: Math.max(0, objetivo),
    behavior: reducedMotion ? 'auto' : 'smooth',
  });
}
```

2. **Parpadeo del chip activo entre dos secciones.** Se resuelve con el `rootMargin` de `-55%` en la parte inferior del observador (ver [`07 §7.1`](./07-catalogo-de-componentes.md#71-useactivesection)).

3. **El ancla deja el título tapado por la barra.** `scroll-padding-top` en `html` + `scroll-margin-top` en cada `<section>`. Los dos, porque el navegador usa uno u otro según cómo se dispare el scroll.

4. **La barra tapa contenido en pantallas cortas.** El pie lleva padding inferior generoso, y las secciones llevan `scroll-margin-top`. Se verifica en un iPhone SE (667 px de alto), que es el peor caso real.

### 4.3 Sin JavaScript

La barra **funciona sin JS**: los chips son anclas reales. Se pierde el resaltado automático del chip activo, nada más. Es la degradación correcta.

---

## 5. El bottom sheet de producto

### 5.1 Cuándo aparece la afordance

Solo en productos con `relato`. Son **4 de 26**. Que la mayoría de las filas no sean tocables es una decisión, no una carencia: elimina la duda de "¿esto se toca o no?" porque las que se tocan lo dicen con el chevron y la palabra "leer".

### 5.2 Anatomía de la interacción

| Fase | Detalle |
|---|---|
| **Antes** | La fila muestra `⌄ leer` en `--t-meta`, `hueso-500` |
| **`:active`** | La fila se hunde: `scale(.99)` + `background` con `madera-600` al 40 %, 90 ms |
| **Apertura** | Backdrop `opacity 0→1` en 240 ms. Panel `translateY(100%)→0` en 320 ms con `--e-spring` |
| **Abierto** | Scroll de fondo bloqueado. Foco en el panel. `Escape` cierra |
| **Arrastre** | Sigue el dedo 1:1. Si se suelta por debajo del 40 % de la altura o con velocidad hacia abajo, cierra; si no, vuelve con `--e-spring` |
| **Cierre** | Panel `→ translateY(100%)` en 240 ms `--e-out`. Foco de vuelta al disparador |

### 5.3 Qué NO hace el sheet

- No tiene formulario, ni cantidad, ni "agregar al pedido". **No hay pedido.** La carta informa; el mesero atiende. Meter un carrito falso sería mentirle al usuario.
- No encadena a otro sheet.
- No tiene scroll interno propio salvo que el contenido lo exija (con 220 caracteres de relato, no lo exige en ninguna pantalla desde 667 px de alto).
- No cubre toda la pantalla. Deja ver ~15 % de la carta arriba, para que nadie se sienta perdido.

---

## 6. La Ruleta del Azabache

La idea que propongo como diferenciador. Vale la pena explicar el razonamiento porque es lo único que no es "una carta bien hecha".

### 6.1 Por qué existe

En una fonda, a las dos horas de estar sentado, el problema no es *no saber qué hay*: es **no poder decidir**. Es un momento social, alguien dice "pida cualquier cosa" y nadie se anima. Un selector aleatorio con voz de marca:

- Resuelve un problema real de decisión.
- Es un objeto social: se le muestra al de al lado, se repite, se comenta.
- Es coherente con "azabache" como amuleto: **la casa le echa la suerte**.
- Cuesta **~2 KB** de JavaScript, cargados solo si se usa.

Ese es el balance que se pidió: máximo impacto de diseño, mínimo peso.

### 6.2 Secuencia detallada

```
  t=0ms      Toque en la herradura flotante
             ↓ vibración de 8ms
  t=0        Sheet abre (320ms, --e-spring)
             Sello visible, vacío, con la herradura girando lentamente
  t=320      Empieza el barajeo
             ┌──────────────────────────────┐
             │  ...Ron Medellín 8 años...   │  cambia cada 90ms
             │  ...Guaro sour...            │  opacity 0.65, blur(0.4px)
             │  ...Vino tinto de la casa... │  7 iteraciones
             └──────────────────────────────┘
  t=1020     RESULTADO
             ↓ vibración de 12ms
             Nombre: scale(1.06) → 1 en 240ms
             Destello: --sh-ember de 0 → 0.5 → 0 en 400ms
             ┌──────────────────────────────┐
             │      ╭─────────╮             │
             │      │    ⌒    │  ← Sello    │
             │      │ EL AZABACHE ELIGIÓ    │
             │      ╰─────────╯             │
             │                              │
             │      Canelazo    $100.000    │
             │  Agua de panela caliente,    │
             │  canela y aguardiente.       │
             │        De la casa            │
             │                              │
             │  [ Otra vez ] [Ver en carta] │
             └──────────────────────────────┘
```

### 6.3 Reglas de la lógica

```ts
// hooks/useRandomItem.ts — esencia
function elegir(items: ItemConCategoria[], anterior: string | null) {
  const candidatos = items.filter(
    (i) => i.disponible !== false && i.id !== anterior,
  );
  return candidatos[Math.floor(Math.random() * candidatos.length)]!;
}
```

- Nunca elige agotados.
- Nunca repite el inmediatamente anterior. Que "Otra vez" devuelva lo mismo mata la magia al primer intento.
- Con `prefers-reduced-motion`: sin barajeo, sin destello, sin vibración. Resultado directo. Sigue funcionando perfecto.

### 6.4 "Ver en la carta"

1. Cierra el sheet (240 ms).
2. `location.hash = '#' + categoriaId` → scroll suave nativo.
3. La fila del producto recibe `destacado` durante **3 segundos**: borde `candela-400` + `--sh-ember`, con `transition` de entrada de 240 ms y de salida de 600 ms.
4. El resaltado se quita solo. No queda estado pegado.

El resaltado temporal es importante: sin él, el usuario llega a la sección y tiene que buscar el producto entre cinco. Con él, lo ve de una.

---

## 7. Micro-interacciones

Cada una justificada, o no está.

| # | Interacción | Especificación | Por qué |
|---|---|---|---|
| 1 | **Toque en fila** | `scale(.99)` + fondo `madera-600` al 40 %, 90 ms | Confirma el toque antes de que abra el sheet. Sin esto, la app "no responde" durante 300 ms |
| 2 | **Toque en botón** | `scale(.97)` + `brightness(1.08)`, 90 ms | Igual |
| 3 | **Chip activo** | `color` + `background` + `box-shadow`, 160 ms | Comunica el cambio sin ser un salto brusco |
| 4 | **Barra al hacer scroll** | Aparece `--sh-raised` sobre `scrollY > 8`, 160 ms | Separa la barra del contenido cuando hay algo debajo |
| 5 | **Copiar wifi** | El texto del botón pasa a "Copiada" durante 2 s | Confirmación textual, no un toast. Menos JS, más claro |
| 6 | **Foco de teclado** | Anillo de latón de 2 px, offset 3, instantáneo | Accesibilidad. Sin transición para que no parezca lento |

**No implementadas a propósito:** hover (no existe en móvil), ripple material (no es el lenguaje de esta marca), toasts (nada que notificar), pull-to-refresh (no hay datos que refrescar), skeletons (todo llega en el HTML), scroll infinito, parallax.

---

## 8. Inventario de animaciones

**Seis. En toda la aplicación.** Este inventario es el contrato contra el abuso de animación. Añadir una séptima requiere justificarla en el PR.

| # | Nombre | Elemento | Duración | Repite | Propiedades |
|---|---|---|---|---|---|
| 1 | `mecer-letrero` | Letrero de la portada | 7 s | ∞ alterna | `rotate` ±0.5° |
| 2 | `revelar` | Cabeceras de sección | 420 ms | 1 vez | `opacity`, `translateY` |
| 3 | `sheet-entrar` | Bottom sheet | 320 ms | por apertura | `translateY` |
| 4 | `backdrop-entrar` | Fondo del sheet | 240 ms | por apertura | `opacity` |
| 5 | `barajear` | Nombre en la Ruleta | 90 ms × 7 | por giro | `opacity` (cambio de texto) |
| 6 | `destello-brasa` | Resultado de la Ruleta | 400 ms | por giro | `box-shadow`\* |

\* Es la única animación de `box-shadow` permitida, y se justifica: dura 400 ms, ocurre sobre un elemento pequeño, en un overlay donde no hay scroll simultáneo, y es el momento culminante de la interacción. Fuera de este caso, `box-shadow` no se anima.

`src/styles/animations.css`:

```css
@keyframes mecer-letrero {
  from { rotate: -0.5deg; }
  to   { rotate: 0.5deg; }
}

@keyframes revelar {
  from { opacity: 0; translate: 0 10px; }
  to   { opacity: 1; translate: 0 0; }
}

@keyframes destello-brasa {
  0%   { box-shadow: 0 0 0 rgba(224, 117, 47, 0); }
  35%  { box-shadow: 0 0 26px rgba(224, 117, 47, 0.5); }
  100% { box-shadow: 0 0 14px rgba(224, 117, 47, 0.22); }
}

/* El letrero solo se mece si está en pantalla */
.letrero {
  animation: mecer-letrero 7s var(--e-inout) infinite alternate;
  transform-origin: top center;
  will-change: rotate;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

> **Nota sobre `will-change`.** Solo se usa en el letrero, que es el único elemento con animación continua. Ponerlo en todo lo demás crea capas de composición innecesarias que consumen memoria de GPU en gama baja.

---

## 9. Estados de la aplicación

Una carta estática tiene menos estados que una app, pero los que tiene hay que resolverlos.

| Estado | Cuándo | Qué se ve |
|---|---|---|
| **Carga** | Primer paint | El fondo de madera y el HTML ya están. **No hay skeleton.** El texto aparece con las fuentes de respaldo y cambia sin salto perceptible gracias a `adjustFontFallback` |
| **Sin fuentes** | Fuente falla o red muy lenta | Georgia + system-ui, con métricas ajustadas. Se ve distinto, se lee igual |
| **Sin AVIF** | Navegador antiguo | `image-set` cae a WebP; si tampoco, el fondo se queda con los degradados. Se ve bien |
| **Sin JS** | JS bloqueado o falla | Carta completa y legible. Anclas funcionando. Se pierde: chip activo automático, sheets, Ruleta. Los 7 relatos quedan invisibles — **aceptado**, son contenido de disfrute, no informativo |
| **Producto agotado** | `disponible: false` | Fila al 55 %, precio tachado, "Hoy no hay" |
| **Offline (revisita)** | Sin conexión | Ver §10 |
| **404** | URL errada | `not-found.tsx` con voz de marca: *"Ese plato no está en la carta"* + botón "Ver la carta" |

---

## 10. Sobre offline y PWA

**Decisión: `manifest.webmanifest` sí, service worker no.** Al menos no en la versión 1.

- El **manifest** cuesta 400 bytes y da: icono decente si alguien guarda el enlace en la pantalla de inicio, `theme-color` para que la barra del navegador quede en madera, y `display: 'standalone'`. Todo ganancia.
- Un **service worker** añade complejidad de invalidación de caché justo en lo que más cambia: los precios. El escenario de "un cliente ve un precio viejo cacheado" es peor que el de "un cliente sin señal no ve la carta". Y el caso de uso es una visita única desde un QR: no hay revisita que aprovechar.

**Cuándo reconsiderarlo:** si se mide que hay clientes habituales que abren la carta varias veces por semana, entraría un service worker con estrategia **network-first** y caché solo de fuentes y texturas (los recursos inmutables con hash), nunca del HTML.

---

## 11. Accesibilidad de las interacciones

| Requisito | Cómo se cumple |
|---|---|
| Todo alcanzable con teclado | Chips y filas son `<a>`/`<button>` reales. Orden del DOM = orden visual |
| Foco siempre visible | `:focus-visible` con anillo de latón, nunca `outline: none` sin reemplazo |
| Foco atrapado en el sheet | `vaul` + verificación manual en QA |
| Foco devuelto al cerrar | Al disparador exacto |
| Anuncio del chip activo | `aria-current="true"` |
| Cambio de resultado en la Ruleta | `aria-live="polite"` en el contenedor del resultado, para que el lector lo anuncie sin interrumpir |
| Barajeo no marea al lector | El área de barajeo es `aria-hidden` durante la fase; solo el resultado final se anuncia |
| Sin dependencia de gestos | Todo lo que se hace con arrastre se puede hacer con un botón |
| Sin dependencia del color | Los badges llevan texto, no solo color. "Agotado" lleva texto además de opacidad |
| Zoom hasta 200 % | Sin `maximum-scale`. Verificado: a 200 % la carta sigue usable, con scroll horizontal solo en la barra de chips |
| Movimiento reducido | Las 6 animaciones respetan `prefers-reduced-motion` |

Checklist completo de verificación en [`09 §4`](./09-rendimiento-accesibilidad-seo.md#4-accesibilidad).
