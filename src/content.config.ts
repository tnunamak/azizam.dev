import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
  // Keep `api/index` as the id so ids match src/data/docs-nav.json.
  loader: glob({ pattern: '**/*.md', base: './src/content/docs', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: z.object({ title: z.string(), summary: z.string() }),
});

export const collections = { docs };
