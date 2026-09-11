// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // TODO: sustituir por el dominio definitivo. Lo necesitan el sitemap y las
  // etiquetas Open Graph, que exigen URL absolutas.
  site: 'https://salvadorvalle.com',

  image: {
    // El collage de Work son 2375x4096 y las fotos originales llegan a 8 MB.
    // Sin esto, la home sería inusable.
    responsiveStyles: true,
  },

  build: {
    inlineStylesheets: 'auto',
  },
});
