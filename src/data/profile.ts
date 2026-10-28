/*
 * El contenido entero del sitio, en el orden pensado para que lo lea un
 * agente: quién es, qué cifras lo avalan, qué hace, con qué lo ha demostrado,
 * dónde ha hablado y escrito, su trayectoria y cómo contactar.
 *
 * Lo usan /agents/, /index.md y /llms.txt. Sale de las mismas colecciones y de
 * site.ts que la home, así que no hay texto que mantener dos veces.
 */

import { getCollection } from 'astro:content';
import { site, hero, sections, footer } from './site';

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

// Las cifras del hero, escritas como frase: «85% — of BBVA employees…».
const statValue = (stat: (typeof hero.stats)[number]) =>
  `${stat.prefix}${stat.value.toFixed(stat.decimals)}${stat.unit}`;

export async function getProfile() {
  const [projects, capabilities, clients, talks, writings, background] = await Promise.all([
    getCollection('projects'),
    getCollection('capabilities'),
    getCollection('clients'),
    getCollection('talks'),
    getCollection('writings'),
    getCollection('background'),
  ]);

  return {
    name: site.name,
    role: site.role,
    summary: site.description,
    intro: `${hero.greeting} ${hero.intro.join(' ')}`,
    email: site.email,
    links: footer.links,
    facts: hero.stats.map((stat) => ({ value: statValue(stat), label: stat.label })),
    capabilities: capabilities.sort(byOrder).map((c) => ({ title: c.data.title, summary: c.body?.trim() ?? '' })),
    projects: projects.sort(byOrder).map((p) => ({ title: p.data.title, summary: p.body?.trim() ?? '' })),
    clients: clients.sort(byOrder).map((c) => c.data.name),
    talks: talks.sort(byOrder).map((t) => ({
      title: t.data.title,
      summary: t.body?.trim() ?? '',
      url: t.data.youtubeId ? `https://www.youtube.com/watch?v=${t.data.youtubeId}` : undefined,
      lang: t.data.lang,
    })),
    writings: writings.sort(byOrder).map((w) => ({ title: w.data.title, url: w.data.url, lang: w.data.lang })),
    career: background.sort(byOrder).map((era) => ({
      period: era.data.period,
      title: era.data.title,
      summary: era.body?.trim() ?? '',
      roles: era.data.roles,
    })),
    closing: sections.background.closing.replace(/^—\s*/, ''),
  };
}

export type Profile = Awaited<ReturnType<typeof getProfile>>;

export function toMarkdown(p: Profile, home: string) {
  const lines = [
    `# ${p.name} — ${p.role}`,
    '',
    `> ${p.summary}`,
    '',
    p.intro,
    '',
    `Website: ${home}`,
    `Email: ${p.email}`,
    ...p.links.map((l) => `${l.label}: ${l.href}`),
    '',
    '## Key facts',
    '',
    ...p.facts.map((f) => `- **${f.value}** ${f.label}`),
    '',
    '## Capabilities',
    '',
    ...p.capabilities.map((c) => `- **${c.title}.** ${c.summary}`),
    '',
    '## Recent projects',
    '',
    ...p.projects.map((pr) => `- **${pr.title}.** ${pr.summary}`),
    '',
    '## Clients',
    '',
    p.clients.join(', ') + '.',
    '',
    '## Talks',
    '',
    ...p.talks.map((t) => `- ${t.url ? `[${t.title}](${t.url})` : t.title}${t.lang ? ` (${t.lang})` : ''}. ${t.summary}`),
    '',
    '## Writing',
    '',
    ...p.writings.map((w) => `- ${w.url ? `[${w.title}](${w.url})` : w.title}${w.lang ? ` (${w.lang})` : ''}`),
    '',
    '## Career',
    '',
    ...p.career.flatMap((era) => [
      `### ${era.period}: ${era.title}`,
      '',
      era.summary,
      '',
      ...era.roles.map((r) => `- **${r.company}**${r.role ? ` (${r.role})` : ''}: ${r.description}`),
      '',
    ]),
    p.closing,
    '',
    '## Contact',
    '',
    `Email ${p.email}, or LinkedIn: ${p.links.find((l) => l.label === 'LinkedIn')?.href}.`,
    '',
  ];
  return lines.join('\n');
}
