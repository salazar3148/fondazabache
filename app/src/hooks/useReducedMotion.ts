'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

/** En el servidor no se sabe: se asume reducido. Fail-safe hacia lo accesible. */
const getServerSnapshot = () => true;

/**
 * docs/07 §7.2 · La preferencia del sistema es estado externo, así que se lee
 * con useSyncExternalStore y no con useEffect + setState.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
