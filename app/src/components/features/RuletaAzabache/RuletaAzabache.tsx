'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ItemConCategoria } from '@/types/menu';
import { Horseshoe } from '@/components/icons';
import { useAtBottom } from '@/hooks/useAtBottom';
import { cn } from '@/lib/cn';
import styles from './RuletaAzabache.module.css';

/** El sheet, vaul y la lógica del sorteo solo bajan al primer toque. */
const RuletaSheet = dynamic(() => import('./RuletaSheet').then((m) => m.RuletaSheet), {
  ssr: false,
  loading: () => null,
});

export interface RuletaAzabacheProps {
  /** Solo licores. El filtro se hace en content/menu/index.ts. */
  items: readonly ItemConCategoria[];
  /** id del elemento de portada: el botón aparece cuando deja de verse. */
  portadaId: string;
}

/**
 * docs/07 §6.1 · El diferenciador de la carta, y lo único que no es
 * "una carta bien hecha".
 *
 * En una fonda, a las dos horas el problema no es no saber qué hay: es no
 * poder decidir. Alguien dice "pida cualquier cosa" y nadie se anima. Esto lo
 * resuelve, es un objeto social (se le muestra al de al lado) y encaja con
 * azabache como amuleto: la casa le echa la suerte. Cuesta ~2 KB que solo se
 * descargan si se usa.
 *
 * El aviso "¿No sabe qué pedir?" está atado al final del scroll y no a un
 * temporizador. Es mejor así por dos razones: la pregunta llega justo cuando
 * el visitante acabó de leer la carta completa y sigue sin decidir — que es
 * literalmente el momento del problema —, y no interrumpe la lectura de nadie
 * que todavía esté mirando. Antes salía a los 3 segundos, una sola vez por
 * sesión, y se lo comía cualquiera que estuviera leyendo.
 */
export function RuletaAzabache({ items, portadaId }: RuletaAzabacheProps) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [montado, setMontado] = useState(false);
  const { ref: centinela, enFondo } = useAtBottom();

  // El FAB aparece cuando la portada sale del viewport.
  useEffect(() => {
    const portada = document.getElementById(portadaId);
    if (!portada) {
      // No se fuerza a visible: sin la portada no se sabe cuándo estorba. Los
      // dos lados usan la misma constante PORTADA_ID, así que esto solo pasa
      // si alguien la desconecta.
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`RuletaAzabache: no existe #${portadaId}. El botón no aparecerá.`);
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

  const abrir = () => {
    setMontado(true);
    setOpen(true);
  };

  /**
   * El aviso solo cuando ya no se puede bajar más y con el sheet cerrado. No
   * se desmonta al ocultarse: se queda en el DOM con la clase quitada, porque
   * un elemento que aparece de cero no puede transicionar su propia entrada.
   */
  const avisando = enFondo && visible && !open;

  return (
    <>
      <span className={cn(styles.aviso, avisando && styles.avisoVisible)} aria-hidden="true">
        ¿No sabe qué pedir?
      </span>

      <button
        type="button"
        className={cn(styles.fab, visible && styles.fabVisible)}
        onClick={abrir}
        aria-label="Que la casa elija por usted"
        aria-haspopup="dialog"
        aria-expanded={open}
        tabIndex={visible ? 0 : -1}
      >
        {/* Onda de atención. Solo late mientras el aviso está a la vista, así
            que no hay una animación infinita corriendo durante toda la carta. */}
        <span className={cn(styles.onda, avisando && styles.ondaActiva)} aria-hidden="true" />
        <Horseshoe className={styles.fabIcono} />
      </button>

      {montado && <RuletaSheet items={items} open={open} onOpenChange={setOpen} />}

      {/**
       * Centinela del final del documento. Tiene que ser el ÚLTIMO elemento en
       * el flujo, y por eso vive aquí: la Ruleta es el último componente de la
       * página y todo lo demás que renderiza es `position: fixed`.
       *
       * El margen negativo compensa su propio píxel de alto: así no añade
       * scroll y "el fondo" sigue siendo el fondo del pie.
       */}
      <span ref={centinela} className={styles.centinela} aria-hidden="true" />
    </>
  );
}
