import type { APIRoute } from 'astro';
import { getProfile, toMarkdown } from '../data/profile';

// La home entera en Markdown, para agentes y lectores que no quieren HTML.
// La anuncia el <link rel="alternate"> de Base.astro.
export const GET: APIRoute = async ({ site }) =>
  new Response(toMarkdown(await getProfile(), new URL('/', site).href), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
