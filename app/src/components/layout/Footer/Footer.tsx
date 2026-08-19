import { site } from '@/content/site';
import { HorseshoeRule } from '@/components/decor/HorseshoeRule';
import { Wordmark } from '@/components/decor/Wordmark';
import { HorseHead, Instagram, WhatsApp } from '@/components/icons';
import styles from './Footer.module.css';

/**
 * docs/07 §4.4 · Server Component.
 *
 * Misma arquitectura que el pie de la carta de Bello — separador con ornamento,
 * marca, redes con iconos vectoriales, y una línea de créditos con firma.
 *
 * Ya no lleva horarios, dirección, wifi ni cancionero: quien está sentado en la
 * mesa no necesita que la carta le diga dónde está ni a qué hora abre. Si algo
 * de eso hace falta, se pregunta por WhatsApp, que está a un toque.
 */
export function Footer() {
  const anio = new Date().getFullYear();
  const { instagram, whatsapp } = site.social;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <HorseshoeRule />

        <p className={styles.copla}>«{site.coplas.pie}»</p>

        <Wordmark uid="pie" decorative className={styles.marca} />

        <div className={styles.redes}>
          <a
            href={instagram.url}
            target="_blank"
            rel="noopener"
            className={styles.red}
            aria-label={`Instagram: @${instagram.handle}`}
          >
            <Instagram className={styles.redIcono} />
            <span>@{instagram.handle}</span>
          </a>

          <a
            href={whatsapp.url}
            target="_blank"
            rel="noopener"
            className={styles.red}
            aria-label={`WhatsApp: ${whatsapp.display}`}
          >
            <WhatsApp className={styles.redIcono} />
            <span>{whatsapp.display}</span>
          </a>
        </div>

        <p className={styles.creditos}>
          © {anio} {site.nombre} — {site.pie.derechos}
          <br />
          <span className={styles.firma}>{site.pie.firma}</span>
        </p>
      </div>

      <HorseHead className={styles.caballo} />
    </footer>
  );
}
