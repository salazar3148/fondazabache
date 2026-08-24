import type { MenuCategory } from '@/types/menu';

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
 * Título y subtítulo van al revés de lo que pedía el diseño original: arriba,
 * quemado, el producto ("Aguardientes"), y debajo la frase de fonda ("Del
 * estante"). Quien abre la carta busca el licor, no la metáfora: con "Del
 * estante" arriba tocaba leer el renglón chico para saber qué sección era.
 *
 * Nombres en Title Case (cada palabra principal en mayúscula): es el mismo
 * criterio que ya se usaba en los nombres de marca (Manzanares, Real) y
 * ahora se extiende a los descriptores genéricos (Verde, Roja, Azul) para
 * que ninguna fila se lea distinto de las demás.
 */
export const aguardientes: MenuCategory = {
  id: 'aguardientes',
  titulo: 'Aguardientes',
  subtitulo: 'Del estante',
  chip: 'Aguardientes',
  nota: 'Verde, rojo y azul son las tres referencias del Antioqueño.',
  licor: true,
  descripciones: false,
  items: [
    {
      id: 'media-verde',
      nombre: 'Media Verde',
      descripcion: 'La de tapa verde. Con hielo, limón y una canción.',
      precio: 48_000,
      etiquetas: ['favorita'],
    },
    {
      id: 'media-roja',
      nombre: 'Media Roja',
      descripcion: 'Tapa roja: más dulce al paso, más brava al otro día.',
      precio: 50_000,
    },
    {
      id: 'media-azul',
      nombre: 'Media Azul',
      descripcion: 'Sin azúcar. Más seco, menos guayabo.',
      precio: 55_000,
    },
    {
      id: 'litro-verde',
      nombre: 'Litro Verde',
      descripcion: 'El que se pide cuando nadie tiene afán de irse.',
      precio: 85_000,
    },
    {
      id: 'litro-rojo',
      nombre: 'Litro Rojo',
      precio: 90_000,
    },
    {
      id: 'litro-azul',
      nombre: 'Litro Azul',
      precio: 95_000,
    },
    {
      id: 'garrafa-verde',
      nombre: 'Garrafa Verde',
      descripcion: 'Para la mesa que ya decidió amanecer.',
      precio: 190_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'garrafa-roja',
      nombre: 'Garrafa Roja',
      precio: 235_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'garrafa-azul',
      nombre: 'Garrafa Azul',
      precio: 255_000,
      etiquetas: ['compartir'],
    },
    {
      id: 'manzanares-media',
      nombre: 'Media Manzanares',
      precio: 65_000,
    },
    {
      id: 'manzanares-botella',
      nombre: 'Aguardiente Manzanares',
      descripcion: 'Para cambiar de etiqueta sin cambiar de costumbre.',
      precio: 115_000,
    },
    {
      id: 'real-media',
      nombre: 'Aguardiente Real Media',
      precio: 45_000,
    },
    {
      id: 'real-botella',
      nombre: 'Aguardiente Real',
      precio: 70_000,
    },
  ],
};
