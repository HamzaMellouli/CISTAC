---
name: Doodle
colors:
  primary: "#49B6E5"
  secondary: "#263D5B"
  success: "#16A34A"
  warning: "#D97706"
  danger: "#DC2626"
  surface: "#FFFFFF"
  text: "#111827"
  neutral: "#FFFFFF"
typography:
  h1:
    fontFamily: "Delius Swash Caps"
    fontSize: 2.5rem
  body-md:
    fontFamily: "Delius Swash Caps"
    fontSize: 1rem
  label-caps:
    fontFamily: "JetBrains Mono"
    fontSize: 0.875rem
  sourceScale: "14/16/18/24/32/40"
  weights: "100, 200, 300, 400, 500, 600, 700, 800, 900"
rounded:
  sm: 4px
  md: 8px
spacing:
  sm: 4px
  md: 8px
  sourceScale: "4/8/12/16/24/32"
---

## Overview

Doodle (Hand Drawn) is a playful, sketch-inspired design system that generates interfaces with the warmth and character of hand-drawn doodles. Instead of rigid pixel-perfect precision, it leans into imperfect lines, handwritten typography, and a raw artistic energy that makes digital products feel human and approachable—backed by strict design tokens, a 4px spacing grid, and WCAG 2.2 AA accessibility standards.

## Design Philosophy

1. **Structure enables creativity:** The rigid token system and 4px spacing grid allow the doodle aesthetic to scale without becoming messy or chaotic.
2. **Imperfection is intentional:** Hand-drawn borders, sketch-style illustrations, offset shadows, and handwritten fonts are deliberate design choices governed by specific rules, not random layout artifacts.
3. **Accessibility is non-negotiable:** Playful visuals must never compromise keyboard navigation, contrast ratios, focus visibility, or screen reader compatibility.

## Style Foundations

- **Visual style:** Playful, hand-drawn, sketch-inspired
- **Typography scale:** `14 / 16 / 18 / 24 / 32 / 40px`
- **Typography fonts:** `primary=Delius Swash Caps`, `display=Delius Swash Caps`, `mono=JetBrains Mono`
- **Typography weights:** `100, 200, 300, 400, 500, 600, 700, 800, 900`
- **Color palette:** `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`, `surface`, `text`
- **Spacing scale:** `4 / 8 / 12 / 16 / 24 / 32px` (4px base unit)
- **Border radius:** `sm=4px`, `md=8px`

## Color Palette

Hand Drawn pairs a vibrant sky blue primary with a deep navy secondary, grounding the playful aesthetic so it remains structured and coherent:

| Token | Value | Purpose |
| :--- | :--- | :--- |
| **Primary** | `#49B6E5` | Interactive elements, links, and primary actions |
| **Secondary** | `#263D5B` | Supporting accents, headings, sketch borders, and secondary actions |
| **Success** | `#16A34A` | Positive feedback, confirmations, and valid states |
| **Warning** | `#D97706` | Caution indicators and attention prompts |
| **Danger** | `#DC2626` | Error states, destructive actions, and alerts |
| **Surface** | `#FFFFFF` | Background and card surfaces |
| **Text** | `#111827` | Body text and primary content |
| **Neutral** | `#FFFFFF` | Derived from the surface token for official format compatibility |

## Typography

A two-font system designed to feel like handwriting without sacrificing readability:

- **Primary & Display (`Delius Swash Caps`):** A handwritten typeface with swash capitals that gives headings and body text a sketched, personal quality. Larger sizes (`32px–40px`, such as `h1` at `2.5rem`) evoke marker-on-whiteboard headings, while smaller sizes (`14px–16px`, such as `body-md` at `1rem`) remain legible for body content.
- **Monospace (`JetBrains Mono`):** A clean developer font for code blocks, technical metadata, dense numbers, and uppercase labels (`label-caps` at `0.875rem`), providing deliberate contrast against the hand-drawn text.
- **Scale & Weights:** Follows `14 / 16 / 18 / 24 / 32 / 40px` across weights `100` through `900`.

## Spacing

All spacing uses a `4px` base unit with a scale of `4 / 8 / 12 / 16 / 24 / 32px` (`sm: 4px`, `md: 8px`). Consistent spacing keeps the deliberately imperfect aesthetic grounded and prevents layouts from looking broken.

## Component Coverage

Guidance applies across 40+ component families adapted to carry the sketch aesthetic via border treatments, shadow styles, and illustration cues while remaining structurally sound:

- **Inputs and Forms:** Buttons, text inputs, selects, checkboxes, radios, switches, textareas, date/time pickers, file uploaders
- **Data Display:** Cards, tables, data lists, data grids, charts, stats/metrics, badges, avatars
- **Navigation:** Breadcrumbs, pagination, steppers, sidebars, top bars, tabs, command palette
- **Overlays and Feedback:** Modals, drawers, tooltips, popovers, alerts, toasts, notifications, progress indicators, skeletons
- **Page-Level Patterns:** Search, empty states, onboarding, authentication screens, settings pages, documentation layouts, pricing blocks

## Accessibility

Enforces **WCAG 2.2 AA** compliance as a non-negotiable baseline:

- Keyboard-first interaction patterns with visible focus states (`:focus-visible`) on every interactive element.
- Sufficient color contrast ratios maintained between `#49B6E5`, `#263D5B`, `#FFFFFF`, and `#111827`.
- Semantic HTML structure and proper ARIA attributes throughout.
- Whenever the doodle aesthetic conflicts with accessibility (e.g., a decorative hand-drawn border obscuring a focus ring), accessibility takes priority.