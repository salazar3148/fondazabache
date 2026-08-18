import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './Button.module.css';

export interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'brass' | undefined;
  size?: 'md' | 'lg' | undefined;
  /** Si se pasa, renderiza <a> en vez de <button>. */
  href?: string | undefined;
  onClick?: (() => void) | undefined;
  type?: 'button' | 'submit' | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
  'aria-label'?: string | undefined;
}

/**
 * docs/07 §2.1 · Con href → <a>. Sin href → <button type="button">.
 * Nunca un <div> con onClick: ESLint lo bloquea y el teclado lo agradece.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  type = 'button',
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const clases = cn(styles.btn, styles[variant], styles[size], className);

  if (href) {
    return (
      <a href={href} className={clases} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={clases}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
