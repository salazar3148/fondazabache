'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';

/**
 * Margen de tolerancia, en píxeles, para considerar que ya no se puede bajar
 * más. Expande el borde inferior del viewport para el observer, así que el
 * centinela cuenta como visible unos píxeles antes del fondo exacto.
 *
 * Sin esta holgura el estado parpadea: el rebote elástico de iOS, el zoom del
 * navegador y el redondeo a píxel entero hacen que "el fondo" no sea un número
 * exacto sino una franja.
 */
const HOLGURA_PX = 24;

export interface UseAtBottom {
  /** Se pone en el último elemento del documento. */
  ref: RefObject<HTMLSpanElement | null>;
  /** true cuando el centinela está a la vista: ya no se puede bajar más. */
  enFondo: boolean;
}

/**
 * ¿Está el usuario al final de la página, sin más scroll disponible?
 *
 * Va con IntersectionObserver sobre un centinela y NO con un listener de
 * scroll: el observer solo despierta al cruzar el umbral, mientras que un
 * listener corre en cada frame de scroll. La carta ya paga uno (WhatsAppFab) y
 * no hacía falta un segundo.
 *
 * El centinela lo coloca quien use el hook, y tiene que ser el último elemento
 * en el flujo del documento (ver RuletaAzabache).
 */
export function useAtBottom(): UseAtBottom {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [enFondo, setEnFondo] = useState(false);

  useEffect(() => {
    const centinela = ref.current;
    if (!centinela) return;

    const observer = new IntersectionObserver(
      ([entry]) => setEnFondo(entry?.isIntersecting ?? false),
      { rootMargin: `0px 0px ${HOLGURA_PX}px 0px` },
    );
    observer.observe(centinela);
    return () => observer.disconnect();
  }, []);

  return { ref, enFondo };
}
