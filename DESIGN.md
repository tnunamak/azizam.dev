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
    fontSize: "clamp(24px, 2vw, 28px)"
    fontWeight: 550
  body:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: "18px"
    lineHeight: 1.6
  caption:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: "14px"
  utility:
    steps: [12, 13, 14, 15, 16, 17, 18, 19, 20]
rounded:
  micro: "2px"
  inline: "4px"
  control: "4px"
  panel: "8px"
  dialog: "12px"
  frame: "6px"
  button: "5px"
spacing:
  container-desktop: "calc(100% - 96px)"
  container-mobile: "calc(100% - 40px)"
  measure: "65ch"
---

# Design System: Azizam

## Direction

The landing page follows an independent software editorial: one direct outcome, one real product screen, then the request path. Prose stays open on the page. Thin rules separate the four product claims. The screenshot has one restrained frame.

## Typography

Newsreader Variable carries the display promise. DM Sans Variable handles navigation, body text, captions, and controls. Both are self-hosted under SIL Open Font License 1.1. The page uses one responsive display scale, one responsive heading scale, and 18px body text. Paragraphs stay near 65 characters per line. Smaller utility sizes serve navigation, labels, captions, and code.

## Colour

Light surfaces use the app palette: background `#f3f6f6`, ink `#10232a`, primary `#0d4552`, and accent `#0a6676`. Dark mode uses a deep blue-green background and pale ink. The copper curl remains the only orange element; orange does not decorate text, links, or controls.

## Layout and interaction

The header lists Examples, Docs, and API, with the setup guide as its primary action. The footer links to the product, Docs, API, and Security. Home claims use plain rows with thin separators; the process is one line with arrows. The setup section has one short paragraph and a link, with no homepage commands.

The site respects system light and dark preferences, keyboard focus, reduced motion, and a 390px viewport. There is no authored motion on the landing page. Contrast must meet WCAG AA in both themes.

## Evidence

The landing page uses the seeded Apps & Keys screen in light and dark themes, captioned “Screens from a seeded demo gateway.” Its abbreviated key values and private address are removed from the distributed image. No testimonials, counts, live statuses, example costs, timings, or generated replies are used as proof.
