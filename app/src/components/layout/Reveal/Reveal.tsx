'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import styles from './Reveal.module.css';

export interface RevealProps {
  children: ReactNode;
  /** Retardo en ms. Máximo 120. */
  delay?: number | undefined;
}

/**
 * docs/07 §4.3 · Solo se aplica a las CABECERAS de sección, nunca a las 46
 * filas de productos: animar 46 elementos al hacer scroll es exactamente el
 * abuso que se pidió evitar, y además cuesta.
 */
export function Reveal({ children, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [entroEnVista, setEntroEnVista] = useState(false);
  const reducido = useReducedMotion();

  // Con movimiento reducido se muestra de una: no se toca estado por ello.
  const visible = entroEnVista || reducido;

  useEffect(() => {
    if (reducido) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setEntroEnVista(true);
          observer.disconnect(); // anima una sola vez
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducido]);

  const style = { '--delay': `${Math.min(delay, 120)}ms` } as CSSProperties;

  return (
    <div
      ref={ref}
      className={cn(styles.base, visible ? styles.visible : styles.oculto)}
      style={style}
    >
      {children}
    </div>
  );
}
