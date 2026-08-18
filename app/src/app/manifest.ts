import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export const dynamic = 'force-static';

/**
 * docs/08 §10 · Manifest sí, service worker no.
 *
 * El manifest cuesta ~400 bytes y da icono decente si alguien guarda el enlace
 * en la pantalla de inicio, `theme_color` en madera y `display: standalone`.
 * Un service worker añadiría invalidación de caché justo sobre lo que más
 * cambia — los precios — y el caso de uso es una visita única desde un QR.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.nombre} · Carta`,
    short_name: site.nombre,
    description: site.lema.join(' '),
    lang: 'es-CO',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#15100b',
    theme_color: '#15100b',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
