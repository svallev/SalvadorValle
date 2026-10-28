import type { APIRoute } from 'astro';

// Dos páginas, la home y su versión para agentes: no compensa una
// integración para escribir dos URL.
// lastmod es la fecha del build: el contenido solo cambia al desplegar.
const pages = ['/', '/agents/'];

export const GET: APIRoute = ({ site }) =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((path) => `  <url><loc>${new URL(path, site)}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>`).join('\n')}
</urlset>
`,
    { headers: { 'Content-Type': 'application/xml' } }
  );
