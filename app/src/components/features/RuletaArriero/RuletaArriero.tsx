'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ItemConCategoria } from '@/types/menu';
import { Horseshoe } from '@/components/icons';
import { cn } from '@/lib/cn';
import styles from './RuletaArriero.module.css';

/** El sheet, vaul y la lógica del sorteo solo bajan al primer toque. */
const RuletaSheet = dynamic(() => import('./RuletaSheet').then((m) => m.RuletaSheet), {
  ssr: false,
  loading: () => null,
});

export interface RuletaArrieroProps {
  items: readonly ItemConCategoria[];
  /** id del elemento de portada: el botón aparece cuando deja de verse. */
  portadaId: string;
}

const CLAVE_TOOLTIP = 'azabache:ruleta-vista';

/**
 * docs/07 §6.1 · El diferenciador de la carta, y lo único que no es
 * "una carta bien hecha".
 *
 * En una fonda, a las dos horas el problema no es no saber qué hay: es no
 * poder decidir. Alguien dice "pida cualquier cosa" y nadie se anima. Esto lo
 * resuelve, es un objeto social (se le muestra al de al lado) y encaja con
 * azabache como amuleto: la casa le echa la suerte. Cuesta ~2 KB que solo se
 * descargan si se usa.
 */
export function RuletaArriero({ items, portadaId }: RuletaArrieroProps) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [montado, setMontado] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  // El FAB aparece cuando la portada sale del viewport.
  useEffect(() => {
    const portada = document.getElementById(portadaId);
    if (!portada) {
      // No se fuerza a visible: sin la portada no se sabe cuándo estorba. Los
      // dos lados usan la misma constante PORTADA_ID, así que esto solo pasa
      // si alguien la desconecta.
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`RuletaArriero: no existe #${portadaId}. El botón no aparecerá.`);
      }
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!(entry?.isIntersecting ?? false)),
      { threshold: 0.15 },
    );
    observer.observe(portada);
    return () => observer.disconnect();
  }, [portadaId]);

  // Tooltip de primera vez: a los 3 s de aparecer, una sola vez por sesión.
  useEffect(() => {
    if (!visible || open) return;
    if (sessionStorage.getItem(CLAVE_TOOLTIP)) return;

    const mostrar = window.setTimeout(() => setTooltip(true), 3000);
    const ocultar = window.setTimeout(() => {
      setTooltip(false);
      sessionStorage.setItem(CLAVE_TOOLTIP, '1');
    }, 8000);

    return () => {
      window.clearTimeout(mostrar);
      window.clearTimeout(ocultar);
    };
  }, [visible, open]);

  const abrir = () => {
    setTooltip(false);
    sessionStorage.setItem(CLAVE_TOOLTIP, '1');
    setMontado(true);
    setOpen(true);
  };

  return (
    <>
      {tooltip && (
        <span className={styles.tooltip} aria-hidden="true">
          ¿No sabe qué pedir?
        </span>
      )}

      <button
        type="button"
        className={cn(styles.fab, visible && styles.fabVisible)}
        onClick={abrir}
        aria-label="Que la casa elija por usted"
        aria-haspopup="dialog"
        aria-expanded={open}
        tabIndex={visible ? 0 : -1}
      >
        <Horseshoe className={styles.fabIcono} />
      </button>

      {montado && <RuletaSheet items={items} open={open} onOpenChange={setOpen} />}
    </>
  );
}
