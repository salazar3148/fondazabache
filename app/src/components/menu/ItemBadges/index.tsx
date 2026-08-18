import type { ItemTag } from '@/types/menu';
import { Badge } from '@/components/primitives/Badge';
import styles from './ItemBadges.module.css';

export interface ItemBadgesProps {
  etiquetas?: ItemTag[] | undefined;
}

/** docs/07 §5.4 · role="list" explícito: Safari lo pierde con list-style: none. */
export function ItemBadges({ etiquetas }: ItemBadgesProps) {
  if (!etiquetas?.length) return null;

  return (
    <ul className={styles.list} role="list">
      {etiquetas.map((tag) => (
        <li key={tag}>
          <Badge tag={tag} />
        </li>
      ))}
    </ul>
  );
}
