import type { NextConfig } from 'next';

/**
 * docs/04 §4 · ADR-001 (export estático)
 * La carta no tiene login, carrito ni datos por usuario: cambia por despliegue.
 */
const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true, // rutas limpias en hostings estáticos
  images: {
    unoptimized: true, // obligatorio con output: 'export'
  },
  // En Next 16 el lint dejó de correr dentro de `next build`: se ejecuta como
  // paso propio en `pnpm lint` y en el CI. La clave `eslint` ya no existe.
  typescript: { ignoreBuildErrors: false },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
