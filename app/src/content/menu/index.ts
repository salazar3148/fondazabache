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

/** Todos los productos disponibles, con su categoría. Lo usa la Ruleta. */
export const todosLosItems: ItemConCategoria[] = menu.flatMap((c) =>
  c.items
    .filter((i) => i.disponible !== false)
    .map((i) => ({ ...i, categoriaId: c.id, categoriaTitulo: c.titulo })),
);

/**
 * Índice id → { producto, sección donde vive }. Lo usa "Va bien con" del
 * bottom sheet, que necesita el ancla de destino además del producto.
 */
export const itemsPorId = new Map(
  menu.flatMap((c) => c.items.map((item) => [item.id, { item, categoriaId: c.id }] as const)),
);
