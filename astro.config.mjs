// @ts-check
import { defineConfig } from 'astro/config';

// URL absoluta del sitio: canonical, Open Graph, JSON-LD, sitemap, robots,
// /agents/, /index.md y /llms.txt. Por orden:
// 1. SITE_URL, para fijarla a mano en cualquier plataforma.
// 2. Vercel expone el dominio de producción en el build: hoy
//    salvadorvalle.vercel.app. Con un dominio propio pasa a ser ese, pero hay
//    que volver a desplegar para que se aplique.
// 3. Fuera de Vercel (Spacefast, por ejemplo) no hay ninguna de las dos, y sin
//    esto todas las URL absolutas salían como localhost. La URL de producción
//    es la canónica: las copias en otras plataformas apuntan a ella.
// 4. En `astro dev`, localhost.
const productionUrl = 'https://salvadorvalle.vercel.app';
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const isDev = process.argv.includes('dev');
const site =
  process.env.SITE_URL ??
  (vercelHost ? `https://${vercelHost}` : isDev ? 'http://localhost:4321' : productionUrl);

// https://astro.build/config
export default defineConfig({
  site,

  image: {
    // El collage de Work son 2375x4096 y las fotos originales llegan a 8 MB.
    // Sin esto, la home sería inusable.
    responsiveStyles: true,
  },

  build: {
    inlineStylesheets: 'auto',
  },

  // Sin esto, Vite inlina en el HTML los scripts compilados de menos de 4 KB
  // (como el de @vercel/analytics) en vez de servirlos como archivo aparte.
  // La CSP de vercel.json solo permite `script-src 'self'`, sin 'unsafe-inline',
  // así que el navegador bloquea ese script inline y Analytics no carga nunca.
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
