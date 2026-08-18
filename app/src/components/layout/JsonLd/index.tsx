import { site } from '@/content/site';
import { menu } from '@/content/menu';

/**
 * docs/09 · Datos estructurados schema.org. Server Component: el JSON se
 * hornea en el HTML y no cuesta un byte de JavaScript ejecutable.
 *
 * Se declara `BarOrPub` con su `hasMenu`: es lo que hace que Google entienda
 * que esto es la carta de un negocio físico y no un blog.
 */
export function JsonLd() {
  const datos = {
    '@context': 'https://schema.org',
    '@type': 'BarOrPub',
    name: site.nombre,
    slogan: site.lema.join(' '),
    description: site.bajada,
    url: site.url,
    image: `${site.url}/brand/og.jpg`,
    telephone: site.contacto.telefono,
    servesCuisine: 'Licores y bebidas',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.contacto.direccion,
      addressLocality: 'Medellín',
      addressRegion: 'Antioquia',
      addressCountry: 'CO',
    },
    hasMenu: {
      '@type': 'Menu',
      name: 'Carta',
      inLanguage: 'es-CO',
      hasMenuSection: menu.map((categoria) => ({
        '@type': 'MenuSection',
        name: categoria.titulo,
        description: categoria.subtitulo,
        hasMenuItem: categoria.items.map((item) => ({
          '@type': 'MenuItem',
          name: item.nombre,
          ...(item.descripcion ? { description: item.descripcion } : {}),
          // Un precio en 0 es "sin confirmar": no se publica como si fuera real.
          ...(item.precio > 0
            ? { offers: { '@type': 'Offer', price: item.precio, priceCurrency: 'COP' } }
            : {}),
        })),
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // El contenido es nuestro y está tipado; se escapa `<` por prudencia.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos).replace(/</g, '\\u003c') }}
    />
  );
}
