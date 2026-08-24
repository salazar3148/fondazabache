import type { MenuCategory } from '@/types/menu';

/**
 * Catálogo real, con los nombres tal cual la carta física (corrigiendo solo la
 * ortografía de las marcas: "Águila laght" → "Águila Light").
 *
 * Nacionales e importadas van juntas: son nueve referencias y partirlas en dos
 * secciones de 7 y 2 dejaría una sección coja. La carta física las separa; en
 * pantalla el precio ya distingue cuál es cuál.
 *
 * Cerveza es la ÚNICA sección con `descripciones: true`: es la única fila de
 * toda la carta donde la frase corta se queda visible bajo el nombre.
 *
 * El orden ya no es por precio ascendente: abre con la favorita (Pilsen) para
 * anclar la recomendación, sigue con el bloque de nacionales al mismo precio,
 * y cierra con las importadas (las más caras), que quedan últimas a propósito
 * — funcionan como ancla de precio: después de leerlas, el resto de la carta
 * se siente más barata.
 */
export const cervezas: MenuCategory = {
  id: 'bien-fria',
  titulo: 'Bien fría',
  subtitulo: 'Cervezas',
  chip: 'Bien fría',
  nota: 'Todas de la nevera, ninguna del estante.',

  /* Fuera de la Ruleta: cerveza es cerveza, no es lo que uno duda. */
  licor: false,
  descripciones: true,
  items: [
    {
      id: 'pilsen',
      nombre: 'Pilsen',
      descripcion: 'La de la casa. Bien fría, siempre.',
      precio: 5_000,
      etiquetas: ['favorita'],
    },
    {
      id: 'aguila',
      nombre: 'Águila',
      descripcion: 'La que más sale. Bien fría y sin ceremonia.',
      precio: 5_000,
    },
    {
      id: 'poker',
      nombre: 'Póker',
      descripcion: 'La del que llega tarde y se queda hasta el final.',
      precio: 5_000,
    },
    {
      id: 'aguila-light',
      nombre: 'Águila Light',
      descripcion: 'Suave y ligera. Para aguantar la noche completa.',
      precio: 5_000,
    },
    {
      id: 'andina',
      nombre: 'Andina',
      descripcion: 'La liviana que aguanta el paso cuando ya van varias rondas.',
      precio: 5_000,
    },
    {
      id: 'club-dorada',
      nombre: 'Club Dorada',
      descripcion: 'Malta tostada y más cuerpo. Se toma sin afán.',
      precio: 8_000,
    },
    {
      id: 'club-trigo',
      nombre: 'Club Colombia Trigo',
      descripcion: 'De trigo, turbia y suave. Sorprende al que no la conoce.',
      precio: 8_500,
    },
    { id: 'corona', nombre: 'Corona', descripcion: 'Con limón, si quiere.', precio: 9_000 },
    {
      id: 'stella-artois',
      nombre: 'Stella Artois',
      descripcion: 'Amarga, limpia y bien fría. La del brindis.',
      precio: 9_000,
    },
  ],
};
