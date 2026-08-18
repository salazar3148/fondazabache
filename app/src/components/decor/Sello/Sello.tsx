import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './Sello.module.css';

export interface SelloProps {
  /** Texto corto, 2–4 palabras. */
  children: ReactNode;
  size?: 'sm' | 'md' | undefined;
  className?: string | undefined;
}

/** docs/03 §7 · Server Component. Es el gesto más fuerte del sistema. */
export function Sello({ children, size = 'md', className }: SelloProps) {
  return (
    <span className={cn(styles.sello, size === 'sm' && styles.sm, className)}>
      <span className={styles.texto}>{children}</span>
    </span>
  );
}
