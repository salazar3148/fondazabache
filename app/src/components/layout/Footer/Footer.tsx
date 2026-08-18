import { site } from '@/content/site';
import { HorseshoeRule } from '@/components/decor/HorseshoeRule';
import { InfoFonda } from '@/components/features/InfoFonda';
import { Cancionero } from '@/components/features/Cancionero';
import { Button } from '@/components/primitives/Button';
import { HorseHead } from '@/components/icons';
import styles from './Footer.module.css';

/** docs/07 §4.4 · Server Component. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <HorseshoeRule />

      <p className={styles.copla}>«{site.coplas.pie}»</p>

      <div className={styles.info}>
        <InfoFonda />
        <Cancionero />

        <div className={styles.redes}>
          <Button href={site.contacto.instagram} variant="ghost" className={styles.red}>
            Instagram
          </Button>
          <Button href={site.contacto.whatsapp} variant="ghost" className={styles.red}>
            WhatsApp
          </Button>
          <Button href={site.contacto.mapa} variant="ghost" className={styles.red}>
            Mapa
          </Button>
        </div>

        <div className={styles.legal}>
          <p className={styles.aviso}>{site.avisos.precios}</p>
          <p className={styles.aviso}>{site.avisos.sinConfirmar}</p>
          <p className={styles.aviso}>{site.avisos.propina}</p>
          <p className={styles.avisoLegal}>{site.avisos.alcohol}</p>
        </div>
      </div>

      <HorseHead className={styles.caballo} />
    </footer>
  );
}
