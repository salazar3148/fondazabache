import { Fragment } from 'react';
import { menu, todosLosItems } from '@/content/menu';
import { site } from '@/content/site';
import { Hero } from '@/components/layout/Hero';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { Footer } from '@/components/layout/Footer';
import { CategorySection } from '@/components/menu/CategorySection';
import { HorseshoeRule } from '@/components/decor/HorseshoeRule';
import { RuletaArriero } from '@/components/features/RuletaArriero';
import { CARTA_ID, PORTADA_ID } from '@/lib/constants';
import styles from './page.module.css';

/**
 * docs/07 §8 · La página solo compone. Toda la complejidad está distribuida
 * y encapsulada: esa es la señal de que la arquitectura está bien.
 */
export default function CartaPage() {
  const navItems = menu.map(({ id, chip }) => ({ id, chip }));

  return (
    <>
      <div className="contenido">
        <Hero />
      </div>

      <CategoryNav categorias={navItems} />

      <main id={CARTA_ID} className="contenido">
        {menu.map((categoria, i) => (
          <Fragment key={categoria.id}>
            {i === 3 && (
              <>
                <HorseshoeRule />
                <p className={styles.copla}>«{site.coplas.mitad}»</p>
              </>
            )}
            <CategorySection categoria={categoria} first={i === 0} />
          </Fragment>
        ))}
      </main>

      <div className="contenido">
        <Footer />
      </div>

      <RuletaArriero items={todosLosItems} portadaId={PORTADA_ID} />
    </>
  );
}
