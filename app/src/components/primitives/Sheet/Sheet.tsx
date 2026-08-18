'use client';

import type { ReactNode } from 'react';
import { Drawer } from 'vaul';
import { cn } from '@/lib/cn';
import styles from './Sheet.module.css';

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Obligatorio: es el nombre accesible del diálogo. */
  title: string;
  children: ReactNode;
}

/**
 * docs/07 §2.4 · Wrapper delgado sobre vaul.
 *
 * Aísla la dependencia en un único archivo: si vaul se cambia por otra cosa,
 * se toca aquí y nada más. vaul aporta el arrastre con inercia, el foco
 * atrapado y devuelto al disparador, y el bloqueo del scroll de fondo sin
 * salto de posición — que es exactamente la parte difícil.
 *
 * El título va oculto visualmente porque cada consumidor pinta su propia
 * cabecera; pero existe siempre para `aria-labelledby`.
 */
export function Sheet({ open, onOpenChange, title, children }: SheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className={styles.overlay} />
        <Drawer.Content className={cn('plank', styles.panel)} aria-describedby={undefined}>
          <span className={styles.asa} aria-hidden="true" />
          <Drawer.Title className="sr-only">{title}</Drawer.Title>
          <div className={styles.contenido}>{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
