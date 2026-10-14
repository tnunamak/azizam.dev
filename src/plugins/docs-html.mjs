// Rehype plugin for docs pages.
// - Heading ids use the same rule as the original docs, so in-page anchors keep working.
// - h2 and h3 get a "#" link to their own anchor.
// - Tables sit in a focusable, scrollable region.
const slugify = (text) => text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-') || 'section';

function textOf(node) {
  if (node.type === 'text') return node.value;
  if (node.type === 'element' && node.tagName === 'code') return (node.children ?? []).map(textOf).join('');
  return (node.children ?? []).map(textOf).join('');
}

export default function docsHtml() {
  return (tree) => {
    const used = new Map();
    const visit = (parent) => {
      parent.children = (parent.children ?? []).map((node) => {
        if (node.type !== 'element') return node;
        if (/^h[1-6]$/.test(node.tagName)) {
          const text = textOf(node);
          const slug = slugify(text);
          const count = used.get(slug) ?? 0;
          used.set(slug, count + 1);
          const id = count === 0 ? slug : `${slug}-${count}`;
          node.properties = { ...node.properties, id };
          if (node.tagName === 'h2' || node.tagName === 'h3') {
            node.children.push({ type: 'text', value: ' ' }, {
              type: 'element', tagName: 'a',
              properties: { className: ['anchor'], href: `#${id}`, ariaLabel: `Link to ${text}`, 'data-pagefind-ignore': 'true' },
              children: [], // the "#" is drawn by CSS, so heading text stays clean for the table of contents
            });
          }
          return node;
        }
        visit(node);
        if (node.tagName === 'table') {
          return {
            type: 'element', tagName: 'div',
            properties: { className: ['table-wrap'], tabindex: 0, role: 'region', ariaLabel: 'Table' },
            children: [node],
          };
        }
        return node;
      });
    };
    visit(tree);
  };
}
