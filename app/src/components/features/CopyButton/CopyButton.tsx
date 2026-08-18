'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import styles from './CopyButton.module.css';

/** La capacidad del navegador no cambia en runtime: nada a lo que suscribirse. */
const noSubscribe = () => () => {};
const hayClipboard = () => typeof navigator !== 'undefined' && !!navigator.clipboard;
const enServidorNoHay = () => false;

export interface CopyButtonProps {
  valor: string;
  /** Qué se copia, para el nombre accesible. Ej: "la clave del wifi". */
  descripcion: string;
}

/**
 * docs/07 §6.3 · Componente cliente diminuto (~0.4 KB) aislado para que
 * `InfoFonda` siga siendo Server Component.
 *
 * Si `navigator.clipboard` no existe, no se renderiza nada: el texto sigue
 * siendo seleccionable a mano. Degradación limpia.
 */
export function CopyButton({ valor, descripcion }: CopyButtonProps) {
  const soportado = useSyncExternalStore(noSubscribe, hayClipboard, enServidorNoHay);
  const [copiada, setCopiada] = useState(false);

  useEffect(() => {
    if (!copiada) return;
    const t = window.setTimeout(() => setCopiada(false), 2000);
    return () => window.clearTimeout(t);
  }, [copiada]);

  if (!soportado) return null;

  const copiar = () => {
    navigator.clipboard.writeText(valor).then(
      () => setCopiada(true),
      () => setCopiada(false),
    );
  };

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={copiar}
      aria-label={copiada ? `Se copió ${descripcion}` : `Copiar ${descripcion}`}
    >
      {copiada ? 'Copiada' : 'Copiar'}
    </button>
  );
}
