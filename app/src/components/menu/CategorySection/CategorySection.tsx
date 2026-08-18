import type { MenuCategory, MenuItem } from '@/types/menu';
import { itemsPorId } from '@/content/menu';
import { BurntTitle } from '@/components/decor/BurntTitle';
import { PlankFrame } from '@/components/decor/PlankFrame';
import { Reveal } from '@/components/layout/Reveal';
import { cn } from '@/lib/cn';
import { MenuItemRow } from '../MenuItemRow';
import styles from './CategorySection.module.css';

export interface CategorySectionProps {
  categoria: MenuCategory;
  /** true para la primera sección: sin Reveal ni content-visibility. */
  first?: boolean | undefined;
}

/**
 * Resuelve `vaBienCon` a los productos reales y a la sección donde viven, para
 * que el sheet pueda enlazarlos. El validador ya garantizó que los ids existen.
 */
function resolverRelacionados(item: MenuItem) {
  return (item.vaBienCon ?? []).flatMap((id) => {
    const encontrado = itemsPorId.get(id);
    return encontrado ? [encontrado] : [];
  });
}

/** docs/07 §5.1 · Server Component. */
export function CategorySection({ categoria, first = false }: CategorySectionProps) {
  const tituloId = `${categoria.id}-titulo`;

  const cabecera = (
    <PlankFrame variant="framed" studs className={styles.cabecera}>
      <BurntTitle as="h2" id={tituloId} className={styles.titulo}>
        {categoria.titulo}
      </BurntTitle>
      <p className={styles.subtitulo}>{categoria.subtitulo}</p>
      <span className={cn('brassRule', styles.filete)} aria-hidden="true" />
      {categoria.nota && <p className={styles.nota}>{categoria.nota}</p>}
    </PlankFrame>
  );

  return (
    <section
      id={categoria.id}
      aria-labelledby={tituloId}
      className={cn(styles.section, !first && styles.deferida)}
    >
      {first ? cabecera : <Reveal>{cabecera}</Reveal>}

      <ul className={styles.items}>
        {categoria.items.map((item) => (
          <MenuItemRow key={item.id} item={item} relacionados={resolverRelacionados(item)} />
        ))}
      </ul>
    </section>
  );
}
