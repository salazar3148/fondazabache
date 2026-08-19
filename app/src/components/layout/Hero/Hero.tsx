import { site } from '@/content/site';
import { BurntTitle } from '@/components/decor/BurntTitle';
import { PlankFrame } from '@/components/decor/PlankFrame';
import { Wordmark } from '@/components/decor/Wordmark';
import { Button } from '@/components/primitives/Button';
import { ChevronDown } from '@/components/icons';
import { CARTA_ID, PORTADA_ID } from '@/lib/constants';
import { cn } from '@/lib/cn';
import styles from './Hero.module.css';

/**
 * docs/07 §4.1 · Server Component. Es el LCP de la página.
 *
 * Ocupa exactamente lo que queda de pantalla bajo el header y la barra de
 * secciones, así la portada se siente "una pantalla completa" y la carta
 * arranca justo al deslizar (misma idea que la portada de Bello).
 *
 * El h1 es el letrero: su lettering ya dice el nombre de la casa, así que no
 * se repite como texto suelto. El `aria-label` del SVG mantiene el encabezado
 * legible para buscadores y lectores de pantalla.
 *
 * El lema NO se anima al entrar: ya está visible al cargar y animarlo
 * retrasaría el LCP. La única animación continua de la portada es el letrero,
 * que se mece ±0.5°.
 */
export function Hero() {
  const [linea1, linea2, linea3] = site.lema;

  return (
    <header id={PORTADA_ID} className={styles.hero}>
      <div className={styles.letreroWrap}>
        <div className={styles.cadenas} aria-hidden="true">
          <span />
          <span />
        </div>

        {/* El vaivén va sobre la tabla, no sobre el conjunto: las cadenas son
            el eje del que cuelga y no se mecen con ella. */}
        <PlankFrame variant="framed" studs className={cn('letrero', styles.tabla)}>
          <h1 className={styles.marca}>
            <Wordmark uid="portada" />
          </h1>
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

      {/* Decorativo, no un segundo enlace al mismo sitio: el botón de arriba ya
          es la acción. Esto solo avisa de que abajo sigue habiendo carta. */}
      <p className={styles.pista} aria-hidden="true">
        <span className={styles.pistaTexto}>{site.pistaScroll}</span>
        <ChevronDown className={cn('flotar', styles.chevron)} />
      </p>
    </header>
  );
}
