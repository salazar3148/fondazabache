'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ItemConCategoria } from '@/types/menu';
import { useReducedMotion } from './useReducedMotion';

/**
 * Siete pasos de 90 ms = 630 ms de barajeo. Es el tiempo que la rueda tarda en
 * frenar en la interfaz (RuletaAzabache.module.css), y no es coincidencia: si
 * el sorteo terminara antes que la rueda, el nombre aparecería con la rueda
 * todavía girando y se rompería la ilusión.
 */
const PASOS = 7;
const PASO_MS = 90;

/** Total de pasos del barajeo. Lo usa el sonido para afinar el tono del tic. */
export const PASOS_BARAJEO = PASOS;

/**
 * docs/07 §7.4 y docs/08 §6.3 · Toda la lógica de la Ruleta del Azabache.
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

export interface UseRandomItemOpciones {
  /**
   * Se llama en cada paso del barajeo, con `paso` de 1 a PASOS_BARAJEO. Aquí
   * vive el tic del trinquete.
   *
   * Va como callback y no dentro del componente porque el ritmo lo marca este
   * hook: replicar el temporizador fuera para sonar a la vez sería tener dos
   * relojes que se desincronizan.
   */
  alPaso?: ((paso: number, total: number) => void) | undefined;
  /** Se llama una sola vez, al fijar el resultado. */
  alFijar?: (() => void) | undefined;
}

export interface UseRandomItem {
  actual: ItemConCategoria | null;
  barajeando: boolean;
  /** Nombre que se muestra durante el barajeo. */
  vistazo: string | null;
  /** Cuántas veces se ha girado. La rueda acumula rotación con esto. */
  giros: number;
  girar: () => void;
}

export function useRandomItem(
  items: readonly ItemConCategoria[],
  opciones: UseRandomItemOpciones = {},
): UseRandomItem {
  const reducido = useReducedMotion();
  const [actual, setActual] = useState<ItemConCategoria | null>(null);
  const [barajeando, setBarajeando] = useState(false);
  const [vistazo, setVistazo] = useState<string | null>(null);
  const [giros, setGiros] = useState(0);
  const timer = useRef<number | null>(null);

  /**
   * Los callbacks van en una ref para que `girar` no cambie de identidad cada
   * vez que el componente los redefine. Si dependiera de ellos, el efecto de
   * apertura del sheet se volvería a disparar en cada render.
   *
   * La ref se sincroniza en un efecto sin dependencias, no en el cuerpo del
   * render: escribir una ref durante el render es justo lo que prohíbe
   * react-hooks/refs. El orden funciona porque este efecto se registra antes
   * que el del componente que llama a `girar`.
   */
  const cb = useRef(opciones);

  useEffect(() => {
    cb.current = opciones;
  });

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

    setGiros((n) => n + 1);

    // Con movimiento reducido: resultado directo, sin barajeo. Sigue funcionando.
    if (reducido) {
      setVistazo(null);
      setBarajeando(false);
      setActual(resultado);
      cb.current.alFijar?.();
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
        cb.current.alFijar?.();
        return;
      }
      const vistaPrevia = items[Math.floor(Math.random() * items.length)];
      setVistazo(vistaPrevia?.nombre ?? null);
      cb.current.alPaso?.(paso, PASOS);
    }, PASO_MS);
  }, [actual, items, reducido]);

  return { actual, barajeando, vistazo, giros, girar };
}
