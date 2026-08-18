import { BurntTitle } from '@/components/decor/BurntTitle';
import { Button } from '@/components/primitives/Button';
import { site } from '@/content/site';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className="contenido">
      <div className={styles.wrap}>
        <BurntTitle as="h1" intensity="hot" className={styles.titulo}>
          Eso no está en la carta
        </BurntTitle>

        <p className={styles.texto}>
          Se le fue la mano con la dirección. Pero la mesa sigue puesta.
        </p>

        <Button href="/" variant="primary" size="lg">
          {site.cta}
        </Button>
      </div>
    </div>
  );
}
