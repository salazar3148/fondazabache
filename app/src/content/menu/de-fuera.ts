import type { MenuCategory } from '@/types/menu';
import { PRECIO_SIN_CONFIRMAR } from '@/lib/constants';

/**
 * Catálogo real: vodka, tequila y whisky en botella. Los tres bloques de la
 * carta física caben en una sola sección (1 + 2 + 3 referencias); tres chips de
 * un solo producto en la barra se verían vacíos.
 *
 * Dos nombres se leyeron de la carta manuscrita: "Botella pld par" → Old Parr,
 * y "Botella jagger" → Jägermeister (que es licor de hierbas, no whisky, pero
 * se deja aquí por ser importado). Confírmalos si no es así.
 *
 * Cinco precios sin confirmar: se muestran como "Pregunte".
 */
export const deFuera: MenuCategory = {
  id: 'de-fuera',
  titulo: 'De fuera',
  subtitulo: 'Vodka, tequila y whisky',
  chip: 'De fuera',
  nota: 'Botella completa. Por copa, mire la sección de tragos.',
  items: [
    {
      id: 'smirnoff-de-lulo',
      nombre: 'Smirnoff de lulo',
      descripcion: 'Solo, con soda o con jugo.',
      precio: 90_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'tequila-1800-reposado',
      nombre: '1800 Reposado',
      precio: PRECIO_SIN_CONFIRMAR,
      etiquetas: ['fuerte'],
    },
    {
      id: 'tequila-jose-cuervo',
      nombre: 'José Cuervo',
      precio: PRECIO_SIN_CONFIRMAR,
      etiquetas: ['fuerte'],
    },
    {
      id: 'whisky-old-parr',
      nombre: 'Old Parr',
      precio: PRECIO_SIN_CONFIRMAR,
      etiquetas: ['compartir'],
    },
    {
      id: 'whisky-buchanans-12',
      nombre: "Buchanan's 12",
      precio: PRECIO_SIN_CONFIRMAR,
      etiquetas: ['compartir'],
    },
    {
      id: 'jagermeister',
      nombre: 'Jägermeister',
      descripcion: 'Bien frío, en shot.',
      precio: PRECIO_SIN_CONFIRMAR,
      etiquetas: ['fuerte'],
    },
  ],
};
