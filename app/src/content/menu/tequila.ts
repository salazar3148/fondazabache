import type { MenuCategory } from '@/types/menu';
import { PRECIO_SIN_CONFIRMAR } from '@/lib/constants';

/**
 * Catálogo real: tequila en botella. Salió de la antigua sección "De fuera"
 * junto con whisky y vodka (ver whisky.ts).
 *
 * Es tequila por BOTELLA. El tequila por copa vive en la sección de tragos
 * (José Cuervo y El Jimador), que es donde lo busca quien no va a comprar
 * botella. La `nota` manda ahí para que nadie crea que solo hay botella.
 *
 * `descripciones: false`: esta sección no muestra `descripcion` en la fila
 * (solo cerveza la muestra). El dato sigue viviendo aquí para la Ruleta.
 *
 * Orden: el más accesible primero, el reposado después — ancla de precio y
 * upsell para quien ya decidió que es noche de tequila.
 *
 * Los dos precios siguen sin confirmar: se muestran como "Pregunte".
 */
export const tequila: MenuCategory = {
  id: 'tequila',
  titulo: 'Tequila',
  subtitulo: 'De fuera',
  chip: 'Tequila',
  nota: 'Por copa está en Tragos. Aquí va la botella.',
  licor: true,
  descripciones: false,
  items: [
    {
      id: 'tequila-jose-cuervo',
      nombre: 'José Cuervo',
      descripcion: 'El que todo el mundo conoce. Con sal y limón.',
      precio: PRECIO_SIN_CONFIRMAR,
    },
    {
      id: 'tequila-1800-reposado',
      nombre: '1800 Reposado',
      descripcion: 'Reposado en barrica de roble. Sal, limón y decisión.',
      precio: PRECIO_SIN_CONFIRMAR,
    },
  ],
};
