import { site } from '@/content/site';
import { Horseshoe, WhatsApp } from '@/components/icons';
import { PORTADA_ID } from '@/lib/constants';
import styles from './Header.module.css';

/**
 * Barra superior fija: marca a la izquierda, WhatsApp a la derecha.
 *
 * Server Component, cero JS: el alto es fijo (--header-h) y el "volver
 * arriba" es un ancla real a la portada, no un listener de scroll. Con eso
 * desaparece la necesidad de medir el header en runtime y de un tercer botón
 * flotante compitiendo por la esquina.
 */
export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href={`#${PORTADA_ID}`} className={styles.marca} aria-label={site.volverArriba}>
          <Horseshoe className={styles.isotipo} />
          <span className={styles.nombre}>{site.nombre}</span>
        </a>

        <a
          href={site.social.whatsapp.reservarUrl}
          target="_blank"
          rel="noopener"
          className={styles.cta}
        >
          <WhatsApp className={styles.ctaIcono} />
          <span className={styles.ctaTexto}>{site.ctaReservar}</span>
        </a>
      </div>
    </header>
  );
}
