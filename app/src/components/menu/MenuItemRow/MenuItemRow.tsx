import type { MenuItem } from '@/types/menu';
import { ChevronDown } from '@/components/icons';
import { cn } from '@/lib/cn';
import { ItemBadges } from '../ItemBadges';
import { PriceTag } from '../PriceTag';
import { ItemSheetTrigger } from '../ItemSheet';
import styles from './MenuItemRow.module.css';

export interface MenuItemRowProps {
  item: MenuItem;
  /** Productos de `vaBienCon` ya resueltos, con la sección a la que saltan. */
  relacionados?: Array<{ item: MenuItem; categoriaId: string }> | undefined;
  /** Resalta la fila. Se usa como resultado de la Ruleta del Arriero. */
  destacado?: boolean | undefined;
  className?: string | undefined;
}

/**
 * docs/07 §5.2 · Server Component. Solo la envoltura del sheet es cliente, y
 * solo en las filas que tienen relato (4 de 46).
 *
 * La alineación de la primera línea es por `baseline`, no `center`: es lo que
 * hace que el nombre y el precio se lean como una sola línea y no como dos
 * cosas puestas al lado.
 *
 * Sin relato, la fila NO es tocable: cero falsas promesas.
 */
export function MenuItemRow({
  item,
  relacionados = [],
  destacado = false,
  className,
}: MenuItemRowProps) {
  const agotado = item.disponible === false;
  const tieneRelato = Boolean(item.relato) && !agotado;

  const contenido = (
    <>
      <div className={styles.head}>
        <h3 className={styles.nombre}>{item.nombre}</h3>
        <PriceTag valor={item.precio} agotado={agotado} />
      </div>

      {item.descripcion && <p className={styles.descripcion}>{item.descripcion}</p>}

      {(item.volumen || item.etiquetas?.length || agotado || tieneRelato) && (
        <div className={styles.meta}>
          {item.volumen && <span className={styles.volumen}>{item.volumen}</span>}
          {agotado && <span className={styles.noHay}>Hoy no hay</span>}
          <ItemBadges etiquetas={item.etiquetas} />
          {tieneRelato && (
            <span className={styles.leer} aria-hidden="true">
              <ChevronDown className={styles.leerIcono} />
              leer
            </span>
          )}
        </div>
      )}
    </>
  );

  return (
    <li
      id={`item-${item.id}`}
      className={cn(
        styles.row,
        destacado && styles.destacado,
        agotado && styles.agotado,
        className,
      )}
    >
      {contenido}
      {tieneRelato && <ItemSheetTrigger item={item} relacionados={relacionados} />}
    </li>
  );
}
