# Despliegue en Netlify

La carta es un export estático: Netlify solo sirve archivos desde su CDN. No se
usa `@netlify/plugin-nextjs`, que existe para SSR/ISR y aquí solo añadiría
funciones serverless que nunca se invocan.

## Primera vez

1. Sube el repositorio a GitHub (rama `main`).
2. En Netlify: **Add new site → Import an existing project** y elige el repo.
3. No toques la configuración del formulario: `netlify.toml` ya define todo
   (`base = "app"`, `command = "pnpm build"`, `publish = "out"`, Node 20.11,
   pnpm 10).
4. Deploy. El primer build tarda 2–3 minutos.

## Dominio

En **Domain management** agrega `carta.fondaazabache.co` y crea el CNAME que
Netlify indique. El certificado TLS es automático (Let's Encrypt).

Si el dominio final es distinto, hay **un solo sitio** que cambiar:
`site.url` en `app/src/content/site.ts`. De ahí salen la metadata canónica, el
Open Graph, el sitemap y el JSON-LD.

## Qué pasa en cada push

`pnpm build` corre `prebuild`, que ejecuta `content:check`. Si un precio quedó
mal tipado, un id se duplicó o una sección quedó vacía, **el deploy falla antes
de publicar**. Es la red de seguridad del flujo "cambio la carta el jueves a las
once de la noche".

Los deploy-preview y branch-deploy salen con `robots: disallow` para que no
compitan en Google con la carta real.

## Cambiar un precio

```bash
git checkout -b content/precio-media-verde
# editar app/src/content/menu/aguardientes.ts
git commit -am "content(menu): sube media verde a 50.000"
git push -u origin content/precio-media-verde
```

Netlify publica un preview con URL propia. Si se ve bien, merge a `main` y queda
en producción. Menos de dos minutos de punta a punta.

## Verificación después del primer deploy

- [ ] La carta carga en menos de 2 s sobre datos móviles en el local.
- [ ] Los 6 chips llevan a su sección y el título queda visible, no tapado.
- [ ] La vista previa del enlace en WhatsApp muestra `og.jpg` con el lema.
- [ ] El aviso de la Ley 30 de 1986 está visible en el pie.
- [ ] La clave del wifi se copia con el botón.
- [ ] La Ruleta del Arriero aparece al pasar la portada y no repite resultado.
- [ ] `https://<dominio>/robots.txt` y `/sitemap.xml` responden.

## Pendiente antes de imprimir el QR

- Los **9 precios sin confirmar**, que hoy se muestran como "Pregunte".
- Dirección, teléfono, horarios y clave del wifi reales en `site.ts`.
- Confirmar que "Tequila Jugador" es la marca, y que "Old Parr" y
  "Jägermeister" son las lecturas correctas de la carta manuscrita.
