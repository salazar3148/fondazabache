import type { MenuItem } from '@/types/menu';
import { cn } from '@/lib/cn';
import { ItemBadges } from '../ItemBadges';
import { PriceTag } from '../PriceTag';
import styles from './MenuItemRow.module.css';

export interface MenuItemRowProps {
  item: MenuItem;
  /** Muestra `item.descripcion` en la fila. Solo `true` en cervezas. */
  mostrarDescripcion?: boolean | undefined;
  /** Resalta la fila. Se usa como resultado de la Ruleta del Azabache. */
  destacado?: boolean | undefined;
  className?: string | undefined;
}

/**
 * docs/07 §5.2 · Server Component. Sin sheet ni interacción: la fila solo
 * informa.
 *
 * La alineación de la primera línea es por `baseline`, no `center`: es lo que
 * hace que el nombre y el precio se lean como una sola línea y no como dos
 * cosas puestas al lado.
 */
export function MenuItemRow({
  item,
  mostrarDescripcion = false,
  destacado = false,
  className,
}: MenuItemRowProps) {
  const agotado = item.disponible === false;

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
      <div className={styles.head}>
        <h3 className={styles.nombre}>{item.nombre}</h3>
        {/* Guía de puntos, puramente decorativa: ata el nombre a su precio. */}
        <span className={styles.guia} aria-hidden="true" />
        <PriceTag valor={item.precio} agotado={agotado} />
      </div>

      {mostrarDescripcion && item.descripcion && (
        <p className={styles.descripcion}>{item.descripcion}</p>
      )}

      {(item.etiquetas?.length || agotado) && (
        <div className={styles.meta}>
          {agotado && <span className={styles.noHay}>Hoy no hay</span>}
          <ItemBadges etiquetas={item.etiquetas} />
        </div>
      )}
    </li>
  );
}
