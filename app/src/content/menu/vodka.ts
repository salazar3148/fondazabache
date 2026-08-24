import type { MenuCategory } from '@/types/menu';

/**
 * Catálogo real: la única referencia de vodka de la casa. Salió de la antigua
 * sección "De fuera" junto con whisky y tequila (ver whisky.ts).
 *
 * Una sección de una sola fila es a propósito, no un descuido. Al desglosar lo
 * importado por tipo de licor, el vodka no cabe ni en whisky ni en tequila, y
 * dejarlo colgado en una sección "otros" obligaría al visitante a adivinar qué
 * hay dentro. Con su propio chip la respuesta se da antes de entrar: hay
 * vodka, y es este. Por eso el esquema de contenido admite secciones de una
 * referencia (ver lib/schemas.ts).
 *
 * Va de última entre las tres importadas: cierra el bloque en vez de abrirlo
 * con una sección corta.
 *
 * `descripciones: false`: esta sección no muestra `descripcion` en la fila
 * (solo cerveza la muestra). El dato sigue viviendo aquí para la Ruleta.
 */
export const vodka: MenuCategory = {
  id: 'vodka',
  titulo: 'Vodka',
  subtitulo: 'De fuera',
  chip: 'Vodka',
  nota: 'Una sola referencia, y es la que se pide.',
  licor: true,
  descripciones: false,
  items: [
    {
      id: 'smirnoff-de-lulo',
      nombre: 'Smirnoff de lulo',
      descripcion: 'Lulo de verdad. Con soda, con jugo o solo con hielo.',
      precio: 90_000,
    },
  ],
};
