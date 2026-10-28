import type { APIRoute } from 'astro';
import { getProfile } from '../data/profile';

// Formato de llmstxt.org: título, resumen y dónde leer lo demás.
export const GET: APIRoute = async ({ site }) => {
  const p = await getProfile();
  const url = (path: string) => new URL(path, site).href;
  const body = `# ${p.name}

> ${p.summary}

${p.intro}

## Read this site

- [Full profile in Markdown](${url('/index.md')}): every section of the home page as plain text.
- [Profile for agents](${url('/agents/')}): the same content as minimal semantic HTML with structured data.
- [Home page](${url('/')}): the designed version.

## Elsewhere

${p.links.map((l) => `- [${l.label}](${l.href})`).join('\n')}
- [Email](mailto:${p.email})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
