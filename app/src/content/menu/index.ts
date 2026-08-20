import type { ItemConCategoria, Menu } from '@/types/menu';
import { cervezas } from './cervezas';
import { aguardientes } from './aguardientes';
import { ron } from './ron';
import { deFuera } from './de-fuera';
import { tragos } from './tragos';
import { pasantes } from './pasantes';

/**
 * El orden de este arreglo es el orden de la carta y de la barra de
 * navegación: primero lo que más se pide (cerveza y aguardiente), luego el
 * ron, después lo importado y lo servido por copa, y de último los pasantes,
 * que es además la sección sin alcohol.
 *
 * Agregar una categoría = crear su archivo y registrarlo aquí. Ningún
 * componente se modifica (docs/05 §7).
 */
export const menu: Menu = [cervezas, aguardientes, ron, deFuera, tragos, pasantes];

/**
 * El bolsillo del que sortea la Ruleta del Azabache: los licores disponibles,
 * con su categoría. Cerveza y pasantes quedan fuera por la bandera `licor` de
 * cada sección, no por una lista de ids aquí: así, al añadir una sección, la
 * decisión se toma en el archivo de la sección y no en este.
 */
export const licores: ItemConCategoria[] = menu
  .filter((c) => c.licor)
  .flatMap((c) =>
    c.items
      .filter((i) => i.disponible !== false)
      .map((i) => ({ ...i, categoriaId: c.id, categoriaTitulo: c.titulo })),
  );
