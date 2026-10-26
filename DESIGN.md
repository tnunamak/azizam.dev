---
name: Azizam
description: A self-hosted gateway for the AI people already use.
colors:
  background: "#f3f6f6"
  ink: "#10232a"
  primary: "#0d4552"
  accent: "#0a6676"
  line: "#d7e0e2"
  on-primary: "#ffffff"
  code-background: "#0d1117"
  code-ink: "#e6edf3"
  code-line: "#30363d"
  code-muted: "#9ea7b3"
  code-hover: "#21262d"
  overlay: "rgb(5 15 18 / .6)"
  mark: "#c4532b"
  dark-background: "#0c1f25"
  dark-ink: "#e3ecee"
  dark-primary: "#1f6f79"
  dark-accent: "#8cc8cb"
  dark-mark: "#f08a5d"
typography:
  display:
    fontFamily: "Newsreader Variable, serif"
    fontSize: "clamp(44px, 5.4vw, 72px)"
    fontWeight: 430
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  heading:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: "28px"
    fontWeight: 550
    lineHeight: "34px"
  claimTitle:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: "30px"
  body:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: "18px"
    lineHeight: 1.6
  caption:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: "14px"
  utility:
    steps: [12, 13, 14, 15, 16, 17, 18, 19, 20]
spacing:
  container-desktop: "calc(100% - 96px)"
  container-mobile: "calc(100% - 40px)"
  measure: "65ch"
---

# Design System: Azizam

## Direction

The landing page follows an independent software editorial: one direct outcome, a readable product-screen crop, then the request path. The hero uses one column, top-aligns the copy, and separates copy from proof by 24px; phone spacing is 20px. The hero copy precedes a 1100px-wide desktop proof crop. Prose stays open on the page. Thin rules separate the four product claims. The screenshot has one restrained frame. The screenshot frame uses 6px corners; landing controls and inline code use 4px. Documentation components keep their own radii: 8px for search controls and code/table panels, 6px for the search panel and code-copy control, and 12px for pager links.

## Typography

Newsreader Variable carries the display promise. DM Sans Variable handles navigation, body text, captions, and controls. Both are self-hosted under SIL Open Font License 1.1. The serif hero keeps its responsive scale. Homepage section headings use 28px type with 34px line height; claim-row titles use 24px type, 30px line height, and weight 500. Body text remains 18px. Paragraphs stay near 65 characters per line. Smaller utility sizes serve navigation, labels, captions, and code.

## Colour

Light surfaces use the app palette: background `#f3f6f6`, ink `#10232a`, primary `#0d4552`, and accent `#0a6676`. Dark mode uses a deep blue-green background and pale ink. The copper curl remains the only orange element; orange does not decorate text, links, or controls.

## Layout and interaction

The header lists Examples, Docs, and API, with the setup guide as its primary action. The footer links to the product, Docs, API, and Security; their text stays 24px apart. Each link keeps a 44px minimum hit area with 12px inline padding and matching negative margins, so the hit area fills the flex gap without changing visible spacing. The first link text aligns with the content edge. Home claims use plain rows with thin separators. The process stays on one line with right arrows above 720px, then stacks its stages with 90° down arrows and an 8px gap at 720px and below. The setup section has one short paragraph and a link to `/docs/start/install/`, with no homepage commands.

The site respects system light and dark preferences, keyboard focus, reduced motion, and a 390px viewport with 20px side gutters. The 340px-wide phone proof crop appears at widths of 900px and below in a frame capped at 342px, including its border. Both proof crops display at native size at the 1440px and 390px reference widths. There is no authored motion on the landing page. Contrast must meet WCAG AA in both themes.

## Evidence

The landing page uses light and dark crops of the seeded Apps & Keys screen, captioned “Apps & keys, with demo data.” The desktop crop is 1100×245px from the 1440px viewport capture; the phone crop is 340×397px from the 390px viewport capture. A viewport capture, not a full-page one, keeps the fixed bottom navigation where a phone shows it. The phone crop ends above that navigation and above transient notices, so no tab bar or toast sits over the content. Masked key prefixes appear as nine muted bullets in monospace on their row backgrounds; no real values appear in the distributed images. No testimonials, counts, live statuses, example costs, timings, or generated replies are used as proof.
