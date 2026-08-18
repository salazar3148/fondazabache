import type { ReactNode } from 'react';
import styles from './VisuallyHidden.module.css';

/**
 * Texto solo para lector de pantalla. clip-path, no display:none ni
 * visibility:hidden, que lo ocultarían también al lector. docs/07 §2.5
 */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className={styles.vh}>{children}</span>;
}
