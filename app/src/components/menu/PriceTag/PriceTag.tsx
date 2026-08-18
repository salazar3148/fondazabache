import { formatCOP } from '@/lib/format';
import { PRECIO_SIN_CONFIRMAR } from '@/lib/constants';
import { VisuallyHidden } from '@/components/primitives/VisuallyHidden';
import { cn } from '@/lib/cn';
import styles from './PriceTag.module.css';

export interface PriceTagProps {
  valor: number;
  agotado?: boolean | undefined;
}

/** docs/07 §5.3 · Cifras tabulares para que la columna quede alineada. */
export function PriceTag({ valor, agotado = false }: PriceTagProps) {
  if (valor === PRECIO_SIN_CONFIRMAR) {
    return (
      <span className={cn(styles.price, styles.sinConfirmar)}>
        Pregunte
        <VisuallyHidden>Precio por confirmar en la barra</VisuallyHidden>
      </span>
    );
  }

  return (
    <span className={cn(styles.price, agotado && styles.agotado)}>
      {formatCOP(valor)}
      {agotado && <VisuallyHidden>No disponible hoy</VisuallyHidden>}
    </span>
  );
}
