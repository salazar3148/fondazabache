import type { MenuCategory } from '@/types/menu';

/**
 * Catálogo real: lo que se sirve por copa, sin comprar botella.
 *
 * "Tequila Jugador" era una mala lectura de la carta manuscrita: la marca es
 * El Jimador (tequila 100 % agave de la casa Herradura). Corregido nombre e id.
 */
export const tragos: MenuCategory = {
  id: 'tragos',
  titulo: 'Tragos',
  subtitulo: 'Por copa',
  chip: 'Tragos',
  nota: 'Servido en el momento, sin comprar botella.',
  licor: true,
  items: [
    {
      id: 'trago-aguardiente',
      nombre: 'Aguardiente',
      descripcion: 'Servido derecho, con el limón al lado.',
      precio: 5_000,
      etiquetas: ['favorita'],
      relato:
        'Cinco mil pesos de guaro y una canción de Darío Gómez: el presupuesto exacto de una noche que se recuerda.',
    },
    {
      id: 'trago-ron',
      nombre: 'Ron',
      descripcion: 'Con hielo o con soda. Como usted diga.',
      precio: 5_000,
    },
    {
      id: 'trago-tequila-jose-cuervo',
      nombre: 'Tequila José Cuervo',
      descripcion: 'Con sal y limón.',
      precio: 10_000,
      etiquetas: ['fuerte'],
    },
    {
      id: 'trago-whisky',
      nombre: 'Whisky',
      descripcion: 'En las rocas, para el que no está de afán.',
      precio: 10_000,
    },
    {
      id: 'trago-tequila-el-jimador',
      nombre: 'Tequila El Jimador',
      descripcion: 'Cien por ciento agave. El que sabe, lo pide derecho.',
      precio: 15_000,
      etiquetas: ['fuerte'],
    },
  ],
};
