'use client';

import { useEffect, useState } from 'react';
import { NAV_HEIGHT_PX } from '@/lib/constants';

/**
 * docs/07 §7.1 · Un único IntersectionObserver para todas las secciones.
 *
 * El `-55%` inferior del rootMargin es lo que evita el parpadeo del chip
 * cuando dos secciones son visibles a la vez. Y se devuelve la ÚLTIMA sección
 * que entró, no la de mayor intersectionRatio: con secciones de altura muy
 * distinta (una de 5 filas y una de 13) el ratio da resultados
 * contraintuitivos.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [activa, setActiva] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    const elementos = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!elementos.length) return;

    const safeTop = Number.parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--safe-top') || '0',
      10,
    );
    const top = NAV_HEIGHT_PX + (Number.isNaN(safeTop) ? 0 : safeTop) + 12;

    const visibles = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibles.add(entry.target.id);
          else visibles.delete(entry.target.id);
        }
        // La última en orden de documento entre las visibles
        const enOrden = ids.filter((id) => visibles.has(id));
        const ultima = enOrden.at(-1);
        if (ultima) setActiva(ultima);
      },
      { rootMargin: `-${top}px 0px -55% 0px`, threshold: 0 },
    );

    for (const el of elementos) observer.observe(el);

    // Al llegar al final de la página, forzar la última sección: si no, nunca
    // se activa porque no alcanza a cruzar el umbral.
    const onScroll = () => {
      const alFinal = window.innerHeight + window.scrollY >= document.body.scrollHeight - 24;
      if (alFinal) setActiva(ids.at(-1) ?? null);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [ids]);

  return activa;
}
