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
 * Sin `nota`: el subtítulo "Vodka, tequila y whisky" ya sitúa la sección, y la
 * aclaración de botella contra copa la resolvía mejor la propia sección de
 * tragos.
 *
 * `volumen` va en mililitros, con la presentación de fábrica estándar en
 * Colombia para cada botella (docs/13, pendiente #3).
 *
 * Cinco precios sin confirmar: se muestran como "Pregunte".
 */
export const deFuera: MenuCategory = {
  id: 'de-fuera',
  titulo: 'De fuera',
  subtitulo: 'Vodka, tequila y whisky',
  chip: 'De fuera',
  licor: true,
  items: [
    {
      id: 'smirnoff-de-lulo',
      nombre: 'Smirnoff de lulo',
      descripcion: 'Lulo de verdad. Con soda, con jugo o solo con hielo.',
      volumen: '750 ml',
      precio: 90_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'tequila-1800-reposado',
      nombre: '1800 Reposado',
      descripcion: 'Reposado en barrica de roble. Sal, limón y decisión.',
      volumen: '700 ml',
      precio: PRECIO_SIN_CONFIRMAR,
      etiquetas: ['fuerte'],
    },
    {
      id: 'tequila-jose-cuervo',
      nombre: 'José Cuervo',
      descripcion: 'El que todo el mundo conoce. Con sal y limón.',
      volumen: '700 ml',
      precio: PRECIO_SIN_CONFIRMAR,
      etiquetas: ['fuerte'],
    },
    {
      id: 'whisky-old-parr',
      nombre: 'Old Parr',
      descripcion: 'Escocés de mezcla, suave y sin filo. Con hielo.',
      volumen: '750 ml',
      precio: PRECIO_SIN_CONFIRMAR,
      etiquetas: ['compartir'],
    },
    {
      id: 'whisky-buchanans-12',
      nombre: "Buchanan's 12",
      descripcion: 'Doce años. La botella que se pone en el centro.',
      volumen: '750 ml',
      precio: PRECIO_SIN_CONFIRMAR,
      etiquetas: ['compartir'],
    },
    {
      id: 'jagermeister',
      nombre: 'Jägermeister',
      descripcion: 'Cincuenta y seis hierbas. Bien frío, de un solo golpe.',
      volumen: '700 ml',
      precio: PRECIO_SIN_CONFIRMAR,
      etiquetas: ['fuerte'],
    },
  ],
};
