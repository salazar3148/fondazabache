'use client';

import type { MenuItem } from '@/types/menu';
import { Sheet } from '@/components/primitives/Sheet';
import { Button } from '@/components/primitives/Button';
import { PriceTag } from '../PriceTag';
import { ItemBadges } from '../ItemBadges';
import styles from './ItemSheet.module.css';

export interface ItemSheetContentProps {
  item: MenuItem;
  relacionados: Array<{ item: MenuItem; categoriaId: string }>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * docs/07 §5.5 · El contenido del bottom sheet. Se carga con next/dynamic
 * desde el disparador, así que vaul no entra en el bundle inicial.
 *
 * No tiene formulario, ni cantidad, ni "agregar al pedido": no hay pedido. La
 * carta informa, el mesero atiende. Los relacionados NAVEGAN a su sección y
 * cierran el sheet; encadenar modales es un laberinto, y peor con trago.
 */
export function ItemSheetContent({
  item,
  relacionados,
  open,
  onOpenChange,
}: ItemSheetContentProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={item.nombre}>
      <div className={styles.cabecera}>
        <p className={styles.nombre}>{item.nombre}</p>
        <PriceTag valor={item.precio} />
      </div>

      {item.etiquetas?.length ? (
        <div className={styles.badges}>
          <ItemBadges etiquetas={item.etiquetas} />
        </div>
      ) : null}

      {item.descripcion && <p className={styles.descripcion}>{item.descripcion}</p>}

      <span className={`brassRule ${styles.filete}`} aria-hidden="true" />

      <p className={styles.relato}>«{item.relato}»</p>

      {relacionados.length > 0 && (
        <>
          <p className={styles.relacionadosTitulo} id={`va-bien-con-${item.id}`}>
            Va bien con
          </p>
          <ul className={styles.relacionados} aria-labelledby={`va-bien-con-${item.id}`}>
            {relacionados.map(({ item: rel, categoriaId }) => (
              <li key={rel.id}>
                <a
                  href={`#${categoriaId}`}
                  className={styles.relacionado}
                  onClick={() => onOpenChange(false)}
                >
                  <span className={styles.relacionadoNombre}>{rel.nombre}</span>
                  <PriceTag valor={rel.precio} />
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      <Button
        variant="ghost"
        size="lg"
        className={styles.cerrar}
        onClick={() => onOpenChange(false)}
      >
        Cerrar
      </Button>
    </Sheet>
  );
}
