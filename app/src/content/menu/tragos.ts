import type { MenuCategory } from '@/types/menu';

/**
 * Catálogo real: lo que se sirve por copa, sin comprar botella.
 * "Tequila Jugador" está tal cual la carta física — pendiente de confirmar si
 * es el nombre de la marca (docs/13, pendiente #2).
 */
export const tragos: MenuCategory = {
  id: 'tragos',
  titulo: 'Tragos',
  subtitulo: 'Por copa',
  chip: 'Tragos',
  nota: 'Servido en el momento, sin comprar botella.',
  items: [
    {
      id: 'trago-aguardiente',
      nombre: 'Aguardiente',
      precio: 5_000,
      etiquetas: ['favorita'],
      relato:
        'Cinco mil pesos de guaro y una canción de Darío Gómez: el presupuesto exacto de una noche que se recuerda.',
    },
    { id: 'trago-ron', nombre: 'Ron', precio: 5_000 },
    {
      id: 'trago-tequila-jose-cuervo',
      nombre: 'Tequila José Cuervo',
      descripcion: 'Con sal y limón.',
      precio: 10_000,
      etiquetas: ['fuerte'],
    },
    { id: 'trago-whisky', nombre: 'Whisky', precio: 10_000 },
    {
      id: 'trago-tequila-jugador',
      nombre: 'Tequila Jugador',
      precio: 15_000,
      etiquetas: ['fuerte'],
    },
  ],
};
