import type { APIRoute } from 'astro';

// Todo abierto. Los rastreadores de IA se nombran aparte para que quede claro
// que también son bienvenidos: el sitio tiene una versión pensada para ellos
// (/agents/, /index.md y /llms.txt).
const aiCrawlers = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
];

export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\n\n${aiCrawlers.map((bot) => `User-agent: ${bot}`).join('\n')}\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site)}\n`
  );
