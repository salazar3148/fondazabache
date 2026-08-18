import { site } from '@/content/site';
import { BurntTitle } from '@/components/decor/BurntTitle';
import { PlankFrame } from '@/components/decor/PlankFrame';
import { Button } from '@/components/primitives/Button';
import { ChevronDown } from '@/components/icons';
import { CARTA_ID, PORTADA_ID } from '@/lib/constants';
import { cn } from '@/lib/cn';
import styles from './Hero.module.css';

/**
 * docs/07 §4.1 · Server Component. Es el LCP de la página.
 *
 * El lema NO se anima al entrar: ya está visible al cargar y animarlo
 * retrasaría el LCP. La única animación continua de la app es el letrero,
 * que se mece ±0.5° y se detiene al salir del viewport.
 *
 * PENDIENTE: `wordmark.svg` (logo quemado horneado, docs/01 §6) no existe
 * todavía. Mientras tanto el wordmark se compone con la tipografía display y
 * el mismo efecto quemado, que da el resultado sin inventar un logo.
 */
export function Hero() {
  const [linea1, linea2, linea3] = site.lema;

  return (
    <header id={PORTADA_ID} className={styles.hero}>
      <div className={cn('letrero', styles.letrero)}>
        <div className={styles.cadenas} aria-hidden="true">
          <span />
          <span />
        </div>

        <PlankFrame variant="framed" studs className={styles.tabla}>
          <BurntTitle as="h1" intensity="hot" className={styles.wordmark}>
            <span className={styles.wordmarkLinea}>Fonda</span>
            <span className={styles.wordmarkLinea}>Azabache</span>
          </BurntTitle>
        </PlankFrame>
      </div>

      <BurntTitle as="p" intensity="hot" className={styles.lema}>
        <span className={styles.lemaLinea}>{linea1}</span>
        <span className={styles.lemaLinea}>{linea2}</span>
        <span className={styles.lemaCierre}>{linea3}</span>
      </BurntTitle>

      <p className={styles.bajada}>{site.bajada}</p>

      <Button href={`#${CARTA_ID}`} variant="primary" size="lg" className={styles.cta}>
        {site.cta}
      </Button>

      <ChevronDown className={styles.chevron} />
    </header>
  );
}
