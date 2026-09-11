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

const talks = defineCollection({
  loader: glob({ base: './src/content/talks', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number(),
      // Identificador de YouTube, no URL completa: el modal lo compone contra
      // youtube-nocookie.com. Opcional mientras Salvador no los facilite —
      // sin él, la charla se muestra pero no abre reproductor.
      youtubeId: z.string().optional(),
      thumbnail: image().optional(),
      thumbnailAlt: z.string().default(''),
    }),
});

const writings = defineCollection({
  loader: glob({ base: './src/content/writings', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    url: z.string().url().optional(),
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
