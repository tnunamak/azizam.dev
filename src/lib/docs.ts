import { getCollection, type CollectionEntry } from 'astro:content';
import nav from '../data/docs-nav.json';

export type DocEntry = CollectionEntry<'docs'>;
export interface DocSection { title: string; pages: DocEntry[]; }

export const docsUrl = (id: string) => (id === 'index' ? '/docs/' : `/docs/${id.replace(/\/index$/, '')}/`);

/** All docs in the order of docs-nav.json; fails the build if a page and the nav disagree. */
export async function loadDocs() {
  const entries = await getCollection('docs');
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const listed = nav.flatMap((section) => section.pages);
  const missing = listed.filter((id) => !byId.has(id));
  const orphans = entries.filter((entry) => !listed.includes(entry.id)).map((entry) => entry.id);
  if (missing.length || orphans.length) {
    throw new Error(`docs-nav.json and src/content/docs disagree. Missing: ${missing.join(', ') || 'none'}. Not in nav: ${orphans.join(', ') || 'none'}.`);
  }
  const sections: DocSection[] = nav.map((section) => ({ title: section.title, pages: section.pages.map((id) => byId.get(id)!) }));
  const flat = sections.flatMap((section) => section.pages.map((entry) => ({ entry, section: section.title })));
  return { sections, flat };
}
