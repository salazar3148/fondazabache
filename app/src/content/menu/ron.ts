import type { MenuCategory } from '@/types/menu';

/**
 * Catálogo real, con los nombres tal cual la carta física.
 *
 * "Botella / litro / garrafa tradicional" van sin marca en la carta, igual que
 * allá: en la sección de ron y después de las medias de Caldas, en la fonda se
 * entiende. No se les inventa marca.
 *
 * Las descripciones van en las medias (que son lo que más rota) y en la
 * garrafa; las botellas y el litro quedan en seco a propósito, para que la fila
 * que habla sea la que se quiere destacar.
 *
 * `volumen` usa los mililitros estándar de fábrica (Ron Medellín y Viejo de
 * Caldas): media 375 ml, botella 750 ml, litro 1000 ml, garrafa 1750 ml. Si el
 * negocio confirma otra presentación, se ajusta aquí (docs/13, pendiente #3).
 */
export const ron: MenuCategory = {
  id: 'de-la-cava',
  titulo: 'De la cava',
  subtitulo: 'Rones',
  chip: 'De la cava',
  nota: 'Derecho, con hielo o con soda. Usted decide.',
  licor: true,
  items: [
    {
      id: 'media-medellin',
      nombre: 'Media Medellín',
      descripcion: 'Añejo, dulce y redondo. El clásico de siempre.',
      volumen: '375 ml',
      precio: 55_000,
    },
    {
      id: 'media-medellin-29',
      nombre: 'Media Medellín 29°',
      descripcion: 'Menos grados, más conversación.',
      volumen: '375 ml',
      precio: 60_000,
    },
    {
      id: 'media-caldas-tradicional',
      nombre: 'Media Caldas tradicional',
      descripcion: 'Trago servido, sin apuro.',
      volumen: '375 ml',
      precio: 60_000,
      etiquetas: ['favorita'],
      relato:
        'El ron del que no tiene afán: se sirve, se mira, se conversa, y solo después se toma. El que lo apura, lo desperdicia.',
    },
    {
      id: 'media-caldas-5-anos',
      nombre: 'Media Caldas 5 años',
      descripcion: 'Cinco años en roble. Se le nota en el final.',
      volumen: '375 ml',
      precio: 65_000,
    },
    {
      id: 'media-esencial',
      nombre: 'Media Esencial',
      descripcion: 'El de las ocasiones. Derecho y sin hielo.',
      volumen: '375 ml',
      precio: 70_000,
    },
    {
      id: 'botella-tradicional',
      nombre: 'Botella tradicional',
      volumen: '750 ml',
      precio: 100_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'botella-5-anos',
      nombre: 'Botella 5 años',
      volumen: '750 ml',
      precio: 110_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'botella-roble-blanco',
      nombre: 'Botella Roble Blanco',
      descripcion: 'Claro y seco. Se lleva bien con la soda.',
      volumen: '750 ml',
      precio: 110_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'litro-tradicional',
      nombre: 'Litro tradicional',
      volumen: '1000 ml',
      precio: 130_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'garrafa-tradicional',
      nombre: 'Garrafa tradicional',
      descripcion: 'La que llega cuando la mesa ya cantó dos veces.',
      volumen: '1750 ml',
      precio: 280_000,
      etiquetas: ['compartir'],
    },
  ],
};
