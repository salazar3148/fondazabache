'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { MenuItem } from '@/types/menu';
import styles from './ItemSheet.module.css';

/**
 * vaul (~7 KB gz) y el contenido del sheet se descargan solo cuando el usuario
 * toca una fila con relato. Antes de eso, este disparador pesa unos cientos de
 * bytes (docs/07 §5.5).
 */
const ItemSheetContent = dynamic(
  () => import('./ItemSheetContent').then((m) => m.ItemSheetContent),
  { ssr: false, loading: () => null },
);

export interface ItemSheetTriggerProps {
  item: MenuItem;
  relacionados: Array<{ item: MenuItem; categoriaId: string }>;
}

/**
 * El disparador es un botón transparente estirado sobre toda la fila, no una
 * envoltura del contenido.
 *
 * Motivo: el contenido de un `<button>` solo admite contenido de frase, y la
 * fila lleva un `<h3>` con el nombre del producto. Envolverla rompería el HTML
 * y, con él, la navegación por encabezados en lectores de pantalla. Así la fila
 * entera sigue siendo tocable y la semántica queda intacta.
 */
export function ItemSheetTrigger({ item, relacionados }: ItemSheetTriggerProps) {
  const [open, setOpen] = useState(false);
  // No se monta el sheet hasta el primer toque: el chunk no se pide nunca si el
  // usuario solo lee la carta.
  const [montado, setMontado] = useState(false);

  const abrir = () => {
    setMontado(true);
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={abrir}
        aria-label={`${item.nombre}: leer la historia`}
        aria-haspopup="dialog"
        aria-expanded={open}
      />

      {montado && (
        <ItemSheetContent
          item={item}
          relacionados={relacionados}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </>
  );
}
