import type { MenuCategory } from '@/types/menu';
import { PRECIO_SIN_CONFIRMAR } from '@/lib/constants';

/**
 * Catálogo real, con los NOMBRES TAL CUAL la carta física: en la fonda no se
 * pide "Antioqueño verde presentación 375 ml", se pide "una media verde". El
 * nombre ya carga la presentación (media, litro, garrafa), así que no se
 * repite el dato en mililitros: es información de fábrica que no cambia la
 * decisión de compra y sobra en la fila.
 *
 * `descripciones: false`: esta sección no muestra `descripcion` en la fila
 * (solo cerveza la muestra). El dato de `descripcion` que sigue viviendo aquí
 * lo usa la Ruleta del Azabache al sortear.
 *
 * `compartir` queda SOLO en las garrafas: litros y botellas se sirven igual de
 * individual que una media, así que el badge ahí era ruido.
 *
 * Orden: la favorita primero (ancla la recomendación), luego medias, litros y
 * garrafas en ese orden — es el camino de upsell natural de quien entra
 * pidiendo "una media" y termina llevando litro o garrafa. Las marcas
 * alternas (Manzanares, Real) quedan al final: son la opción de respaldo, no
 * la primera que se quiere mostrar.
 *
 * Los cuatro precios de Manzanares y Real siguen sin confirmar y se muestran
 * como "Pregunte".
 */
export const aguardientes: MenuCategory = {
  id: 'del-estante',
  titulo: 'Del estante',
  subtitulo: 'Aguardientes',
  chip: 'Del estante',
  nota: 'Verde, rojo y azul son las tres referencias del Antioqueño.',
  licor: true,
  descripciones: false, 
  items: [
    {
      id: 'media-verde',
      nombre: 'Media verde',
      descripcion: 'La de tapa verde. Con hielo, limón y una canción.',
      precio: 48_000,
      etiquetas: ['favorita'],
    },
    {
      id: 'media-roja',
      nombre: 'Media roja',
      descripcion: 'Tapa roja: más dulce al paso, más brava al otro día.',
      precio: 50_000,
    },
    {
      id: 'media-azul',
      nombre: 'Media azul',
      descripcion: 'Sin azúcar. Más seco, menos guayabo.',
      precio: 55_000,
    },
    {
      id: 'litro-verde',
      nombre: 'Litro verde',
      descripcion: 'El que se pide cuando nadie tiene afán de irse.',
      precio: 85_000,
    },
    {
      id: 'litro-rojo',
      nombre: 'Litro rojo',
      precio: 90_000,
    },
    {
      id: 'litro-azul',
      nombre: 'Litro azul',
      precio: 95_000,
    },
    {
      id: 'garrafa-verde',
      nombre: 'Garrafa verde',
      descripcion: 'Para la mesa que ya decidió amanecer.',
      precio: 190_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'garrafa-roja',
      nombre: 'Garrafa roja',
      precio: 235_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'garrafa-azul',
      nombre: 'Garrafa azul',
      precio: 255_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'manzanares-media',
      nombre: 'Manzanares media',
      precio: PRECIO_SIN_CONFIRMAR,
    },
    {
      id: 'manzanares-botella',
      nombre: 'Aguardiente Manzanares',
      descripcion: 'Para cambiar de etiqueta sin cambiar de costumbre.',
      precio: PRECIO_SIN_CONFIRMAR,
    },
    {
      id: 'real-media',
      nombre: 'Aguardiente Real media',
      precio: PRECIO_SIN_CONFIRMAR,
    },
    {
      id: 'real-botella',
      nombre: 'Aguardiente Real',
      precio: PRECIO_SIN_CONFIRMAR,
    },
  ],
};
