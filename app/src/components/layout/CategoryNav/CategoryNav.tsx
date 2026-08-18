'use client';

import { useEffect, useRef, useState } from 'react';
import type { MenuCategory } from '@/types/menu';
import { Chip } from '@/components/primitives/Chip';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import styles from './CategoryNav.module.css';

export interface CategoryNavProps {
  categorias: Array<Pick<MenuCategory, 'id' | 'chip'>>;
}

/**
 * docs/07 §4.2 · El único componente cliente indispensable de la carta.
 *
 * Sin JS sigue funcionando: los chips son anclas reales. Se pierde solo el
 * resaltado automático del chip activo.
 */
export function CategoryNav({ categorias }: CategoryNavProps) {
  const ids = categorias.map((c) => c.id);
  const activa = useActiveSection(ids);
  const reducido = useReducedMotion();
  const [despegada, setDespegada] = useState(false);
  const pista = useRef<HTMLUListElement>(null);

  // Micro-interacción 4: la barra se despega del contenido al hacer scroll
  useEffect(() => {
    const onScroll = () => setDespegada(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /**
   * Centrado manual del chip activo. NO se usa scrollIntoView: mueve el scroll
   * de todos los ancestros scrolleables, incluido el vertical de la página.
   * Es el bug clásico de esta barra (docs/08 §4.2, error 1).
   */
  useEffect(() => {
    const contenedor = pista.current;
    if (!contenedor || !activa) return;

    const chip = contenedor.querySelector<HTMLElement>(`[href="#${activa}"]`);
    if (!chip) return;

    const objetivo = chip.offsetLeft - contenedor.clientWidth / 2 + chip.clientWidth / 2;
    contenedor.scrollTo({
      left: Math.max(0, objetivo),
      behavior: reducido ? 'auto' : 'smooth',
    });
  }, [activa, reducido]);

  return (
    <nav
      aria-label="Secciones de la carta"
      className={cn(styles.nav, despegada && styles.despegada)}
    >
      <ul className={styles.pista} ref={pista}>
        {categorias.map((c) => (
          <li key={c.id}>
            <Chip href={`#${c.id}`} active={c.id === activa}>
              {c.chip}
            </Chip>
          </li>
        ))}
      </ul>
    </nav>
  );
}
