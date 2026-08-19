import { Fragment } from 'react';
import { menu, todosLosItems } from '@/content/menu';
import { site } from '@/content/site';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/layout/Hero';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { Footer } from '@/components/layout/Footer';
import { CategorySection } from '@/components/menu/CategorySection';
import { HorseshoeRule } from '@/components/decor/HorseshoeRule';
import { ScrollProgress } from '@/components/decor/ScrollProgress';
import { RuletaAzabache } from '@/components/features/RuletaAzabache';
import { WhatsAppFab } from '@/components/features/WhatsAppFab';
import { CARTA_ID, PORTADA_ID } from '@/lib/constants';
import styles from './page.module.css';

/**
 * docs/07 §8 · La página solo compone. Toda la complejidad está distribuida
 * y encapsulada: esa es la señal de que la arquitectura está bien.
 *
 * El orden importa: header y barra de secciones van ANTES de la portada para
 * que estén pegados arriba desde el primer píxel (así funciona la carta de
 * Bello). Si fueran después, la barra solo aparecería al pasar la portada y el
 * visitante no sabría que la carta está seccionada.
 */
export default function CartaPage() {
  const navItems = menu.map(({ id, chip }) => ({ id, chip }));

  return (
    <>
      <ScrollProgress />
      <Header />
      <CategoryNav categorias={navItems} />

      <div className="contenido">
        <Hero />
      </div>

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

      {/* El pie va a sangre, fuera de .contenido: el filo de brasa de arriba y
          el fondo tienen que cruzar la pantalla completa, como en Bello. La
          columna de lectura la recompone el propio Footer por dentro. */}
      <Footer />

      <WhatsAppFab />
      <RuletaAzabache items={todosLosItems} portadaId={PORTADA_ID} />
    </>
  );
}
