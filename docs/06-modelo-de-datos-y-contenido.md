# 06 · Modelo de Datos y Contenido

> **Alcance del negocio (actualizado):** Fonda Azabache solo vende **licores y bebidas**. No hay cocina, no hay platos, no hay fotos de producto (no se cuenta con el equipo para producirlas). Todo el mock de este documento refleja eso.
>
> **Precios mock:** mientras no se confirme la lista real de precios con el negocio, **todos los productos muestran `$100.000`**. Es un valor de relleno deliberado y visible como tal (no es una tarifa real), pensado para validar el diseño de la columna de precios sin comprometerse a cifras que luego haya que corregir una por una. Antes de publicar, cada precio se reemplaza por el real.

## 1. Tipos del dominio

`src/types/menu.ts` — sin dependencias, sin Zod, importable desde cualquier parte.

```ts
/** Etiquetas visibles como badge en la fila del producto. */
export type ItemTag =
  | 'casa'          // De la casa. Sello de vino
  | 'favorita'      // La favorita. Sello de latón
  | 'picante'       // Michelada con ají, etc.
  | 'sin-alcohol'   // 0%. Badge musgo, reutiliza el verde antes pensado para "vegetariano"
  | 'compartir'     // Botella o jarra para 2 o más
  | 'fuerte'        // Trago cargado / alta graduación
  | 'temporada';    // Diciembre, edición limitada...

/** Un producto de la carta. */
export interface MenuItem {
  /** Identificador estable e inmutable. Nunca se recicla. */
  id: string;
  nombre: string;
  /** Máximo 12 palabras. Ingredientes reales, cero adjetivos de folleto. */
  descripcion?: string;
  /** Pesos colombianos, entero, sin decimales. Se escribe con `_`: 24_000 */
  precio: number;
  /** Presentación cuando aplica: "Botella 750 ml", "Media", "Copa 5 oz" */
  volumen?: string;
  etiquetas?: ItemTag[];
  /** `false` muestra la fila atenuada con "Hoy no hay". Por defecto true. */
  disponible?: boolean;
  /**
   * Relato corto (1–2 frases) que se muestra en el bottom sheet.
   * Solo los productos con historia lo tienen: es lo que distingue
   * la fonda de una carta cualquiera. Su presencia habilita el sheet.
   */
  relato?: string;
  /** "Va bien con": ids de otros productos. Máximo 2. */
  vaBienCon?: string[];
}

/** Una sección de la carta. */
export interface MenuCategory {
  /** Ancla de la URL y del chip de navegación. kebab-case, estable. */
  id: string;
  /** Nombre con voz de fonda. Va quemado. Ej: "De la olla" */
  titulo: string;
  /** Subtítulo literal, en mayúsculas pequeñas. Ej: "Platos fuertes" */
  subtitulo: string;
  /** Texto corto del chip. Puede ser más breve que el título. */
  chip: string;
  /** Nota opcional bajo el título. Ej: "Todo se sirve con arepa." */
  nota?: string;
  items: MenuItem[];
}

export type Menu = MenuCategory[];
```

**Decisiones del modelo, y por qué:**

- **`precio` es número, no string.** Permite formateo consistente, ordenar y calcular. La presentación (`$62.000`) es responsabilidad de la vista, siempre.
- **`relato` es opcional y es lo que habilita el bottom sheet.** Así el sheet no es un molde vacío: solo se abre donde hay algo que contar. Regla: **máximo 8 productos con relato en toda la carta**. Si todo tiene historia, nada tiene historia.
- **`disponible` es opcional con default `true`.** Se escribe solo la excepción; el archivo de contenido queda limpio.
- **No hay campo `imagen`.** Decisión de diseño, no omisión. Ver [`03`](./03-texturas-y-efectos.md#9-lo-que-se-evaluó-y-se-descartó).
- **No hay `orden` numérico.** El orden es el del arreglo. Reordenar es mover líneas, no renumerar. Menos errores.

---

## 2. Validación con Zod

`src/lib/schemas.ts` — importado **solo** por `scripts/validate-content.ts` y por los tests (ADR-005).

```ts
import { z } from 'zod';

export const itemTagSchema = z.enum([
  'casa', 'favorita', 'picante', 'sin-alcohol', 'compartir', 'fuerte', 'temporada',
]);

export const menuItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'id debe ser kebab-case'),
  nombre: z.string().min(3).max(48),
  descripcion: z.string().max(90).optional()
    .refine((d) => !d || d.split(/\s+/).length <= 14, 'descripción: máximo 14 palabras'),
  precio: z.number().int().positive().max(2_000_000)
    .refine((p) => p % 500 === 0, 'los precios van en múltiplos de 500'),
  volumen: z.string().max(24).optional(),
  etiquetas: z.array(itemTagSchema).max(2, 'máximo 2 etiquetas por producto').optional(),
  disponible: z.boolean().optional(),
  relato: z.string().min(20).max(220).optional(),
  vaBienCon: z.array(z.string()).max(2).optional(),
});

export const menuCategorySchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  titulo: z.string().min(3).max(24),
  subtitulo: z.string().min(3).max(28),
  chip: z.string().min(2).max(14, 'el chip debe caber en la barra'),
  nota: z.string().max(70).optional(),
  items: z.array(menuItemSchema).min(2).max(9, 'más de 9 productos por sección abruma'),
});

export const menuSchema = z.array(menuCategorySchema)
  .min(1)
  .max(9, 'más de 9 categorías no caben cómodas en la barra');
```

**Los límites no son caprichos: son el diseño hecho código.**

| Regla | Razón de diseño |
|---|---|
| `chip` ≤ 14 caracteres | Cabe en la barra sin partirse |
| `etiquetas` ≤ 2 | Tres badges en una fila de 358 px se ven como un bazar |
| `items` entre 2 y 9 | Una sección de un solo producto se ve rota; de doce, agobia |
| `precio % 500 === 0` | Nadie cobra $23.780. Atrapa errores de tipeo |
| descripción ≤ 14 palabras | R3: se lee con trago encima |
| `relato` ≤ 220 caracteres | Cabe en el sheet sin scroll |

### El validador

```ts
// scripts/validate-content.ts
import { menu } from '../src/content/menu';
import { menuSchema } from '../src/lib/schemas';

const result = menuSchema.safeParse(menu);

if (!result.success) {
  console.error('\n✖ La carta no pasó la validación:\n');
  for (const issue of result.error.issues) {
    console.error(`  · ${issue.path.join('.')} → ${issue.message}`);
  }
  process.exit(1);
}

// Invariantes que Zod no expresa bien
const ids = menu.flatMap((c) => c.items.map((i) => i.id));
const duplicados = ids.filter((id, i) => ids.indexOf(id) !== i);
if (duplicados.length) {
  console.error(`✖ IDs de producto duplicados: ${[...new Set(duplicados)].join(', ')}`);
  process.exit(1);
}

const conRelato = menu.flatMap((c) => c.items).filter((i) => i.relato).length;
if (conRelato > 8) {
  console.error(`✖ ${conRelato} productos con relato. El máximo es 8 (ver docs/06 §1).`);
  process.exit(1);
}

const idsSet = new Set(ids);
for (const item of menu.flatMap((c) => c.items)) {
  for (const ref of item.vaBienCon ?? []) {
    if (!idsSet.has(ref)) {
      console.error(`✖ "${item.id}".vaBienCon apunta a "${ref}", que no existe.`);
      process.exit(1);
    }
  }
}

console.log(`✔ Carta válida: ${menu.length} secciones, ${ids.length} productos.`);
```

---

## 3. Formateo de precios

`src/lib/format.ts`:

```ts
/**
 * Formatea pesos colombianos: 62000 → "$62.000".
 * Sin decimales (nadie cobra centavos) y con punto de miles, como se usa en Colombia.
 * Se construye una sola vez el Intl.NumberFormat: instanciarlo por llamada
 * cuesta ~0.1 ms y son 30+ llamadas por render.
 */
const cop = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCOP(valor: number): string {
  // Intl produce "$ 62.000" con espacio duro en algunos runtimes: se normaliza.
  return cop.format(valor).replace(/\s|\u00A0/g, '');
}
```

Test que acompaña (`tests/unit/format.test.ts`):

```ts
expect(formatCOP(62_000)).toBe('$62.000');
expect(formatCOP(8_500)).toBe('$8.500');
expect(formatCOP(180_000)).toBe('$180.000');
```

> Se normaliza el espacio porque el resultado de `Intl` varía entre Node y navegadores, y una carta donde el precio se ve `$ 62.000` en Android y `$62.000` en iOS es un detalle que sí se nota.

---

## 4. La carta (mock completo)

**Solo licores y bebidas.** Fonda Azabache no vende comida: es una fonda de trago, cerveza y bebidas sin alcohol. No hay sección de cocina ni de postres.

**Precio mock: `100_000` en todos los productos**, a propósito y sin excepción. Es un valor de relleno visible: el objetivo de este mock es validar el diseño de la fila (alineación, tipografía, columna de precios), no simular una lista de precios real. Cuando el negocio confirme los precios reales, cada uno se reemplaza — ver la nota al inicio del documento.

**Sin campo `imagen` y sin intención de añadirlo.** No se cuenta con el equipo para producir fotografía de producto, así que esta no es una limitación temporal del mock: es una decisión permanente del proyecto, coherente con [`03 §9`](./03-texturas-y-efectos.md#9-lo-que-se-evaluó-y-se-descartó).

Seis secciones, 3–5 productos cada una.

### `src/content/menu/aguardientes.ts`

```ts
import type { MenuCategory } from '@/types/menu';

const MOCK_PRECIO = 100_000;

export const aguardientes: MenuCategory = {
  id: 'del-estante',
  titulo: 'Del estante',
  subtitulo: 'Aguardientes y rones',
  chip: 'Del estante',
  nota: 'La botella se sirve con mezcladores y hielo.',
  items: [
    {
      id: 'aguardiente-media',
      nombre: 'Aguardiente Antioqueño',
      descripcion: 'El de siempre. Con hielo y limón.',
      precio: MOCK_PRECIO,
      volumen: 'Media · 375 ml',
      etiquetas: ['favorita'],
      relato:
        'En la fonda no se pregunta "cuál aguardiente". Se pregunta "media o botella". Todo lo demás es conversación.',
    },
    {
      id: 'aguardiente-botella',
      nombre: 'Aguardiente Antioqueño',
      precio: MOCK_PRECIO,
      volumen: 'Botella · 750 ml',
      etiquetas: ['compartir'],
    },
    {
      id: 'aguardiente-sin-azucar',
      nombre: 'Aguardiente sin azúcar',
      descripcion: 'Más seco, para el que madruga.',
      precio: MOCK_PRECIO,
      volumen: 'Media · 375 ml',
    },
    {
      id: 'ron-medellin-8',
      nombre: 'Ron Medellín 8 años',
      descripcion: 'Añejo. Derecho o con soda.',
      precio: MOCK_PRECIO,
      volumen: 'Botella · 750 ml',
      etiquetas: ['fuerte'],
    },
    {
      id: 'viejo-de-caldas-trago',
      nombre: 'Viejo de Caldas',
      descripcion: 'Trago servido, sin apuro.',
      precio: MOCK_PRECIO,
      volumen: 'Trago · 2 oz',
    },
  ],
};
```

### `src/content/menu/whisky-y-otros.ts`

```ts
import type { MenuCategory } from '@/types/menu';

const MOCK_PRECIO = 100_000;

export const whiskyYOtros: MenuCategory = {
  id: 'de-fuera',
  titulo: 'De fuera',
  subtitulo: 'Whisky, tequila y vodka',
  chip: 'De fuera',
  nota: 'Se sirven derechos, con hielo o con mezclador. Usted decide.',
  items: [
    {
      id: 'whisky-old-parr',
      nombre: 'Old Parr 12 años',
      descripcion: 'Escocés añejado. Derecho o con soda.',
      precio: MOCK_PRECIO,
      volumen: 'Botella · 750 ml',
      etiquetas: ['favorita'],
    },
    {
      id: 'whisky-buchanans-12',
      nombre: "Buchanan's 12 años",
      precio: MOCK_PRECIO,
      volumen: 'Botella · 750 ml',
      etiquetas: ['compartir'],
    },
    {
      id: 'tequila-jose-cuervo',
      nombre: 'José Cuervo Reposado',
      descripcion: 'Trago derecho, con sal y limón.',
      precio: MOCK_PRECIO,
      volumen: 'Trago · 2 oz',
      etiquetas: ['fuerte'],
    },
    {
      id: 'vodka-absolut',
      nombre: 'Absolut',
      descripcion: 'Solo, con soda o con jugo.',
      precio: MOCK_PRECIO,
      volumen: 'Botella · 700 ml',
    },
    {
      id: 'whisky-macallan-12',
      nombre: 'Macallan 12 años',
      descripcion: 'Edición limitada. Se agotó rápido.',
      precio: MOCK_PRECIO,
      volumen: 'Botella · 750 ml',
      disponible: false,
    },
  ],
};
```

### `src/content/menu/cervezas.ts`

```ts
import type { MenuCategory } from '@/types/menu';

const MOCK_PRECIO = 100_000;

export const cervezas: MenuCategory = {
  id: 'bien-fria',
  titulo: 'Bien fría',
  subtitulo: 'Cervezas',
  chip: 'Bien fría',
  items: [
    {
      id: 'pilsen',
      nombre: 'Pilsen',
      descripcion: 'La de la casa. Bien fría, siempre.',
      precio: MOCK_PRECIO,
      volumen: '330 ml',
      etiquetas: ['favorita'],
    },
    { id: 'poker', nombre: 'Poker', precio: MOCK_PRECIO, volumen: '330 ml' },
    { id: 'aguila-light', nombre: 'Águila Light', precio: MOCK_PRECIO, volumen: '330 ml' },
    {
      id: 'club-colombia-dorada',
      nombre: 'Club Colombia Dorada',
      descripcion: 'Un poco más suave, un poco más elegante.',
      precio: MOCK_PRECIO,
      volumen: '330 ml',
    },
    {
      id: 'artesanal-antioquena',
      nombre: 'Artesanal de la región',
      descripcion: 'Rotativa. Pregunte cuál hay hoy.',
      precio: MOCK_PRECIO,
      volumen: '330 ml',
      etiquetas: ['temporada'],
    },
  ],
};
```

### `src/content/menu/de-la-casa.ts`

```ts
import type { MenuCategory } from '@/types/menu';

const MOCK_PRECIO = 100_000;

export const deLaCasa: MenuCategory = {
  id: 'de-la-casa',
  titulo: 'De la casa',
  subtitulo: 'Cócteles',
  chip: 'De la casa',
  nota: 'Los preparamos uno por uno. Se demoran, pero valen.',
  items: [
    {
      id: 'coctel-azabache',
      nombre: 'Azabache',
      descripcion: 'Aguardiente, maracuyá, hierbabuena y un toque de panela.',
      precio: MOCK_PRECIO,
      volumen: '8 oz',
      etiquetas: ['casa'],
      relato:
        'Negro por fuera, dulce por dentro, y le pega. Como el caballo que nos dio el nombre.',
      vaBienCon: ['guaro-sour'],
    },
    {
      id: 'guaro-sour',
      nombre: 'Guaro sour',
      descripcion: 'Aguardiente, limón, clara y amargo de angostura.',
      precio: MOCK_PRECIO,
      volumen: '6 oz',
      etiquetas: ['fuerte'],
    },
    {
      id: 'canelazo',
      nombre: 'Canelazo',
      descripcion: 'Agua de panela caliente, canela y aguardiente.',
      precio: MOCK_PRECIO,
      volumen: '8 oz',
      relato:
        'Para las noches frías y las conversaciones largas. Se toma despacio o no se toma.',
    },
    {
      id: 'mojito-de-lulo',
      nombre: 'Mojito de lulo',
      descripcion: 'Ron blanco, lulo, hierbabuena y soda.',
      precio: MOCK_PRECIO,
      volumen: '10 oz',
    },
    {
      id: 'michelada-de-la-fonda',
      nombre: 'Michelada de la fonda',
      descripcion: 'Cerveza, limón, sal de ají y un borde que arde.',
      precio: MOCK_PRECIO,
      volumen: '12 oz',
      etiquetas: ['picante'],
    },
  ],
};
```

### `src/content/menu/vinos-y-espumosos.ts`

```ts
import type { MenuCategory } from '@/types/menu';

const MOCK_PRECIO = 100_000;

export const vinosYEspumosos: MenuCategory = {
  id: 'de-la-cava',
  titulo: 'De la cava',
  subtitulo: 'Vinos y espumosos',
  chip: 'De la cava',
  items: [
    {
      id: 'vino-tinto-copa',
      nombre: 'Vino tinto de la casa',
      descripcion: 'Copa. Pregunte la cepa del día.',
      precio: MOCK_PRECIO,
      volumen: 'Copa · 5 oz',
      etiquetas: ['favorita'],
    },
    {
      id: 'vino-tinto-botella',
      nombre: 'Vino tinto de la casa',
      precio: MOCK_PRECIO,
      volumen: 'Botella · 750 ml',
      etiquetas: ['compartir'],
    },
    {
      id: 'espumoso-brut',
      nombre: 'Espumoso Brut',
      descripcion: 'Para celebrar sin salir de la mesa.',
      precio: MOCK_PRECIO,
      volumen: 'Botella · 750 ml',
      etiquetas: ['temporada'],
    },
  ],
};
```

### `src/content/menu/pa-la-sed.ts`

```ts
import type { MenuCategory } from '@/types/menu';

const MOCK_PRECIO = 100_000;

export const paLaSed: MenuCategory = {
  id: 'pa-la-sed',
  titulo: "Pa' la sed",
  subtitulo: 'Sin alcohol',
  chip: "Pa' la sed",
  items: [
    {
      id: 'limonada-de-coco',
      nombre: 'Limonada de coco',
      descripcion: 'Limón, leche de coco y hielo picado.',
      precio: MOCK_PRECIO,
      volumen: '16 oz',
      etiquetas: ['favorita', 'sin-alcohol'],
    },
    {
      id: 'mora-en-leche',
      nombre: 'Jugo de mora en leche',
      precio: MOCK_PRECIO,
      volumen: '12 oz',
      etiquetas: ['sin-alcohol'],
    },
    {
      id: 'claro-panela',
      nombre: 'Claro de panela',
      descripcion: 'Agua de panela fría con limón y hierbabuena.',
      precio: MOCK_PRECIO,
      volumen: '12 oz',
      etiquetas: ['sin-alcohol'],
    },
    {
      id: 'tinto-campesino',
      nombre: 'Tinto campesino',
      descripcion: 'Café de olla con panela y un clavo de olor.',
      precio: MOCK_PRECIO,
      volumen: '6 oz',
      etiquetas: ['sin-alcohol'],
      relato:
        'El que no se toma un tinto antes de irse, no vino a la fonda: pasó por la fonda.',
    },
  ],
};
```

### `src/content/menu/index.ts`

```ts
import type { Menu } from '@/types/menu';
import { aguardientes } from './aguardientes';
import { whiskyYOtros } from './whisky-y-otros';
import { cervezas } from './cervezas';
import { deLaCasa } from './de-la-casa';
import { vinosYEspumosos } from './vinos-y-espumosos';
import { paLaSed } from './pa-la-sed';

/**
 * El orden de este arreglo es el orden de la carta y de la barra de
 * navegación: primero lo típico de la fonda (aguardiente, cerveza),
 * luego lo importado, luego los cócteles y el vino, y de último lo
 * que no tiene alcohol.
 */
export const menu: Menu = [
  aguardientes,
  cervezas,
  whiskyYOtros,
  deLaCasa,
  vinosYEspumosos,
  paLaSed,
];

/** Todos los productos en un solo arreglo. Lo usa la Ruleta del Azabache. */
export const todosLosItems = menu.flatMap((c) =>
  c.items
    .filter((i) => i.disponible !== false)
    .map((i) => ({ ...i, categoriaId: c.id, categoriaTitulo: c.titulo })),
);

export type ItemConCategoria = (typeof todosLosItems)[number];
```

---

## 5. Contenido del sitio

`src/content/site.ts` — **ningún componente escribe texto de negocio; todo sale de aquí** (Regla 3 de [`05`](./05-estructura-y-convenciones.md#regla-3--el-contenido-nunca-importa-componentes-y-los-componentes-nunca-escriben-contenido)).

```ts
export const site = {
  nombre: 'Fonda Azabache',
  url: 'https://carta.fondaazabache.co',

  lema: ['Aquí se bebe bueno,', 'se canta duro', 'y se sufre bonito.'],
  bajada: 'Trago derecho, cerveza bien fría y música de la que duele. Bienvenido a la mesa.',

  coplas: {
    antesDeCocteles: 'Caballo que va sin afán, llega bien acompañado.',
    pie: 'Al que le sirvan poco, que reclame. Al que le duela el pecho, que cante.',
  },

  horarios: [
    { dias: 'Martes a jueves', horas: '4:00 p. m. – 12:00 a. m.' },
    { dias: 'Viernes y sábado', horas: '2:00 p. m. – 2:00 a. m.' },
    { dias: 'Domingo', horas: '12:00 m. – 10:00 p. m.' },
    { dias: 'Lunes', horas: 'Cerrado' },
  ],

  contacto: {
    direccion: 'Cra. 43A #x-xx, El Poblado, Medellín',
    telefono: '+57 300 000 0000',
    whatsapp: 'https://wa.me/573000000000',
    instagram: 'https://instagram.com/fondaazabache',
    mapa: 'https://maps.google.com/?q=Fonda+Azabache',
  },

  wifi: { red: 'FondaAzabache', clave: 'sesufrebonito' },

  avisos: {
    propina: 'La propina es voluntaria y va completa para el equipo.',
    precios: 'Precios en pesos colombianos. Incluyen impuestos.',
    alcohol: 'El exceso de alcohol es perjudicial para la salud. Ley 30 de 1986. Prohibida la venta a menores de 18 años.',
  },
} as const;
```

> **`avisos.alcohol` no es opcional.** Es obligación legal en Colombia. Va en el pie, en `--t-meta`, con contraste suficiente para ser legible de verdad. Cumplir la ley y además hacerlo bien no cuesta nada.

`src/content/cancionero.ts`:

```ts
export const cancionero = {
  titulo: 'Cancionero de la casa',
  subtitulo: 'Lo que suena y lo que se puede pedir',
  intro: 'Pídala en la barra. Si está en la lista, suena.',
  canciones: [
    { titulo: 'Nadie es eterno', artista: 'Darío Gómez' },
    { titulo: 'El as de corazones', artista: 'Óscar Agudelo' },
    { titulo: 'La cuchilla', artista: 'Las Hermanitas Calle' },
    { titulo: 'La copa rota', artista: 'Alci Acosta' },
    { titulo: 'Nuestro juramento', artista: 'Julio Jaramillo' },
    { titulo: 'El rey', artista: 'Vicente Fernández' },
    { titulo: 'Tres tumbas', artista: 'Los Reyes Vallenatos' },
    { titulo: 'Sombras nada más', artista: 'Javier Solís' },
  ],
} as const;
```

**Por qué el cancionero está en la carta.** Es una lista de texto: pesa ~600 bytes y no añade JS. Y responde a "se canta duro y se sufre bonito" de forma literal. Es el tipo de detalle que hace que alguien le pase el celular al de al lado. Va **colapsado** por defecto, con `<details>` nativo, para no estorbar a quien solo quiere comer.

---

## 6. Resumen de la carta

| Sección | `id` | Productos | Con relato |
|---|---|---|---|
| Del estante | `del-estante` | 5 | 1 |
| Bien fría | `bien-fria` | 5 | 0 |
| De fuera | `de-fuera` | 4 | 0 |
| De la casa | `de-la-casa` | 5 | 2 |
| De la cava | `de-la-cava` | 3 | 0 |
| Pa' la sed | `pa-la-sed` | 4 | 1 |
| **Total** | | **26** | **4** (límite 8) |

Todos los precios muestran `$100.000` (mock deliberado, ver §1 y la nota al inicio del documento). Seis chips en la barra: caben holgados en una pantalla y media de scroll horizontal, con el último asomando cortado a la derecha para indicar que hay más.

---

## 7. Camino a un CMS

Cuando el volumen de cambios lo justifique (más de 3–4 ediciones por semana, o si la administración las tiene que hacer sin tocar git):

```
Hoy:      content/menu/*.ts  ──►  menuSchema.parse()  ──►  componentes
Mañana:   CMS (fetch build)  ──►  menuSchema.parse()  ──►  componentes  (idénticos)
```

**El esquema Zod es el contrato.** Los pasos serían:

1. Modelar en el CMS (Sanity o Payload) exactamente los campos de `menuItemSchema`.
2. Reemplazar `src/content/menu/index.ts` por un `fetch` en tiempo de build (`generateStaticParams` / carga en el módulo del server component).
3. Pasar el resultado por `menuSchema.parse()` — ahora **sí** en build, ya no en un script suelto.
4. Añadir un webhook del CMS que dispare el redeploy.

**Los componentes no se tocan.** Ni uno. Eso es lo que buscamos con esta separación.
