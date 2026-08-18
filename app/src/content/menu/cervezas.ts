import type { MenuCategory } from '@/types/menu';

/**
 * Catálogo real, con los nombres tal cual la carta física (corrigiendo solo la
 * ortografía de las marcas: "Águila laght" → "Águila Light").
 *
 * Nacionales e importadas van juntas: son siete referencias y partirlas en dos
 * secciones de 5 y 2 dejaría una sección coja. La carta física las separa; en
 * pantalla el precio ya distingue cuál es cuál.
 */
export const cervezas: MenuCategory = {
  id: 'bien-fria',
  titulo: 'Bien fría',
  subtitulo: 'Cervezas',
  chip: 'Bien fría',
  nota: 'Todas de la nevera, ninguna del estante.',
  items: [
    {
      id: 'pilsen',
      nombre: 'Pilsen',
      descripcion: 'La de la casa. Bien fría, siempre.',
      precio: 6_000,
      etiquetas: ['favorita'],
      relato:
        'La Pilsen no se pide: se sobreentiende. Llega sudada, con el destapador todavía tibio y sin preguntar nada.',
    },
    { id: 'poker', nombre: 'Póker', precio: 6_000 },
    { id: 'aguila-light', nombre: 'Águila Light', precio: 6_000 },
    { id: 'andina', nombre: 'Andina', precio: 6_000 },
    { id: 'club-dorada', nombre: 'Club Dorada', precio: 8_000 },
    { id: 'corona', nombre: 'Corona', descripcion: 'Con limón, si quiere.', precio: 9_000 },
    { id: 'stella-artois', nombre: 'Stella Artois', precio: 9_000 },
  ],
};
