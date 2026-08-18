import type { MenuCategory } from '@/types/menu';

/**
 * Catálogo real, con los nombres tal cual la carta física.
 *
 * "Botella / litro / garrafa tradicional" van sin marca en la carta, igual que
 * allá: en la sección de ron y después de las medias de Caldas, en la fonda se
 * entiende. No se les inventa marca.
 */
export const ron: MenuCategory = {
  id: 'de-la-cava',
  titulo: 'De la cava',
  subtitulo: 'Rones',
  chip: 'De la cava',
  nota: 'Derecho, con hielo o con soda. Usted decide.',
  items: [
    { id: 'media-medellin', nombre: 'Media Medellín', precio: 55_000 },
    { id: 'media-medellin-29', nombre: 'Media Medellín 29°', precio: 60_000 },
    {
      id: 'media-caldas-tradicional',
      nombre: 'Media Caldas tradicional',
      descripcion: 'Trago servido, sin apuro.',
      precio: 60_000,
      etiquetas: ['favorita'],
      relato:
        'El ron del que no tiene afán: se sirve, se mira, se conversa, y solo después se toma. El que lo apura, lo desperdicia.',
    },
    { id: 'media-caldas-5-anos', nombre: 'Media Caldas 5 años', precio: 65_000 },
    { id: 'media-esencial', nombre: 'Media Esencial', precio: 70_000 },
    {
      id: 'botella-tradicional',
      nombre: 'Botella tradicional',
      precio: 100_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'botella-5-anos',
      nombre: 'Botella 5 años',
      precio: 110_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'botella-roble-blanco',
      nombre: 'Botella Roble Blanco',
      precio: 110_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'litro-tradicional',
      nombre: 'Litro tradicional',
      precio: 130_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'garrafa-tradicional',
      nombre: 'Garrafa tradicional',
      precio: 280_000,
      etiquetas: ['compartir'],
    },
  ],
};
