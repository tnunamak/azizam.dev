// Remark plugin: rewrite relative `.md` links in the docs to site URLs.
// Fails the build when a link points at a page that is not in docs-nav.json.
import { readFileSync } from 'node:fs';
import { posix, relative, resolve } from 'node:path';

const root = resolve('src/content/docs');
const nav = JSON.parse(readFileSync(new URL('../data/docs-nav.json', import.meta.url), 'utf8'));
const pages = new Set(nav.flatMap((section) => section.pages));

export function docsUrl(id) {
  if (id === 'index') return '/docs/';
  return `/docs/${id.replace(/\/index$/, '')}/`;
}

function rewrite(href, from) {
  if (!href || /^([a-z][a-z0-9+.-]*:|\/|#)/i.test(href)) return href;
  const [target, anchor] = href.split('#');
  if (!target.endsWith('.md')) throw new Error(`${from}: relative link must target a .md page (${href})`);
  const id = posix.normalize(posix.join(posix.dirname(from), target)).replace(/\.md$/, '');
  if (!pages.has(id)) throw new Error(`${from}: link to missing page ${href}`);
  return docsUrl(id) + (anchor ? `#${anchor}` : '');
}

export default function docsLinks() {
  return (tree, file) => {
    const from = relative(root, file.path).split('\\').join('/');
    const walk = (node) => {
      if (node.type === 'link') node.url = rewrite(node.url, from);
      if (node.type === 'html') node.value = node.value.replace(/href="([^"]*)"/g, (_, href) => `href="${rewrite(href, from)}"`);
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
