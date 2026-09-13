import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/* Los `order` fijan el orden del artboard. Sin ellos el orden sería alfabético
   por nombre de archivo, que no es el del diseño. */

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
});

const capabilities = defineCollection({
  loader: glob({ base: './src/content/capabilities', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
});

/* Acepta el enlace tal cual se copia de YouTube (watch?v=, youtu.be/, embed/,
   shorts/, live/) o el identificador suelto, y devuelve solo el identificador. */
const toYoutubeId = (value: string) => {
  const trimmed = value.trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    const fromQuery = url.searchParams.get('v');
    if (fromQuery) return fromQuery;
    const last = url.pathname.split('/').filter(Boolean).pop();
    return last && /^[\w-]{11}$/.test(last) ? last : undefined;
  } catch {
    return undefined;
  }
};

const talks = defineCollection({
  loader: glob({ base: './src/content/talks', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number(),
      // Enlace de YouTube o su identificador; se guarda solo el identificador
      // y el modal lo compone contra youtube-nocookie.com. Sin él, la charla
      // se muestra pero no abre reproductor.
      youtubeId: z
        .string()
        .optional()
        .refine((v) => v === undefined || toYoutubeId(v) !== undefined, {
          message: 'No parece un enlace ni un identificador de YouTube',
        })
        .transform((v) => (v === undefined ? undefined : toYoutubeId(v))),
      thumbnail: image().optional(),
      thumbnailAlt: z.string().default(''),
    }),
});

const writings = defineCollection({
  loader: glob({ base: './src/content/writings', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number(),
      url: z.string().url().optional(),
      // Miniatura de 80 × 80. Decorativa: el título ya dice de qué va.
      thumbnail: image().optional(),
    }),
});

const background = defineCollection({
  loader: glob({ base: './src/content/background', pattern: '**/*.md' }),
  schema: z.object({
    period: z.string(),
    title: z.string(),
    order: z.number(),
    roles: z.array(
      z.object({
        company: z.string(),
        role: z.string().optional(),
        description: z.string(),
      })
    ),
  }),
});

const clients = defineCollection({
  loader: file('./src/data/clients.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    order: z.number(),
  }),
});

export const collections = { projects, capabilities, talks, writings, background, clients };
