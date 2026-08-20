import type { MenuCategory } from '@/types/menu';

/**
 * Catálogo real, con los nombres tal cual la carta física.
 *
 * "Botella / litro / garrafa tradicional" van sin marca en la carta, igual que
 * allá: en la sección de ron y después de las medias de Caldas, en la fonda se
 * entiende. No se les inventa marca.
 *
 * `descripciones: false`: esta sección no muestra `descripcion` en la fila
 * (solo cerveza la muestra). El dato sigue viviendo aquí para la Ruleta.
 *
 * `compartir` queda SOLO en la garrafa: botellas y litro se sirven igual de
 * individual que una media, así que el badge ahí era ruido.
 *
 * Orden: la favorita (media Caldas tradicional) primero, para anclar la
 * recomendación desde la primera fila. Luego el resto de medias, botellas,
 * litro y garrafa: el mismo camino de upsell de aguardientes.
 */
export const ron: MenuCategory = {
  id: 'de-la-cava',
  titulo: 'De la cava',
  subtitulo: 'Rones',
  chip: 'De la cava',
  nota: 'Derecho, con hielo o con soda. Usted decide.',
  licor: true,
  descripciones: false,
  items: [
    {
      id: 'media-caldas-tradicional',
      nombre: 'Media Caldas tradicional',
      descripcion: 'Trago servido, sin apuro.',
      precio: 60_000,
      etiquetas: ['favorita'],
    },
    {
      id: 'media-medellin',
      nombre: 'Media Medellín',
      descripcion: 'Añejo, dulce y redondo. El clásico de siempre.',
      precio: 55_000,
    },
    {
      id: 'media-medellin-29',
      nombre: 'Media Medellín 29°',
      descripcion: 'Menos grados, más conversación.',
      precio: 60_000,
    },
    {
      id: 'media-caldas-5-anos',
      nombre: 'Media Caldas 5 años',
      descripcion: 'Cinco años en roble. Se le nota en el final.',
      precio: 65_000,
    },
    {
      id: 'media-esencial',
      nombre: 'Media Esencial',
      descripcion: 'El de las ocasiones. Derecho y sin hielo.',
      precio: 70_000,
    },
    {
      id: 'botella-tradicional',
      nombre: 'Botella tradicional',
      precio: 100_000,
    },
    {
      id: 'botella-5-anos',
      nombre: 'Botella 5 años',
      precio: 110_000,
    },
    {
      id: 'botella-roble-blanco',
      nombre: 'Botella Roble Blanco',
      descripcion: 'Claro y seco. Se lleva bien con la soda.',
      precio: 110_000,
    },
    {
      id: 'litro-tradicional',
      nombre: 'Litro tradicional',
      precio: 130_000,
    },
    {
      id: 'garrafa-tradicional',
      nombre: 'Garrafa tradicional',
      descripcion: 'La que llega cuando la mesa ya cantó dos veces.',
      precio: 280_000,
      etiquetas: ['compartir'],
    },
  ],
};
