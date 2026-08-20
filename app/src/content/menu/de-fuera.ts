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
 * `descripciones: false`: esta sección no muestra `descripcion` en la fila
 * (solo cerveza la muestra). El dato sigue viviendo aquí para la Ruleta.
 *
 * Sin `volumen` (ml de fábrica) y sin `compartir`: todo aquí se vende por
 * botella única, no hay tamaño ni "para compartir" que elegir.
 *
 * Orden dentro de cada tipo: el más accesible primero, el más premium
 * después — así el segundo funciona como ancla de precio que hace ver bien
 * el primero, y como upsell para quien ya decidió el tipo de licor.
 *
 * Cinco precios sin confirmar: se muestran como "Pregunte".
 */
export const deFuera: MenuCategory = {
  id: 'de-fuera',
  titulo: 'De fuera',
  subtitulo: 'Vodka, tequila y whisky',
  chip: 'De fuera',
  licor: true,
  descripciones: false,
  items: [
    {
      id: 'smirnoff-de-lulo',
      nombre: 'Smirnoff de lulo',
      descripcion: 'Lulo de verdad. Con soda, con jugo o solo con hielo.',
      precio: 90_000,
    },
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
    {
      id: 'whisky-old-parr',
      nombre: 'Old Parr',
      descripcion: 'Escocés de mezcla, suave y sin filo. Con hielo.',
      precio: PRECIO_SIN_CONFIRMAR,
    },
    {
      id: 'whisky-buchanans-12',
      nombre: "Buchanan's 12",
      descripcion: 'Doce años. La botella que se pone en el centro.',
      precio: PRECIO_SIN_CONFIRMAR,
    },
    {
      id: 'jagermeister',
      nombre: 'Jägermeister',
      descripcion: 'Cincuenta y seis hierbas. Bien frío, de un solo golpe.',
      precio: PRECIO_SIN_CONFIRMAR,
    },
  ],
};
