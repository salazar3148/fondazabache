'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ItemConCategoria } from '@/types/menu';
import { useReducedMotion } from './useReducedMotion';

const PASOS = 7;
const PASO_MS = 90;

/**
 * docs/07 §7.4 y docs/08 §6.3 · Toda la lógica de la Ruleta del Arriero.
 *
 * Dos reglas que sostienen la magia:
 *   · nunca elige un producto agotado;
 *   · nunca repite el resultado inmediatamente anterior. Que "Otra vez"
 *     devuelva lo mismo mata el juguete al primer intento.
 */
export function elegir(
  items: readonly ItemConCategoria[],
  anterior: string | null,
): ItemConCategoria | null {
  const disponibles = items.filter((i) => i.disponible !== false);
  if (disponibles.length === 0) return null;

  const candidatos =
    disponibles.length > 1 ? disponibles.filter((i) => i.id !== anterior) : disponibles;

  const elegido = candidatos[Math.floor(Math.random() * candidatos.length)];
  return elegido ?? null;
}

export interface UseRandomItem {
  actual: ItemConCategoria | null;
  barajeando: boolean;
  /** Nombre que se muestra durante el barajeo. */
  vistazo: string | null;
  girar: () => void;
}

export function useRandomItem(items: readonly ItemConCategoria[]): UseRandomItem {
  const reducido = useReducedMotion();
  const [actual, setActual] = useState<ItemConCategoria | null>(null);
  const [barajeando, setBarajeando] = useState(false);
  const [vistazo, setVistazo] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const limpiar = () => {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => limpiar, []);

  const girar = useCallback(() => {
    limpiar();
    const anterior = actual?.id ?? null;
    const resultado = elegir(items, anterior);
    if (!resultado) return;

    // Con movimiento reducido: resultado directo, sin barajeo. Sigue funcionando.
    if (reducido) {
      setVistazo(null);
      setBarajeando(false);
      setActual(resultado);
      return;
    }

    setActual(null);
    setBarajeando(true);

    let paso = 0;
    timer.current = window.setInterval(() => {
      paso += 1;
      if (paso >= PASOS) {
        limpiar();
        setVistazo(null);
        setBarajeando(false);
        setActual(resultado);
        return;
      }
      const vistaPrevia = items[Math.floor(Math.random() * items.length)];
      setVistazo(vistaPrevia?.nombre ?? null);
    }, PASO_MS);
  }, [actual, items, reducido]);

  return { actual, barajeando, vistazo, girar };
}
