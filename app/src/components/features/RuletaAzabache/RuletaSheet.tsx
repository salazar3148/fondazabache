'use client';

import { useEffect } from 'react';
import type { ItemConCategoria } from '@/types/menu';
import { Sheet } from '@/components/primitives/Sheet';
import { Button } from '@/components/primitives/Button';
import { Sello } from '@/components/decor/Sello';
import { PriceTag } from '@/components/menu/PriceTag';
import { useRandomItem } from '@/hooks/useRandomItem';
import { useHaptics } from '@/hooks/useHaptics';
import { cn } from '@/lib/cn';
import styles from './RuletaAzabache.module.css';

export interface RuletaSheetProps {
  items: readonly ItemConCategoria[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Cuánto dura el resaltado de la fila al llegar desde la Ruleta. */
const DESTACADO_MS = 3000;

export function RuletaSheet({ items, open, onOpenChange }: RuletaSheetProps) {
  const { actual, barajeando, vistazo, girar } = useRandomItem(items);
  const vibrar = useHaptics();

  // Al abrir, gira solo: el usuario ya expresó su intención al tocar.
  useEffect(() => {
    if (open && !actual && !barajeando) girar();
    // girar cambia de identidad en cada resultado; solo interesa el momento de apertura.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Vibración de 12 ms al fijar el resultado (docs/08 §6.2).
  useEffect(() => {
    if (actual) vibrar(12);
  }, [actual, vibrar]);

  /**
   * "Ver en la carta": cierra, salta a la sección y resalta la fila 3 s.
   *
   * El resaltado se aplica por DOM sobre la clase global `destacado-ruleta` en
   * vez de subir estado hasta la página: sin él, el usuario llega a la sección
   * y tiene que buscar el producto entre trece. Con él, lo ve de una.
   */
  const verEnLaCarta = () => {
    if (!actual) return;
    const id = actual.id;
    const categoriaId = actual.categoriaId;
    onOpenChange(false);

    window.setTimeout(() => {
      window.location.hash = `#${categoriaId}`;
      const fila = document.getElementById(`item-${id}`);
      if (!fila) return;
      fila.classList.add('destacado-ruleta');
      window.setTimeout(() => fila.classList.remove('destacado-ruleta'), DESTACADO_MS);
    }, 260);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="El azabache eligió">
      <div className={styles.panel}>
        <Sello className={styles.sello}>El azabache eligió</Sello>

        {/* Durante el barajeo el área es aria-hidden: no se marea al lector de
            pantalla con siete nombres que no son el resultado. */}
        {barajeando && (
          <p className={styles.barajeo} aria-hidden="true">
            {vistazo ?? '…'}
          </p>
        )}

        {/* Solo el resultado final se anuncia, y sin interrumpir. */}
        <div aria-live="polite" className={styles.resultado}>
          {actual && (
            <div className={cn(styles.resultado, styles.destello)}>
              <p className={styles.nombre}>{actual.nombre}</p>
              <PriceTag valor={actual.precio} />
              {actual.descripcion && <p className={styles.descripcion}>{actual.descripcion}</p>}
              <p className={styles.categoria}>{actual.categoriaTitulo}</p>
            </div>
          )}
        </div>

        {!actual && !barajeando && <p className={styles.vacio}>Hoy no hay nada que sortear.</p>}

        <div className={styles.acciones}>
          <Button variant="brass" className={styles.accion} onClick={girar}>
            Otra vez
          </Button>
          <Button
            variant="primary"
            className={styles.accion}
            onClick={verEnLaCarta}
            disabled={!actual}
          >
            Ver en la carta
          </Button>
        </div>

        <Button variant="ghost" className={styles.accion} onClick={() => onOpenChange(false)}>
          Cerrar
        </Button>
      </div>
    </Sheet>
  );
}
