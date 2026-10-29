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
const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

// La cifra del hero tal como se ve: «85%», «€3.5M».
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

  const career = background.sort(byOrder);

  // Puesto actual: el primero de la etapa más reciente. Cuando no trae `role`,
  // el cargo es la primera frase de la descripción («Product Design Director.»).
  const latest = career[0].data.roles[0];
  const current = { company: latest.company, role: latest.role ?? latest.description.split('.')[0] };

  // Las demás empresas, una vez cada una. Algunas filas agrupan varias
  // («eBay · Euro RSCG · iSOCO · +++»); el «+++» no es un nombre.
  const employers = [
    ...new Set(
      career
        .flatMap((era) => era.data.roles.flatMap((r) => r.company.split(' · ')))
        .filter((company) => company !== current.company && company !== '+++')
    ),
  ];

  // Presentación en tercera persona y con frases que se entienden solas: un
  // agente cita fragmentos sueltos, y «nice to meet you I'm Salva» fuera de la
  // página no dice quién es.
  const about = [
    `${site.name} is a Product and UX Design Director based in ${site.location}, ${lowerFirst(hero.claim)}`,
    `Current role: ${current.role} at ${current.company}.`,
    `Previously at ${employers.join(', ')}.`,
  ].join(' ');

  return {
    name: site.name,
    role: site.role,
    summary: site.description,
    about,
    location: site.location,
    current,
    employers,
    updated: new Date().toISOString().slice(0, 10),
    email: site.email,
    links: footer.links,
    facts: hero.stats.map((stat) => ({
      value: statValue(stat),
      label: stat.label,
      sentence: `${site.name} ${lowerFirst(stat.fact)}`,
    })),
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
    career: career.map((era) => ({
      // «Now» se queda corto fuera de la página: «present» es lo que se lee
      // en un currículum.
      period: era.data.period.replace(/Now$/, 'present'),
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
    p.about,
    '',
    `Last updated: ${p.updated}`,
    `Website: ${home}`,
    `Email: ${p.email}`,
    ...p.links.map((l) => `${l.label}: ${l.href}`),
    '',
    `## Key facts about ${p.name}`,
    '',
    ...p.facts.map((f) => `- ${f.sentence}`),
    '',
    `## Capabilities of ${p.name}`,
    '',
    ...p.capabilities.map((c) => `- **${c.title}.** ${c.summary}`),
    '',
    `## Recent projects by ${p.name}`,
    '',
    ...p.projects.map((pr) => `- **${pr.title}.** ${pr.summary}`),
    '',
    `## Clients ${p.name} has worked for`,
    '',
    p.clients.join(', ') + '.',
    '',
    `## Talks by ${p.name}`,
    '',
    ...p.talks.map((t) => `- ${t.url ? `[${t.title}](${t.url})` : t.title}${t.lang ? ` (${t.lang})` : ''}. ${t.summary}`),
    '',
    `## Writing by ${p.name}`,
    '',
    ...p.writings.map((w) => `- ${w.url ? `[${w.title}](${w.url})` : w.title}${w.lang ? ` (${w.lang})` : ''}`),
    '',
    `## Career of ${p.name}`,
    '',
    ...p.career.flatMap((era) => [
      `### ${era.period}: ${era.title}`,
      '',
      era.summary,
      '',
      ...era.roles.map((r) => `- **${r.company}**${r.role ? ` (${r.role})` : ''}: ${r.description}`),
      '',
    ]),
    `In ${p.name}’s own words: “${p.closing}”`,
    '',
    `## Contact ${p.name}`,
    '',
    `Email ${p.email}, or LinkedIn: ${p.links.find((l) => l.label === 'LinkedIn')?.href}.`,
    '',
  ];
  return lines.join('\n');
}
