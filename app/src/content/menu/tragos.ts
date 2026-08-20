import type { MenuCategory } from '@/types/menu';

/**
 * Catálogo real: lo que se sirve por copa, sin comprar botella.
 *
 * "Tequila Jugador" era una mala lectura de la carta manuscrita: la marca es
 * El Jimador (tequila 100 % agave de la casa Herradura). Corregido nombre e id.
 *
 * `descripciones: false`: esta sección no muestra `descripcion` en la fila
 * (solo cerveza la muestra). El dato sigue viviendo aquí para la Ruleta.
 *
 * Sin `volumen` (los 45 ml de fábrica) y sin `fuerte` ("Cargado"): son datos
 * de letra pequeña que no cambian la decisión de pedir un trago por copa.
 *
 * Orden: la favorita primero, y de ahí en adelante de menor a mayor precio —
 * ancla con la opción más querida y sube de a poco, sin saltos que espanten.
 */
export const tragos: MenuCategory = {
  id: 'tragos',
  titulo: 'Tragos',
  subtitulo: 'Por copa',
  chip: 'Tragos',
  nota: 'Servido en el momento, sin comprar botella.',
  licor: true,
  descripciones: false,
  items: [
    {
      id: 'trago-aguardiente',
      nombre: 'Aguardiente',
      descripcion: 'Servido derecho, con el limón al lado.',
      precio: 5_000,
      etiquetas: ['favorita'],
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
    },
  ],
};
