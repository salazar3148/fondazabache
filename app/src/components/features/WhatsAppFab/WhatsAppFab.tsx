'use client';

import { useEffect, useState } from 'react';
import { site } from '@/content/site';
import { WhatsApp } from '@/components/icons';
import { cn } from '@/lib/cn';
import styles from './WhatsAppFab.module.css';

/**
 * Botón flotante de WhatsApp, como el de la carta de Bello: aparece cuando el
 * usuario ya lleva un rato en la carta y quiere resolver algo (reservar,
 * preguntar un precio) sin volver a subir al header.
 *
 * Es un <a> real: sin JS sigue siendo un enlace válido, solo pierde la entrada
 * animada. Y mientras está oculto sale del orden de tabulación para no dejar un
 * destino de foco invisible.
 */
export function WhatsAppFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href={site.social.whatsapp.reservarUrl}
      target="_blank"
      rel="noopener"
      className={cn(styles.fab, visible && styles.visible)}
      aria-label={site.ctaReservar}
      tabIndex={visible ? 0 : -1}
    >
      <WhatsApp className={styles.icono} />
    </a>
  );
}
