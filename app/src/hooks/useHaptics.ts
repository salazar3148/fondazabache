'use client';

import { useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';

const MAX_MS = 15;

/**
 * docs/07 §7.3 · Vibración con guardas: iOS Safari no soporta
 * `navigator.vibrate`, y con movimiento reducido no se vibra nunca.
 * Se usa SOLO al fijar el resultado de la Ruleta.
 */
export function useHaptics(): (ms?: number) => void {
  const reducido = useReducedMotion();

  return useCallback(
    (ms = 10) => {
      if (reducido) return;
      if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
      navigator.vibrate(Math.min(ms, MAX_MS));
    },
    [reducido],
  );
}
