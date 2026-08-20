'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { useReducedMotion } from './useReducedMotion';

const CLAVE = 'azabache:sonido';

/**
 * Valor vigente en esta pestaña. Es la fuente de verdad una vez leída la
 * preferencia guardada, y además el respaldo cuando localStorage no está
 * disponible (Safari en navegación privada tira al escribir): así el
 * interruptor siempre responde, aunque la decisión no sobreviva a la visita.
 */
let memoria: boolean | null = null;

/** Suscriptores de useSyncExternalStore. */
const oyentes = new Set<() => void>();

function leer(): boolean {
  if (memoria === null) {
    try {
      memoria = window.localStorage.getItem(CLAVE) !== 'off';
    } catch {
      memoria = true;
    }
  }
  return memoria;
}

function escribir(valor: boolean): void {
  memoria = valor;
  try {
    window.localStorage.setItem(CLAVE, valor ? 'on' : 'off');
  } catch {
    // Sin persistencia entre visitas, pero el interruptor sigue funcionando.
  }
  for (const avisar of oyentes) avisar();
}

function subscribe(onChange: () => void): () => void {
  oyentes.add(onChange);
  return () => {
    oyentes.delete(onChange);
  };
}

/** En el servidor no se puede saber; el interruptor se pinta encendido. */
const getServerSnapshot = () => true;

export interface UseSound {
  /** Lo que el usuario eligió. Es lo que refleja el interruptor. */
  activo: boolean;
  /** `activo` y además el sistema no pide menos movimiento. Es lo que se obedece. */
  habilitado: boolean;
  alternar: () => void;
}

/**
 * ¿Suena la Ruleta?
 *
 * Viene encendido por defecto, y eso es defendible porque el sonido solo se
 * dispara dentro de un toque deliberado en la Ruleta — nunca al cargar la
 * carta ni al hacer scroll. Aun así hay interruptor visible en el sheet y la
 * decisión se recuerda en localStorage.
 *
 * `prefers-reduced-motion` también apaga el sonido. No existe una consulta de
 * medios para "menos sonido", y quien pide menos estímulo de movimiento
 * normalmente tampoco quiere que el teléfono suene: es el fail-safe razonable.
 *
 * La preferencia guardada es estado externo, así que se lee con
 * useSyncExternalStore y no con useEffect + setState — igual que
 * useReducedMotion, y por el mismo motivo.
 */
export function useSound(): UseSound {
  const reducido = useReducedMotion();
  const activo = useSyncExternalStore(subscribe, leer, getServerSnapshot);

  const alternar = useCallback(() => escribir(!leer()), []);

  return { activo, habilitado: activo && !reducido, alternar };
}
