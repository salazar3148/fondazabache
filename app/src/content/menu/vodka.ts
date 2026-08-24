import type { MenuCategory } from '@/types/menu';

/**
 * Catálogo real: vodka de la casa. Salió de la antigua sección "De fuera"
 * junto con whisky y tequila (ver whisky.ts).
 *
 * Al desglosar lo importado por tipo de licor, el vodka no cabe ni en whisky
 * ni en tequila, y dejarlo colgado en una sección "otros" obligaría al
 * visitante a adivinar qué hay dentro. Con su propio chip la respuesta se da
 * antes de entrar: hay vodka, y son estas referencias.
 *
 * Va de última entre las tres importadas: cierra el bloque en vez de abrirlo
 * con una sección corta.
 *
 * `descripciones: false`: esta sección no muestra `descripcion` en la fila
 * (solo cerveza la muestra). El dato sigue viviendo aquí para la Ruleta.
 *
 * Orden: lulo primero (la favorita histórica), luego tamarindo en media y
 * botella — mismo camino de upsell que el resto de la carta.
 */
export const vodka: MenuCategory = {
  id: 'vodka',
  titulo: 'Vodka',
  subtitulo: 'De fuera',
  chip: 'Vodka',
  nota: 'Lulo y tamarindo, las dos que se piden.',
  licor: true,
  descripciones: false,
  items: [
    {
      id: 'smirnoff-de-lulo',
      nombre: 'Smirnoff de Lulo',
      descripcion: 'Lulo de verdad. Con soda, con jugo o solo con hielo.',
      precio: 95_000,
    },
    {
      id: 'smirnoff-tamarindo-media',
      nombre: 'Media Smirnoff de Tamarindo',
      descripcion: 'Tamarindo de verdad, en media. Con soda o con hielo.',
      precio: 65_000,
    },
    {
      id: 'smirnoff-tamarindo-botella',
      nombre: 'Botella Smirnoff de Tamarindo',
      descripcion: 'Tamarindo de verdad. Con soda, con jugo o solo con hielo.',
      precio: 115_000,
    },
  ],
};
