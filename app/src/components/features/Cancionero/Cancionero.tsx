import { cancionero } from '@/content/cancionero';
import { ChevronDown } from '@/components/icons';
import styles from './Cancionero.module.css';

/**
 * docs/07 §6.2 · Server Component sobre <details> nativo:
 * cero JS, accesible de fábrica, y Chrome expande el <details> al buscar
 * dentro con Ctrl+F.
 */
export function Cancionero() {
  return (
    <details className={styles.detalles}>
      <summary className={styles.resumen}>
        <ChevronDown className={styles.chevron} />
        <span className={styles.titulo}>{cancionero.titulo}</span>
        <span className={styles.cuenta}>{cancionero.canciones.length}</span>
      </summary>

      <p className={styles.intro}>{cancionero.intro}</p>

      <ul className={styles.lista}>
        {cancionero.canciones.map((c) => (
          <li key={`${c.titulo}-${c.artista}`} className={styles.cancion}>
            <span className={styles.cancionTitulo}>{c.titulo}</span>
            <span className={styles.artista}>{c.artista}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
