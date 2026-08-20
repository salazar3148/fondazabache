import type { MenuCategory } from '@/types/menu';
import { PRECIO_SIN_CONFIRMAR } from '@/lib/constants';

/**
 * Catálogo real, con los NOMBRES TAL CUAL la carta física: en la fonda no se
 * pide "Antioqueño verde presentación 375 ml", se pide "una media verde". El
 * nombre ya carga la presentación; `volumen` no repite esa palabra cuando el
 * nombre ya la tiene, solo añade el dato en mililitros.
 *
 * Los mililitros son el estándar de fábrica de Aguardiente Antioqueño (media
 * 375 ml, litro 1000 ml, garrafa 1750 ml) y de Manzanares/Real (media 375 ml,
 * botella 750 ml). Si el negocio usa un envase distinto, se ajusta aquí
 * (docs/13, pendiente #3).
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
  licor: true,
  items: [
    {
      id: 'media-verde',
      nombre: 'Media verde',
      descripcion: 'La de tapa verde. Con hielo, limón y una canción.',
      volumen: '375 ml',
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
      volumen: '375 ml',
      precio: 50_000,
    },
    {
      id: 'media-azul',
      nombre: 'Media azul',
      descripcion: 'Sin azúcar. Más seco, menos guayabo.',
      volumen: '375 ml',
      precio: 55_000,
    },
    {
      id: 'litro-verde',
      nombre: 'Litro verde',
      descripcion: 'El que se pide cuando nadie tiene afán de irse.',
      volumen: '1000 ml',
      precio: 85_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'litro-rojo',
      nombre: 'Litro rojo',
      volumen: '1000 ml',
      precio: 90_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'litro-azul',
      nombre: 'Litro azul',
      volumen: '1000 ml',
      precio: 95_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'garrafa-verde',
      nombre: 'Garrafa verde',
      descripcion: 'Para la mesa que ya decidió amanecer.',
      volumen: '1750 ml',
      precio: 190_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'garrafa-roja',
      nombre: 'Garrafa roja',
      volumen: '1750 ml',
      precio: 235_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'garrafa-azul',
      nombre: 'Garrafa azul',
      volumen: '1750 ml',
      precio: 255_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'manzanares-media',
      nombre: 'Manzanares media',
      volumen: '375 ml',
      precio: PRECIO_SIN_CONFIRMAR,
    },
    {
      id: 'manzanares-botella',
      nombre: 'Aguardiente Manzanares',
      descripcion: 'Para cambiar de etiqueta sin cambiar de costumbre.',
      volumen: 'Botella · 750 ml',
      precio: PRECIO_SIN_CONFIRMAR,
      etiquetas: ['compartir'],
    },
    {
      id: 'real-media',
      nombre: 'Aguardiente Real media',
      volumen: '375 ml',
      precio: PRECIO_SIN_CONFIRMAR,
    },
    {
      id: 'real-botella',
      nombre: 'Aguardiente Real',
      volumen: 'Botella · 750 ml',
      precio: PRECIO_SIN_CONFIRMAR,
      etiquetas: ['compartir'],
    },
  ],
};
