import type { MenuCategory } from '@/types/menu';

/**
 * "Pasantes" es como se llaman en la carta y en la fonda: lo que acompaña al
 * trago. Es además la sección sin alcohol.
 */
export const pasantes: MenuCategory = {
  id: 'pasantes',
  titulo: 'Pasantes',
  subtitulo: 'Gaseosas y aguas',
  chip: 'Pasantes',
  nota: 'Para bajar el trago o para no tomarlo.',

  /* Fuera de la Ruleta: es la sección sin alcohol. */
  licor: false,
  descripciones: false,
  items: [
    {
      id: 'coca-cola',
      nombre: 'Coca-Cola',
      descripcion: 'Bien fría. Para bajar el trago sin perder el hilo.',
      precio: 4_000,
    },
    {
      id: 'soda-bretana',
      nombre: 'Soda Bretaña',
      descripcion: 'La compañera clásica del aguardiente.',
      precio: 4_000,
    },
    { id: 'agua', nombre: 'Agua', precio: 4_000 },
    { id: 'agua-con-gas', nombre: 'Agua con gas', precio: 5_000 },
    {
      id: 'gatorade',
      nombre: 'Gatorade',
      descripcion: 'El que sabe, lo pide antes y no después.',
      precio: 6_000,
    },
  ],
};
