---
name: Azizam
description: A self-hosted gateway for the AI people already use.
colors:
  background: "#f6f4ec"
  ink: "#202d29"
  primary: "#155b50"
  accent: "#155b50"
  muted: "#58635d"
  line: "#d8ddd3"
  soft: "#e9e9de"
  on-primary: "#ffffff"
  code-background: "#182b25"
  code-ink: "#e5eee5"
  code-line: "#394b42"
  code-muted: "#afbcb2"
  code-hover: "#20332a"
  overlay: "rgb(5 15 18 / .6)"
  mark: "#c4532b"
  dark-background: "#14221e"
  dark-ink: "#ecede2"
  dark-muted: "#afbcb2"
  dark-line: "#394b42"
  dark-accent: "#69d8c7"
  dark-soft: "#20332a"
  dark-code: "#0c1813"
  dark-mark: "#f08a5d"
typography:
  display:
    fontFamily: "Newsreader Variable, serif"
    fontSize: "clamp(44px, 5vw, 68px)"
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

The landing page follows a warm editorial register: a two-column hero with the outcome line and setup link on the left, and a framed output wall on the right. The wall shows real Azizam output (four images, one speech clip, each with its receipt) and fits inside a 1440×900 first screen. Below the hero come three chapters (Use, Share, Understand), a developer request, the request flow and the limits. Borders appear only around real artifacts: the output wall, generated outputs, the chat exchange, the example holders card, the receipt and the code panel. Prose stays open on the page. Artifacts use 6px corners; landing controls and inline code use 4px. Documentation components keep their own radii: 8px for search controls and code/table panels, 6px for the search panel and code-copy control, and 12px for pager links.

## Typography

Newsreader Variable carries the display promise. DM Sans Variable handles navigation, body text, captions, and controls. Both are self-hosted under SIL Open Font License 1.1. The serif hero keeps its responsive scale. Homepage section headings use 28px type with 34px line height; claim-row titles use 24px type, 30px line height, and weight 500. Body text remains 18px. Paragraphs stay near 65 characters per line. Smaller utility sizes serve navigation, labels, captions, and code.

## Colour

Light surfaces use the warm paper palette: background `#f6f4ec`, ink `#202d29`, muted text `#58635d`, lines `#d8ddd3`, soft fills `#e9e9de`, and green `#155b50` for primary actions and links. The copper curl `#c4532b` is the accent colour: it marks the logo and nothing else on the page. Orange does not decorate text, links, or controls. Dark mode uses a deep green-black background `#14221e`, pale ink `#ecede2`, and a mint accent `#69d8c7`; the dark copper curl is `#f08a5d`.

This reverses the cool app palette (`#f3f6f6` background, `#0a6676` accent) that replaced this warm palette after commit ac6b591 (2026-10-06).

## Layout and interaction

The header lists Examples, Docs, and API, with "See what it makes" as its primary action; that action links to the Use section on the home page. The setup guide is linked once in the hero, with "API guides" beside it, so the header does not repeat it. The footer links to the product, Docs, API, and Security; their text stays 24px apart. Each link keeps a 44px minimum hit area with 12px inline padding and matching negative margins, so the hit area fills the flex gap without changing visible spacing. The first link text aligns with the content edge. The process stays on one line with right arrows above 720px, then stacks its stages with 90° down arrows and an 8px gap at 720px and below. The setup section has one short paragraph and a link to `/docs/start/install/`, with no homepage commands.

Audio uses a custom compact player: a round play button, a title, an SVG waveform built from real peaks in `src/data/audio-peaks.json`, and the duration and model. The native `<audio>` element does the playing; with JavaScript its native controls are removed. Without JavaScript the native controls stay. The chat reply shows its first eight lines with a fade and a native `<details>` "Read the full answer" toggle.

The site respects system light and dark preferences, keyboard focus, reduced motion, and a 390px viewport with 20px side gutters. At widths of 899px and below the hero stacks, with the output wall below the copy. There is no authored motion on the landing page. Contrast must meet WCAG AA in both themes.

## Evidence

The landing page shows real Azizam output, labelled as recordings: each artifact shows its date, requested and resolved model, and receipt id. The output wall holds four images from `image` (resolved to `krea2-turbo`) and one speech clip from `tts-1`. The Use section adds the music clip and the chat exchange. Where the gateway recorded no cost, the page says "not recorded". The Share card is a site-rendered example, marked "Example", and is not a screenshot. The Understand receipt has its app label removed. No testimonials, counts, live statuses, or invented costs and timings are used as proof.
