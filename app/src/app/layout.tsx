import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { fraunces, frauncesItalic, instrument } from '@/styles/fonts';
import { WoodBackdrop } from '@/components/decor/WoodBackdrop';
import { FilmGrain } from '@/components/decor/FilmGrain';
import { JsonLd } from '@/components/layout/JsonLd';
import { site } from '@/content/site';
import { CARTA_ID } from '@/lib/constants';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.nombre} · Carta`,
  description: `${site.lema.join(' ')} Carta de licores de la ${site.nombre}, en ${site.ciudad}.`,
  applicationName: site.nombre,
  alternates: { canonical: '/' },
  openGraph: {
    title: site.nombre,
    description: site.lema.join(' '),
    url: site.url,
    siteName: site.nombre,
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: '/brand/og.jpg',
        width: 1200,
        height: 630,
        alt: `${site.nombre} — ${site.lema.join(' ')}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.nombre,
    description: site.lema.join(' '),
    images: ['/brand/og.jpg'],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // NO se fija maximumScale: el zoom es un derecho de accesibilidad.
  // Réplica de --c-madera-900 (tokens.css). Si la rampa de madera cambia,
  // este valor y el del manifest cambian con ella.
  themeColor: '#251b12',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es-CO"
      className={`${fraunces.variable} ${frauncesItalic.variable} ${instrument.variable}`}
    >
      <head>
        {/* El tile de veta lo pide un background-image de un CSS Module, así
            que el navegador solo lo descubre al calcular estilos. Precargarlo
            adelanta la textura del fondo, que es lo primero que se ve. */}
        <link rel="preload" as="image" href="/textures/wood-grain-256.svg" type="image/svg+xml" />
      </head>
      <body>
        <WoodBackdrop />
        <FilmGrain />
        <a href={`#${CARTA_ID}`} className="skip-link">
          Ir a la carta
        </a>
        {children}
        <JsonLd />
      </body>
    </html>
  );
}
