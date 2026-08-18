import type { ReactNode } from 'react';
import type { ItemTag } from '@/types/menu';
import { Chili, Leaf } from '@/components/icons';
import { cn } from '@/lib/cn';
import styles from './Badge.module.css';

export interface BadgeProps {
  tag: ItemTag;
}

/**
 * docs/07 §2.3 · Mapa fijo de las 7 etiquetas, definido una sola vez.
 * El icono nunca va solo: sin texto es adivinanza.
 */
const MAPA: Record<ItemTag, { texto: string; clase: string; icono?: ReactNode }> = {
  casa: { texto: 'De la casa', clase: 'casa' },
  favorita: { texto: 'La favorita', clase: 'favorita' },
  picante: { texto: 'Picante', clase: 'picante', icono: <Chili width={12} height={12} /> },
  'sin-alcohol': {
    texto: 'Sin alcohol',
    clase: 'sinAlcohol',
    icono: <Leaf width={12} height={12} />,
  },
  compartir: { texto: 'Para compartir', clase: 'compartir' },
  fuerte: { texto: 'Cargado', clase: 'fuerte' },
  temporada: { texto: 'De temporada', clase: 'temporada' },
};

export function Badge({ tag }: BadgeProps) {
  const { texto, clase, icono } = MAPA[tag];

  return (
    <span className={cn(styles.badge, styles[clase])}>
      {icono}
      {texto}
    </span>
  );
}
