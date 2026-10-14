// Docs pages: copy buttons on code blocks and search over the static Pagefind index.
// Pages read fine without this script.
const status = document.getElementById('copy-status');

for (const pre of document.querySelectorAll<HTMLPreElement>('.prose pre')) {
  const code = pre.querySelector('code');
  if (!code) continue;
  const wrap = document.createElement('div');
  wrap.className = 'codeblock';
  const bar = document.createElement('div');
  bar.className = 'code-bar';
  const lang = document.createElement('span');
  lang.className = 'code-lang';
  lang.textContent = pre.dataset.language && pre.dataset.language !== 'plaintext' ? pre.dataset.language : '';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy';
  button.textContent = 'Copy';
  button.addEventListener('click', async () => {
    let ok = true;
    try {
      await navigator.clipboard.writeText(code.textContent ?? '');
    } catch {
      ok = false;
    }
    button.textContent = ok ? 'Copied' : 'Copy failed';
    if (status) status.textContent = ok ? 'Code copied' : 'Copy failed. Select the code and copy it.';
    setTimeout(() => { button.textContent = 'Copy'; }, 2000);
  });
  bar.append(lang, button);
  pre.replaceWith(wrap);
  wrap.append(bar, pre);
}

// Search. Pagefind builds the index at the end of `npm run build`, so it does not exist in `astro dev`.
interface PagefindSub { title: string; url: string; excerpt: string; }
interface PagefindData { url: string; meta: { title?: string }; excerpt: string; sub_results?: PagefindSub[]; }
interface Pagefind {
  init(): Promise<void>;
  search(query: string): Promise<{ results: { data(): Promise<PagefindData> }[] }>;
}

const dialog = document.getElementById('search') as HTMLDialogElement | null;
const open = document.querySelector<HTMLButtonElement>('.search-open');
const input = document.getElementById('search-input') as HTMLInputElement | null;
const results = document.getElementById('search-results');
const count = document.getElementById('search-count');

if (dialog && open && input && results && count && typeof dialog.showModal === 'function') {
  open.hidden = false;
  let pagefind: Pagefind | null = null;
  let loading: Promise<void> | null = null;

  const load = () => {
    loading ??= (async () => {
      const path = '/pagefind/pagefind.js';
      try {
        pagefind = (await import(/* @vite-ignore */ path)) as Pagefind;
        await pagefind.init();
      } catch {
        loading = null;
        count.textContent = 'Search is not available. Use the menu to find a page.';
      }
    })();
    return loading;
  };

  let latest = 0;
  const run = async () => {
    const query = input.value.trim();
    const mine = ++latest;
    results.replaceChildren();
    if (!query) { count.textContent = ''; return; }
    await load();
    if (!pagefind || mine !== latest) return;
    const found = await pagefind.search(query);
    const pages = await Promise.all(found.results.slice(0, 8).map((r) => r.data()));
    if (mine !== latest) return;
    count.textContent = pages.length ? `${pages.length}${found.results.length > 8 ? ' of ' + found.results.length : ''} pages match` : 'No pages match.';
    for (const page of pages) {
      const sub = page.sub_results?.find((s) => s.url.includes('#')) ?? page.sub_results?.[0];
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = sub?.url ?? page.url;
      const title = document.createElement('strong');
      title.textContent = page.meta.title ?? page.url;
      const excerpt = document.createElement('span');
      excerpt.innerHTML = sub?.excerpt ?? page.excerpt; // Pagefind escapes the page text and adds <mark> only.
      link.append(title, excerpt);
      item.append(link);
      results.append(item);
    }
  };

  const show = () => { dialog.showModal(); input.focus(); input.select(); void load(); };
  open.addEventListener('click', show);
  input.addEventListener('input', () => void run());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  document.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement;
    const typing = target.closest('input, textarea, select, [contenteditable]');
    if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      show();
    }
  });
}
