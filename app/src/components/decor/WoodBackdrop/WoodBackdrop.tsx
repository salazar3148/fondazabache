import styles from './WoodBackdrop.module.css';

/** Server Component. Se monta una sola vez en layout.tsx. docs/03 §2.4 */
export function WoodBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.grain} />
      <div className={styles.grainMacro} />
    </div>
  );
}
