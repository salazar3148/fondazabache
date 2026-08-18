import { Horseshoe } from '@/components/icons';
import styles from './HorseshoeRule.module.css';

/** Separador entre bloques mayores. Máximo 3 en toda la página. docs/03 §5.3 */
export function HorseshoeRule() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <span className={styles.rule} />
      <Horseshoe className={styles.shoe} />
      <span className={styles.rule} />
    </div>
  );
}
