import type { MenuCategory } from '@/types/menu';
import { PRECIO_SIN_CONFIRMAR } from '@/lib/constants';

/**
 * Catálogo real: whisky en botella. Salió de la antigua sección "De fuera",
 * que metía vodka, tequila y whisky en la misma lista. Quien busca whisky
 * quería saltar directo a whisky, y con las tres familias revueltas tocaba
 * leer las seis filas para encontrar las suyas.
 *
 * "Botella pld par" de la carta manuscrita se leyó como Old Parr, y "Botella
 * jagger" como Jägermeister. Confírmalos si no es así.
 *
 * El Jägermeister vive aquí por decisión del negocio, no por botánica: es
 * licor de hierbas, no whisky. Se pide en el mismo momento de la noche y se
 * sirve igual, así que se busca en el mismo sitio. La `nota` lo aclara para
 * que la carta no quede mintiendo.
 *
 * `descripciones: false`: esta sección no muestra `descripcion` en la fila
 * (solo cerveza la muestra). El dato sigue viviendo aquí para la Ruleta.
 *
 * Orden: el más accesible primero, el más premium después — así el segundo
 * funciona como ancla de precio que hace ver bien el primero. El Jäger cierra:
 * es el que no es whisky.
 *
 * Los tres precios siguen sin confirmar: se muestran como "Pregunte".
 */
export const whisky: MenuCategory = {
  id: 'whisky',
  titulo: 'Whisky',
  subtitulo: 'De fuera',
  chip: 'Whisky',
  nota: 'El Jägermeister es de hierbas, pero se pide aquí.',
  licor: true,
  descripciones: false,
  items: [
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
