import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export const dynamic = 'force-static';

/**
 * En los deploy-preview y branch-deploy de Netlify se bloquea la indexación
 * (netlify.toml define ROBOTS_NOINDEX en esos contextos): dos URLs distintas
 * con la misma carta compiten entre sí en Google, y la que gana suele ser la
 * de la rama.
 */
const noIndexar = process.env.ROBOTS_NOINDEX === 'true';

export default function robots(): MetadataRoute.Robots {
  if (noIndexar) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
