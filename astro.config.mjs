// @ts-check
import { defineConfig } from 'astro/config';

// Vercel expone el dominio de producción en el build: hoy salvadorvalle.vercel.app,
// que es la URL definitiva e indexable. Si se añade un dominio propio, pasa a ser
// ese, pero hay que volver a desplegar para que se aplique.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

// https://astro.build/config
export default defineConfig({
  site: productionHost ? `https://${productionHost}` : 'http://localhost:4321',

  image: {
    // El collage de Work son 2375x4096 y las fotos originales llegan a 8 MB.
    // Sin esto, la home sería inusable.
    responsiveStyles: true,
  },

  build: {
    inlineStylesheets: 'auto',
  },
});
