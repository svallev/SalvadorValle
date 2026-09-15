import type { APIRoute } from 'astro';

// Una sola página: no compensa una integración para escribir una URL.
// lastmod es la fecha del build: el contenido solo cambia al desplegar.
export const GET: APIRoute = ({ site }) =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${new URL('/', site)}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>
</urlset>
`,
    { headers: { 'Content-Type': 'application/xml' } }
  );
