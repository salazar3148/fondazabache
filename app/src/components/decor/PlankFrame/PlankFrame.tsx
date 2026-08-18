import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './PlankFrame.module.css';

export interface PlankFrameProps {
  children: ReactNode;
  /** Añade los 4 remaches de latón. Solo portada y cabeceras de sección. */
  studs?: boolean | undefined;
  variant?: 'plank' | 'framed' | 'carved' | undefined;
  as?: ElementType | undefined;
  className?: string | undefined;
}

const variantClass = {
  plank: 'plank',
  framed: 'plankFramed',
  carved: 'carved',
} as const;

/** Server Component. docs/03 §3 */
export function PlankFrame({
  children,
  studs = false,
  variant = 'plank',
  as: Tag = 'div',
  className,
}: PlankFrameProps) {
  return (
    <Tag className={cn(variantClass[variant], styles.frame, className)}>
      {studs && (
        <>
          <span className={cn(styles.stud, styles.studTL)} aria-hidden="true" />
          <span className={cn(styles.stud, styles.studTR)} aria-hidden="true" />
          <span className={cn(styles.stud, styles.studBL)} aria-hidden="true" />
          <span className={cn(styles.stud, styles.studBR)} aria-hidden="true" />
        </>
      )}
      {children}
    </Tag>
  );
}
