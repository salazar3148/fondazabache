import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './Chip.module.css';

export interface ChipProps {
  children: ReactNode;
  /** Ancla real: "#del-estante". Funciona sin JS. */
  href: string;
  active?: boolean | undefined;
}

/**
 * docs/07 §2.2 · Es un <a href="#..."> real, no un botón con scrollIntoView:
 * así funciona sin JS, se puede compartir el enlace y el navegador maneja el
 * scroll suave con scroll-padding-top.
 */
export function Chip({ children, href, active = false }: ChipProps) {
  return (
    <a
      href={href}
      className={cn(styles.chip, active && styles.active)}
      aria-current={active ? 'true' : undefined}
    >
      {children}
    </a>
  );
}
