import type { MenuCategory } from '@/types/menu';
import { PRECIO_SIN_CONFIRMAR } from '@/lib/constants';

/**
 * Catálogo real, con los NOMBRES TAL CUAL la carta física: en la fonda no se
 * pide "Antioqueño verde presentación 375 ml", se pide "una media verde". El
 * nombre ya carga la presentación, así que no se añade `volumen` con
 * mililitros inventados: cuando el negocio confirme los volúmenes exactos se
 * agregan (docs/13, pendiente #3).
 *
 * Las descripciones van solo en las referencias que más salen (las tres
 * medias, el litro y la garrafa verde). Dejar el resto en seco es a propósito:
 * si todas las filas hablan, ninguna destaca.
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
  items: [
    {
      id: 'media-verde',
      nombre: 'Media verde',
      descripcion: 'La de tapa verde. Con hielo, limón y una canción.',
      precio: 48_000,
      etiquetas: ['favorita'],
      relato:
        'En la fonda no se pregunta cuál aguardiente. Se pregunta media, litro o garrafa. Todo lo demás es conversación.',
      vaBienCon: ['soda-bretana', 'coca-cola'],
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
      etiquetas: ['compartir'],
    },
    { id: 'litro-rojo', nombre: 'Litro rojo', precio: 90_000, etiquetas: ['compartir'] },
    { id: 'litro-azul', nombre: 'Litro azul', precio: 95_000, etiquetas: ['compartir'] },
    {
      id: 'garrafa-verde',
      nombre: 'Garrafa verde',
      descripcion: 'Para la mesa que ya decidió amanecer.',
      precio: 190_000,
      etiquetas: ['compartir'],
    },
    { id: 'garrafa-roja', nombre: 'Garrafa roja', precio: 235_000, etiquetas: ['compartir'] },
    { id: 'garrafa-azul', nombre: 'Garrafa azul', precio: 255_000, etiquetas: ['compartir'] },
    {
      id: 'manzanares-media',
      nombre: 'Manzanares media',
      precio: PRECIO_SIN_CONFIRMAR,
    },
    {
      id: 'manzanares-botella',
      nombre: 'Aguardiente Manzanares',
      descripcion: 'Para cambiar de etiqueta sin cambiar de costumbre.',
      volumen: 'Botella',
      precio: PRECIO_SIN_CONFIRMAR,
      etiquetas: ['compartir'],
    },
    {
      id: 'real-media',
      nombre: 'Aguardiente Real media',
      precio: PRECIO_SIN_CONFIRMAR,
    },
    {
      id: 'real-botella',
      nombre: 'Aguardiente Real',
      volumen: 'Botella',
      precio: PRECIO_SIN_CONFIRMAR,
      etiquetas: ['compartir'],
    },
  ],
};
