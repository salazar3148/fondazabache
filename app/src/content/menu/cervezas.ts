import type { MenuCategory } from '@/types/menu';

/**
 * Catálogo real, con los nombres tal cual la carta física (corrigiendo solo la
 * ortografía de las marcas: "Águila laght" → "Águila Light").
 *
 * Nacionales e importadas van juntas: son ocho referencias y partirlas en dos
 * secciones de 6 y 2 dejaría una sección coja. La carta física las separa; en
 * pantalla el precio ya distingue cuál es cuál.
 *
 * El orden es de precio ascendente, que es también el orden en que se piden.
 */
export const cervezas: MenuCategory = {
  id: 'bien-fria',
  titulo: 'Bien fría',
  subtitulo: 'Cervezas',
  chip: 'Bien fría',
  nota: 'Todas de la nevera, ninguna del estante.',
  items: [
    {
      id: 'aguila',
      nombre: 'Águila',
      descripcion: 'La que más sale. Bien fría y sin ceremonia.',
      precio: 5_000,
    },
    {
      id: 'pilsen',
      nombre: 'Pilsen',
      descripcion: 'La de la casa. Bien fría, siempre.',
      precio: 6_000,
      etiquetas: ['favorita'],
      relato:
        'La Pilsen no se pide: se sobreentiende. Llega sudada, con el destapador todavía tibio y sin preguntar nada.',
    },
    {
      id: 'poker',
      nombre: 'Póker',
      descripcion: 'La del que llega tarde y se queda hasta el final.',
      precio: 6_000,
    },
    {
      id: 'aguila-light',
      nombre: 'Águila Light',
      descripcion: 'Suave y ligera. Para aguantar la noche completa.',
      precio: 6_000,
    },
    { id: 'andina', nombre: 'Andina', precio: 6_000 },
    {
      id: 'club-dorada',
      nombre: 'Club Dorada',
      descripcion: 'Malta tostada y más cuerpo. Se toma sin afán.',
      precio: 8_000,
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
