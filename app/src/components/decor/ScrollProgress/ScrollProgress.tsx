'use client';

import { useEffect, useRef } from 'react';
import styles from './ScrollProgress.module.css';

/**
 * Filete de brasa que marca cuánto queda de carta, igual que en Bello.
 *
 * En una carta de seis secciones que se recorre con el pulgar, saber "voy por
 * la mitad" evita el scroll infinito a ciegas. Es puramente decorativo
 * (aria-hidden): la información también está en la pastilla activa de la barra.
 *
 * Anima `scale-x` sobre una barra ya pintada y lo hace dentro de un rAF con
 * guardia: nunca escribe más de una vez por frame.
 */
export function ScrollProgress() {
  const barra = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = barra.current;
    if (!el) return;

    let pendiente = false;

    const pintar = () => {
      pendiente = false;
      const recorrido = document.documentElement.scrollHeight - window.innerHeight;
      const avance = recorrido > 0 ? Math.min(window.scrollY / recorrido, 1) : 0;
      el.style.scale = `${avance.toFixed(4)} 1`;
    };

    const onScroll = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(pintar);
    };

    pintar();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className={styles.pista} aria-hidden="true">
      <span ref={barra} className={styles.barra} />
    </div>
  );
}
