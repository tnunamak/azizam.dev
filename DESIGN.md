---
name: Azizam
description: A self-hosted AI gateway, shared on the owner's terms.
colors:
  bg: "#f3f6f6"
  panel: "#ffffff"
  panel2: "#e9eeef"
  line: "#d7e0e2"
  text: "#10232a"
  muted: "#3d4f55"
  accent: "#0a6676"
  primary: "#0d4552"
  brand-copper: "#c4532b"
  dark-bg: "#0c1f25"
  dark-panel: "#112930"
  dark-text: "#e3ecee"
  dark-muted: "#b4c6cb"
  dark-accent: "#8cc8cb"
  dark-primary: "#1f6f79"
  dark-brand-copper: "#f08a5d"
  code-bg: "#0d1117"
typography:
  fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif"
  h1: "60px / 38px phone, weight 750, line 1.05, -0.02em"
  h2: "36px / 28px phone"
  h3: "20px"
  body: "17px / 16px phone, line 1.55"
rounded:
  card: "16px"
  control: "6px to 8px"
---

# Design System: Azizam

The tokens above live as CSS custom properties in `src/styles/global.css`. They match the gateway app and its product-site spec (`site-hill/DESIGN.md`). The site loads no web fonts and no third-party hosts.

## Principles

- One outcome claim, one real artifact (a recorded request and reply), then mechanism. Home stays short; the gallery lives on Examples and the detail lives in Docs.
- Copper is the brand mark colour. On the site it marks the curl, the words "Your own" in the h1, the early-access rule and the focus ring. It is never body text, a button or a link.
- Primary actions use deep teal. Links use the accent. Light and dark follow the system setting (`prefers-color-scheme`); there is no toggle.
- Cards have a 16px radius and a 1px border. No shadows. Sections are 96px apart on desktop, 64px on phone.
- Every number and every output on the site comes from a recording or from the docs. No testimonials, counts, logos or invented results.
- Motion is not used. Any added motion must respect `prefers-reduced-motion`.

## Brand

The mark is the copper curl, drawn by `docs/design/brand/curl.py` in the gateway repository. `src/components/Mark.astro` holds the master path, `public/favicon.svg` the firmer 16 and 32 px drawing, and `npm run assets` renders `public/og.png` and `public/apple-touch-icon.png`. The fish is retired.

## Pages

- **Home** (`/`): hero with the recorded exchange, four value cards, a three-stage flow, quick start with an early-access block, and the honest-limits list.
- **Examples** (`/examples/`): recorded text requests, grouped by capability, with a chip row that jumps between groups.
- **Docs** (`/docs/`): sidebar, on-page contents, search (Pagefind), previous and next links.

All three share one header (brand, Examples, Docs, API, Get started) and one footer. At 390px the header shows the brand and a 44px Menu disclosure.

## Accessibility

AA contrast in both themes, one h1 per page, ordered headings, a skip link, visible focus, 44px tap targets on phones, and pages that read without JavaScript. `npm run verify` checks these with axe and layout assertions.
