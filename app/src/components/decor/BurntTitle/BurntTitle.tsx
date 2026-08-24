import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './BurntTitle.module.css';

export type BurntIntensity = 'hot' | 'warm' | 'scorch' | 'bone';

export interface BurntTitleProps {
  children: ReactNode;
  /** El nivel de encabezado es semántica, no estilo: se pasa siempre. */
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p' | undefined;
  intensity?: BurntIntensity | undefined;
  id?: string | undefined;
  className?: string | undefined;
}

/** Server Component. El efecto firma de la marca. docs/03 §4 */
export function BurntTitle({
  children,
  as: Tag = 'h2',
  intensity = 'warm',
  id,
  className,
}: BurntTitleProps) {
  return (
    <Tag id={id} className={cn(styles.burnt, styles[intensity], className)}>
      {children}
    </Tag>
  );
}
