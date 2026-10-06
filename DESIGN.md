---
name: Azizam
description: Existing apps and agents connected to owner-controlled AI engines.
colors:
  paper: "#f6f4ec"
  ink: "#202d29"
  muted: "#58635d"
  line: "#d8ddd3"
  green: "#155b50"
  soft: "#e9e9de"
  code: "#182b25"
  code-ink: "#e5eee5"
  dark-paper: "#14221e"
  dark-ink: "#ecede2"
  dark-muted: "#afbcb2"
  dark-line: "#394b42"
  dark-green: "#69d8c7"
  dark-soft: "#20332a"
  dark-code: "#0c1813"
typography:
  display:
    fontFamily: "Newsreader Variable, serif"
    fontSize: "clamp(60px, 6.1vw, 88px)"
    fontWeight: 450
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Newsreader Variable, serif"
    fontSize: "clamp(42px, 4.4vw, 64px)"
    fontWeight: 450
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  body:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: "17px"
    lineHeight: 1.65
  title:
    fontSize: "clamp(34px, 3vw, 46px)"
  utility:
    steps: [10, 11, 12, 13, 14, 15, 16, 19, 20, 22, 30]
  label:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: "12px"
    fontWeight: 550
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
rounded:
  sm: "4px"
  md: "5px"
  lg: "8px"
  full: "50%"
spacing:
  container-desktop: "calc(100% - 96px)"
  container-tablet: "calc(100% - 64px)"
  container-mobile: "calc(100% - 40px)"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "14px 23px"
    height: "50px"
  code-block:
    backgroundColor: "{colors.code}"
    textColor: "{colors.code-ink}"
    rounded: "{rounded.lg}"
---

# Design System: Azizam

## Refresh direction

Persuade mode. The client-to-gateway-to-engine diagram is the authored hero moment: two request passes, stopped within four seconds, disabled for reduced motion. The product is proved through eight real main-branch UI captures with explicit seeded captions. Newsreader, warm paper, deep green and the app’s outline fish carry the identity. Dark accent matches app teal `#69d8c7`.

## Overview

**Creative North Star: "The Independent Software Editorial"**

The visual system reads like a careful technical manual: warm paper, exact typography, sparse rules, and real product proof.

**Key Characteristics:**
- Serif display type carries the promise; DM Sans handles UI and prose.
- Prose stays unboxed; proof, code, and routing diagrams may be framed.
- Green is the sole accent.

## Colors

The palette is warm paper, forest ink, muted utility text, and a deep green accent; dark mode translates the same roles into forest-black.

### Primary
- **Gateway Green** (`#155b50`): links, primary actions, selection, focus outlines, and local-first sections.

### Neutral
- **Warm Paper** (`#f6f4ec`): page background and primary-action text.
- **Forest Ink** (`#202d29`): main copy and headings.
- **Quiet Muted** (`#58635d`): captions, notes, secondary text, and status qualifiers.
- **Rule Line** (`#d8ddd3`): section dividers and light borders.
- **Soft Paper** (`#e9e9de`): header strips and hover fields.
- **Code Ink Surface** (`#182b25`): code blocks and dense technical proof.

**The One Accent Rule.** Use green for decisions, links, and emphasis.

## Typography

**Display Font:** Newsreader Variable, serif

**Body Font:** DM Sans Variable, sans-serif

**Label/Mono Font:** DM Sans Variable for UI labels, DM Sans on the compatibility heading, and system monospace for code.

**Character:** Editorial but practical: Newsreader gives the page a bookish promise; DM Sans keeps details clear.

### Hierarchy
- **Display** (450, `clamp(60px, 6.1vw, 88px)`, `1.02`): hero promise.
- **Headline** (450, `clamp(42px, 4.4vw, 64px)`, `1.05`): major section starts.
- **Title** (450, `clamp(34px, 3vw, 46px)`, `1.07`): feature headings.
- **Body** (`17px`, `1.65`): prose, often narrowed to about 350-390px.
- **Label** (`11-14px`, medium weight): navigation, captions, code headers, and controls.

## Layout

The page uses a centered `1240px` max container with desktop gutters of `48px`, tablet gutters of `32px`, and mobile gutters of `20px`. Hero and feature sections use two-column grids on desktop, then collapse below `760px`. Section rhythm is spacious: intros start around `100px`, rows use `76px` vertical padding, and dividers carry the flow.

## Elevation & Depth

The system has no shadow vocabulary. Depth comes from tonal surfaces, horizontal rules, clipped proof windows, and code blocks.

## Shapes

Corners are restrained: `5px` for buttons, `8px` for proof and code containers, circles for the gateway hub, icon controls and step markers. Borders are one-pixel rules.

## Components

### Buttons
- **Shape:** compact rectangle with `5px` radius and at least `50px` height.
- **Primary:** green fill, paper text, `14px 23px` padding, medium label.
- **Hover / Focus:** primary lifts `-2px`; focus uses a `2px` green outline with `5px` offset.

### Code Blocks
- **Style:** dark green ink surface, pale code text, `8px` radius, header strip, optional copy button.
- **Text:** `12px` desktop code, `11px` small-screen code, `1.8` line-height.

### Navigation
- **Style:** small DM Sans links, sparse spacing, underline on hover, compact mobile header.

## Do's and Don'ts

### Do:
- **Do** use real product visuals and exact protocol examples as proof.
- **Do** keep explanatory prose outside cards.
- **Do** preserve the paper, ink, green, and code-surface roles in both themes.

### Don't:
- **Don't** add testimonials, stars, live status, costs, timings, or unsupported coverage claims.
- **Don't** introduce shadows for ordinary layout.
- **Don't** add new accent colors or rounded pill-heavy UI.
