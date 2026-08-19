# 11 · QA, Deploy y Operación

## 1. Matriz de dispositivos

Se prueba en **dispositivos reales**. El emulador de DevTools no reproduce densidad de píxeles, rendimiento de GPU, el comportamiento de la barra de Safari, ni cómo se ve realmente una textura de madera en una pantalla OLED a 40 % de brillo.

| Dispositivo | Por qué está en la lista | Qué se busca |
|---|---|---|
| **iPhone SE (2.ª/3.ª gen)** · 375×667 | El viewport más corto que existe en uso real | Que la barra sticky no coma media pantalla. Que el sheet quepa |
| **iPhone 14/15** · 390×844 | El objetivo de diseño | Referencia. Todo perfecto acá |
| **iPhone con isla dinámica** · 393×852 | Safe areas | `env(safe-area-inset-*)` bien aplicado arriba y abajo |
| **Android gama media** (Moto G, Redmi Note) | **El más importante:** es lo que más se ve en una fonda | FPS en el scroll, tiempo de pintado del grano, LCP real |
| **Android gama alta** (Pixel, Galaxy S) | Chrome más nuevo | Que AVIF, `content-visibility` y `color-mix` funcionen |
| **Tablet o pantalla > 520 px** | Alguien va a abrirla ahí | Que la columna se centre y no se estire feo |

### 1.1 Condiciones de la prueba

No se prueba con Wi-Fi de oficina y brillo al 100 %. Se reproduce el escenario real:

- [ ] **Brillo al 40 %**, en una habitación con poca luz
- [ ] **Datos móviles**, no Wi-Fi. Idealmente **dentro del local**
- [ ] Sosteniendo el celular **con una mano**, sentado
- [ ] Escaneando **el QR impreso**, no pegando la URL
- [ ] Al menos una prueba **con el teléfono de otra persona**, sin explicarle nada, y observando dónde duda

La última es la que más enseña. Si alguien no encuentra los aguardientes en 10 segundos, el problema es del diseño, no de la persona.

---

## 2. Checklist funcional

### 2.1 Portada

- [ ] El wordmark se ve nítido, sin pixelar, en pantalla de 3x
- [ ] El letrero se mece de forma **apenas perceptible**. Si se nota, está mal: bajar a ±0.4°
- [ ] El letrero deja de mecerse al salir del viewport
- [ ] El lema quemado se lee sin esfuerzo con brillo al 40 %
- [ ] El CTA "Ver la carta" es lo más obvio de la pantalla
- [ ] La portada no supera `100dvh`: no queda un pedazo de la barra asomando raro
- [ ] Con la barra de Safari visible y oculta, el encuadre se mantiene

### 2.2 Barra de categorías

- [ ] Se pega arriba al pasar la portada, sin salto
- [ ] Los 6 chips hacen scroll horizontal suave, con el último cortado a la derecha
- [ ] El desvanecido del borde derecho indica que hay más
- [ ] Tocar un chip deja el título de la sección **totalmente visible**
- [ ] El chip activo cambia al hacer scroll, **sin parpadear** entre secciones
- [ ] Centrar el chip **no mueve el scroll vertical de la página** ← el bug más común
- [ ] La sombra de la barra aparece solo cuando hay contenido debajo
- [ ] La última sección activa el último chip (y no se queda en el penúltimo)

### 2.3 Filas de producto

- [ ] Nombre y precio alineados por línea base, se leen como una unidad
- [ ] Los precios están **alineados en columna** (cifras tabulares funcionando)
- [ ] Ningún precio se parte en dos líneas
- [ ] Ningún nombre largo empuja el precio fuera de pantalla
- [ ] Las 4 filas con relato muestran el chevron y "leer"; las otras 22 **no parecen tocables**
- [ ] Tocar una fila da feedback en menos de 100 ms
- [ ] "Macallan 12 años" se ve atenuado, tachado y con "Hoy no hay"
- [ ] Los badges no pasan de 2 por fila y no rompen el layout

### 2.4 Bottom sheet

- [ ] Abre con arrastre suave, sin tirones
- [ ] Deja ver ~15 % de la carta arriba
- [ ] El arrastre sigue el dedo 1:1
- [ ] Suelta al 30 % → vuelve a su sitio. Al 50 % → cierra
- [ ] Cierra con el backdrop, con `Escape` y con el botón
- [ ] El scroll de fondo está bloqueado y **al cerrar la página no salta**
- [ ] Los relacionados llevan a su sección y cierran el sheet
- [ ] En iPhone SE el contenido cabe sin scroll interno
- [ ] `padding-bottom` respeta la safe area (no queda tapado por la barra de gestos)

### 2.5 La Ruleta del Azabache

- [ ] El botón aparece solo después de pasar la portada
- [ ] No tapa nada importante en el pie
- [ ] El tooltip de primera vez sale una sola vez por sesión
- [ ] El barajeo dura ~700 ms y se lee como "estoy eligiendo", no como un glitch
- [ ] El sello de lacre se ve como lacre, no como un círculo rojo
- [ ] "Otra vez" 15 veces: **nunca** repite el inmediato anterior, **nunca** sale un agotado
- [ ] "Ver en la carta" salta a la sección correcta y resalta la fila 3 s
- [ ] El resaltado desaparece solo
- [ ] La vibración es apenas un toque, no un zumbido

### 2.6 Pie

- [ ] Los horarios se leen claros, con "Lunes: Cerrado" incluido
- [ ] **La clave del wifi se puede seleccionar y copiar**
- [ ] El botón "Copiar" da feedback textual durante 2 s
- [ ] El cancionero abre y cierra sin salto brusco
- [ ] Los 3 botones de redes abren correctamente (WhatsApp abre la app, no la web)
- [ ] El aviso de Ley 30 de 1986 está presente y **legible** (no gris sobre gris)
- [ ] El botón de la Ruleta no tapa los avisos legales
- [ ] La silueta del caballo se intuye, no se mira

---

## 3. Pruebas automatizadas

Deliberadamente pocas y bien elegidas. En un proyecto de esta escala, 200 tests son deuda, no seguridad.

### 3.1 Unitarios (Vitest)

Solo lo que tiene lógica de verdad:

```
tests/unit/
├── format.test.ts     ← formatCOP: el $ pegado, los miles con punto, sin decimales
├── content.test.ts    ← la carta pasa el esquema; ids únicos; refs de vaBienCon válidas
└── ruleta.test.ts     ← no repite el anterior; no elige agotados; cubre todo el catálogo
```

`ruleta.test.ts` merece atención:

```ts
it('nunca repite el anterior', () => {
  let anterior: string | null = null;
  for (let i = 0; i < 200; i++) {
    const elegido = elegir(todosLosItems, anterior);
    expect(elegido.id).not.toBe(anterior);
    anterior = elegido.id;
  }
});

it('nunca elige agotados', () => {
  for (let i = 0; i < 500; i++) {
    expect(elegir(todosLosItems, null).disponible).not.toBe(false);
  }
});
```

**No se testean** los componentes de presentación. Un test que verifica que `MenuItemRow` renderiza el nombre del producto no atrapa ningún bug real y hay que mantenerlo en cada cambio de diseño. Lo que sí protege el diseño es el smoke test visual.

### 3.2 E2E (Playwright)

Un solo archivo, viewport móvil, cinco escenarios:

```ts
// tests/e2e/carta.spec.ts
test.use({ ...devices['iPhone 14'] });

test('la carta carga y se navega', async ({ page }) => { /* portada → chip → sección visible */ });
test('el sheet abre y cierra', async ({ page }) => { /* incluye foco devuelto */ });
test('la ruleta entrega un resultado', async ({ page }) => { /* y "Ver en la carta" navega */ });
test('sin violaciones de accesibilidad', async ({ page }) => { /* axe, con y sin sheet abierto */ });
test('sin JavaScript la carta se lee', async ({ browser }) => { /* javaScriptEnabled: false */ });
```

El último es el más valioso de los cinco: verifica que la decisión arquitectónica de RSC sigue en pie después de meses de cambios.

### 3.3 Regresión visual

Snapshots de Playwright en 3 puntos: portada, primera sección, sheet abierto. En 2 viewports (375 y 390).

```ts
await expect(page).toHaveScreenshot('portada-390.png', { maxDiffPixelRatio: 0.01 });
```

Con `maxDiffPixelRatio: 0.01` para tolerar el ruido del grano. **Los snapshots se regeneran a propósito cuando el diseño cambia**, y el diff se revisa en el PR. Es la única forma de que "una IA en serio hizo esto" siga siendo cierto después de veinte cambios de precio.

---

## 4. Deploy

### 4.1 Opciones, en orden de recomendación

| Opción | Ventaja | Por qué |
|---|---|---|
| **Cloudflare Pages** | Red más amplia en Latinoamérica, ancho de banda ilimitado, gratis | **Recomendada.** El usuario está en Medellín; el POP más cercano importa más que cualquier otra cosa |
| **Vercel** | Deploy más simple con Next, previews por PR | Buena opción si ya se usa. `output: 'export'` funciona igual |
| **Netlify** | Equivalente | |
| **S3 + CloudFront** | Control total | Solo si hay requisito de infraestructura propia |

Con `output: 'export'` el resultado es una carpeta `out/` de archivos planos. **No hay lock-in:** cambiar de proveedor es subir una carpeta a otro lado.

### 4.2 Configuración

```
Build command:      pnpm build
Output directory:   out
Node version:       20
Install command:    pnpm install --frozen-lockfile
```

### 4.3 Cabeceras (`public/_headers` para Cloudflare/Netlify)

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/textures/*
  Cache-Control: public, max-age=31536000, immutable

/
  Cache-Control: public, max-age=0, must-revalidate
```

Notas sobre la CSP:

- `'unsafe-inline'` en `style-src` es necesario porque Next inlinea estilos críticos y los CSS Modules generan atributos `style` para las variables calculadas. Se puede eliminar con nonces, pero con export estático no hay servidor que los genere. **Riesgo aceptado y documentado:** el sitio no tiene entradas de usuario, no hay superficie de inyección.
- `script-src 'self'` sin `unsafe-inline` ni `unsafe-eval`: no hay scripts de terceros, y eso hay que **mantenerlo** así.
- `form-action 'none'`: no hay formularios. Si algún día se añade uno, esta línea hay que cambiarla, y ese es justamente el punto: obliga a pensarlo.
- `frame-ancestors 'none'`: nadie puede embeber la carta en un iframe.

### 4.4 Dominio

`carta.fondaazabache.co` — subdominio corto y legible. Va en el QR, así que **cada carácter cuenta**: menos caracteres = menos módulos = mejor escaneo (ver [`09 §5.3`](./09-rendimiento-accesibilidad-seo.md#53-el-qr)).

- [ ] HTTPS con redirección forzada
- [ ] HSTS activo
- [ ] Redirección de `www` y de la raíz si aplica

---

## 5. El QR

```ts
// scripts/generate-qr.ts
import QRCode from 'qrcode';
import { writeFileSync } from 'node:fs';

const svg = await QRCode.toString('https://carta.fondaazabache.co', {
  type: 'svg',
  errorCorrectionLevel: 'Q',   // 25 % de tolerancia a daño
  margin: 4,                    // quiet zone: obligatoria
  color: { dark: '#000000', light: '#FFFFFF' },  // máximo contraste. No negociable
});

writeFileSync('out-assets/qr-mesa.svg', svg);
```

### Impresión

- [ ] Tamaño mínimo **3 × 3 cm**. Para una mesa alta, 4 cm
- [ ] Sobre **fondo claro**, con quiet zone blanca respetada
- [ ] Impreso en material mate: el brillo del laminado arruina el escaneo bajo una bombilla
- [ ] Con el texto **"Escanee la carta"** debajo. No hace falta explicar más
- [ ] Se puede poner la herradura en el centro (≤ 8 % del área)
- [ ] **Los módulos van en negro.** Un QR café sobre madera se ve más bonito en la foto y falla en la mesa. No vale la pena

### Prueba obligatoria antes de imprimir 40 copias

- [ ] 5 teléfonos distintos, incluido uno de gama baja con cámara mediocre
- [ ] A 40 cm de distancia
- [ ] Con luz tenue, la del local
- [ ] Con el teléfono ligeramente inclinado
- [ ] Escanea a la primera en los 5

Si falla en uno, se agranda el QR antes de imprimir. Este es el punto de falla más caro de todo el proyecto: si el QR no escanea, nada de lo demás existe.

---

## 6. Operación

### 6.1 Cambio de precios (el proceso más frecuente)

```
1. Rama:     git checkout -b content/precios-marzo
2. Editar:   src/content/menu/<archivo>.ts
3. Commit:   content(menu): actualiza precios de aguardientes
4. Push  →   CI: content:check + lint + test + build + lighthouse
5. Verde →   merge a main  →  deploy automático
```

**Menos de dos minutos.** Y con historial: siempre se puede responder "¿cuánto costaba esto en enero?".

### 6.2 Antes de cada release

- [ ] `pnpm content:check` en verde
- [ ] Los precios confirmados con el negocio (no con la memoria de alguien)
- [ ] Lighthouse en verde
- [ ] Revisión visual en un celular real, no solo en DevTools
- [ ] Si cambió algo visual: snapshots regenerados y diff revisado

### 6.3 Mantenimiento periódico

| Cadencia | Tarea |
|---|---|
| Semanal | Revisar precios y disponibilidad con el negocio |
| Mensual | Actualizar dependencias (PR agrupado de Renovate). Correr Lighthouse |
| Trimestral | Revisar el QR impreso: si está rayado o desgastado, reimprimir |
| Trimestral | Rotar la sección de temporada (diciembre: espumosos, edición limitada) |
| Semestral | Revisar el cancionero con el equipo de la barra |
| Anual | Auditoría de accesibilidad completa, incluida la manual con lector de pantalla |

### 6.4 Qué hacer si algo se rompe

| Síntoma | Primer diagnóstico |
|---|---|
| El fondo se ve plano | El AVIF no cargó. Revisar la ruta y el `image-set` |
| Los títulos se ven de un solo color | El `@supports` cayó al fallback. Revisar el navegador y el orden de las declaraciones |
| Los precios salen sin `$` o con otra fuente | El subset perdió `U+20A0-20BF`. Regenerar las fuentes |
| El chip activo parpadea | El `rootMargin` de `useActiveSection` quedó mal. Revisar el `-55%` |
| La página salta al centrar un chip | Se está usando `scrollIntoView`. Cambiar a `scrollTo` sobre el contenedor |
| El scroll da tirones | `contain-intrinsic-size` muy alejado de la altura real. Recalibrar |
| Los precios están desalineados | Falta `font-variant-numeric: tabular-nums` o el subset perdió `tnum` |
| El sheet deja la página desplazada al cerrar | El scroll-lock no restauró la posición. Revisar `vaul` y su versión |
| El QR no escanea | Tamaño, contraste, quiet zone o brillo del material. En ese orden |

---

## 7. Definición de "terminado"

Una tarea está terminada cuando:

1. Funciona en **iPhone SE, iPhone 14 y un Android de gama media reales**
2. `pnpm lint` y `pnpm test` en verde
3. Lighthouse sigue en los umbrales
4. Cero violaciones de `axe`
5. Funciona con `prefers-reduced-motion: reduce`
6. Funciona con el zoom al 200 %
7. Si es contenido: **confirmado con el negocio**
8. Si es visual: revisado **en escala de grises** (la prueba que más revela)
9. La documentación en `docs/` refleja el estado real del código

El punto 9 es el que mantiene este proyecto vivo. Un `docs/` desactualizado es peor que no tener documentación, porque genera confianza falsa. **Si el código cambia y el doc no, el PR no está terminado.**
