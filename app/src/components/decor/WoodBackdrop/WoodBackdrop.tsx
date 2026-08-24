import styles from './WoodBackdrop.module.css';

/**
 * Server Component. Se monta una sola vez en layout.tsx. docs/03 §2.4
 *
 * Tres pasadas de la misma veta, no una: fina en overlay, media espejada en
 * soft-light para romper el tile, y grande en multiply para el carbón que
 * corre por la fibra. El orden en el DOM es el orden de pintado.
 */
export function WoodBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.grain} />
      <div className={styles.grainMacro} />
      <div className={styles.carbon} />
    </div>
  );
}
