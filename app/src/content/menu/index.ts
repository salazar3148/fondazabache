import type { ItemConCategoria, Menu } from '@/types/menu';
import { cervezas } from './cervezas';
import { aguardientes } from './aguardientes';
import { ron } from './ron';
import { whisky } from './whisky';
import { tequila } from './tequila';
import { vodka } from './vodka';
import { tragos } from './tragos';
import { pasantes } from './pasantes';

/**
 * El orden de este arreglo es el orden de la carta y de la barra de
 * navegación: primero lo que más se pide (cerveza y aguardiente), luego el
 * ron, después lo importado y lo servido por copa, y de último los pasantes,
 * que es además la sección sin alcohol.
 *
 * Lo importado eran tres bloques dentro de una sola sección "De fuera" y ahora
 * son tres secciones con su propio chip: whisky, tequila y vodka. Van de más
 * a menos referencias (3, 2, 1) para que el bloque abra fuerte y no con una
 * sección de una fila.
 *
 * La copla de la mitad se dibuja en page.tsx antes del índice 3, que sigue
 * cayendo justo aquí: separa lo de la casa (cerveza, aguardiente, ron) de lo
 * de fuera. Si se reordena esta lista, hay que revisar ese corte.
 *
 * Agregar una categoría = crear su archivo y registrarlo aquí. Ningún
 * componente se modifica (docs/05 §7).
 */
export const menu: Menu = [cervezas, aguardientes, ron, whisky, tequila, vodka, tragos, pasantes];

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
