# azizam.dev

Source for [azizam.dev](https://azizam.dev), the public site and documentation for
Azizam, a self-hosted AI gateway. Astro static site, deployed to GitHub Pages on
every push to `main` by `.github/workflows/deploy.yml`.

| Path | What it is |
| --- | --- |
| `/` | Home |
| `/examples/` | Real recorded requests (`src/data/examples.json`) |
| `/docs/` | Documentation: Markdown in `src/content/docs`, page order in `src/data/docs-nav.json` |

```sh
npm ci
npm run dev       # http://127.0.0.1:4321 (search needs a built site)
npm run build     # static output in dist/, then the Pagefind search index
npm run verify    # build checks, links, accessibility, layout, search (starts its own preview)
npm run lighthouse  # needs `npm run preview` running on port 4322
npm run assets    # redraw public/og.png and public/apple-touch-icon.png from the curl mark
```

The docs link between pages with relative `.md` links (`../operate/security.md#anchor`).
`src/plugins/docs-links.mjs` rewrites them to site URLs and fails the build on a missing page.

The site is unlisted (`noindex`, `robots.txt` disallows all) until launch.
The contact address in `src/config.ts` is a placeholder (`CONTACT_VERIFIED = false`).

All rights reserved; see [LICENSE](LICENSE).
