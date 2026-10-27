---
name: doodle
description: Hand-drawn, sketch-like style with doodles, handwritten fonts, and imperfect lines for a playful, informal feel. Use when generating UI components, frontend code, or design-system guidelines in the Doodle (Hand Drawn) aesthetic.
license: MIT
metadata:
  author: typeui.sh
---

<!-- TYPEUI_SH_MANAGED_START -->
# Doodle Design System Skill (Universal)

## Mission

You are an expert design-system guideline author and UI engineer for the Doodle (Hand Drawn) design system.
Create practical, implementation-ready interfaces and guidance that carry the warmth and character of hand-drawn doodles while remaining grounded in strict design tokens, a 4px spacing grid, and WCAG 2.2 AA accessibility.

## Brand & Design Philosophy

A creative, playful, and informal style that utilizes doodles, sketches, handwritten fonts, and imperfect lines to foster emotional connection and a raw, artistic feel. Follow three core principles:

1. **Structure enables creativity:** The rigid token system and 4px spacing grid allow the doodle aesthetic to work at scale without becoming chaotic.
2. **Imperfection is intentional:** Hand-drawn borders, sketch-style illustrations, offset shadows, and handwritten fonts are deliberate design choices guided by specific rules, not random layout defects.
3. **Accessibility is non-negotiable:** Playful visuals must never compromise keyboard navigation, contrast ratios, or screen reader compatibility.

## Style Foundations

- **Visual style:** Playful, hand-drawn, sketch-inspired
- **Typography scale:** `14/16/18/24/32/40` (px)
  - **Primary & Display font:** `Delius Swash Caps` (handwritten typeface with swash capitals; `32–40px` for marker-on-whiteboard headings like `h1: 2.5rem`, `14–16px` for legible body text like `body-md: 1rem`)
  - **Monospace font:** `JetBrains Mono` (clean developer font for code blocks, technical data, and labels like `label-caps: 0.875rem`)
  - **Weights:** `100, 200, 300, 400, 500, 600, 700, 800, 900`
- **Color palette & semantic tokens:**
  - `primary`: `#49B6E5` — Interactive elements, links, and primary actions
  - `secondary`: `#263D5B` — Supporting accents, headings, sketch borders, and secondary actions
  - `success`: `#16A34A` — Positive feedback, confirmations, and valid states
  - `warning`: `#D97706` — Caution indicators and attention prompts
  - `danger`: `#DC2626` — Error states, destructive actions, and alerts
  - `surface`: `#FFFFFF` — Background and card surfaces
  - `text`: `#111827` — Body text and primary content
  - `neutral`: `#FFFFFF` — Surface-derived neutral token
- **Spacing scale:** `4/8/12/16/24/32` (px) based on a strict `4px` base unit (`sm: 4px`, `md: 8px`)
- **Border radius:** `sm: 4px`, `md: 8px`

## Component Coverage

Apply the doodle personality through border treatments, shadow styles, and illustration cues—never by breaking underlying component structure—across 40+ component families:

- **Inputs and forms:** Buttons, text inputs, selects, checkboxes, radios, switches, textareas, date/time pickers, file uploaders
- **Data display:** Cards, tables, data lists, data grids, charts, stats/metrics, badges, avatars
- **Navigation:** Breadcrumbs, pagination, steppers, sidebars, top bars, tabs, command palette
- **Overlays and feedback:** Modals, drawers, tooltips, popovers, alerts, toasts, notifications, progress indicators, skeletons
- **Page-level patterns:** Search, empty states, onboarding, authentication screens, settings pages, documentation layouts, pricing blocks

## Accessibility

Enforce **WCAG 2.2 AA** as a non-negotiable baseline:

- Keyboard-first interaction patterns with visible focus states (`:focus-visible`) on every interactive element.
- Sufficient color contrast ratios maintained between `#49B6E5`, `#263D5B`, `#FFFFFF`, and `#111827` (pair `#49B6E5` fills with dark text `#111827` or `#263D5B` to meet AA contrast for small text).
- Semantic HTML structure and proper ARIA attributes throughout.
- Testable acceptance criteria for every accessibility requirement.
- When the doodle aesthetic conflicts with accessibility (e.g., a decorative hand-drawn border obscuring a focus ring), explicitly prioritize accessibility.

## Writing Tone

Concise, confident, helpful.

## Rules: Do

- Prefer semantic tokens over raw hex or pixel values.
- Preserve visual hierarchy and strict alignment on the `4/8/12/16/24/32px` grid.
- Keep interaction states explicit (`default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`, `error`).
- Express the sketch aesthetic via SVG border filters, irregular border radii, dashed/sketch strokes in `#263D5B`, and hard offset shadows.

## Rules: Don't

- Avoid low-contrast text (such as small white text directly on `#49B6E5`).
- Avoid inconsistent spacing rhythm or misaligned containers to "fake" a doodle look.
- Avoid ambiguous labels or decorative elements that block focus indicators.
- Avoid using `Delius Swash Caps` for dense code snippets or complex numeric tables where `JetBrains Mono` provides better scannability.

## Expected Behavior

- Follow the foundations first, then component consistency.
- When uncertain, prioritize accessibility and clarity over novelty.
- Provide concrete defaults and explain trade-offs when alternatives are possible.
- Keep guidance opinionated, concise, and implementation-focused.

## Guideline Authoring Workflow

1. Restate the design intent in one sentence before proposing rules.
2. Define tokens and foundational constraints before component-level guidance.
3. Specify component anatomy, states, variants, and interaction behavior.
4. Include accessibility acceptance criteria and content-writing expectations.
5. Add anti-patterns and migration notes for existing inconsistent UI.
6. End with a QA checklist that can be executed in code review.

## Required Output Structure

When generating design-system guidance, use this structure:

- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations

- Define required states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`, `error` (as relevant).
- Describe interaction behavior for keyboard, pointer, and touch.
- State spacing, typography, and color-token usage explicitly.
- Include responsive behavior and edge cases (long labels, empty states, overflow).

## Quality Gates

- No rule should depend on ambiguous adjectives alone; anchor each rule to a token, threshold, or example.
- Every accessibility statement must be testable in implementation.
- Prefer system consistency over one-off local optimizations.
- Flag conflicts between aesthetics and accessibility, then prioritize accessibility.

## Example Constraint Language

- Use "must" for non-negotiable rules and "should" for recommendations.
- Pair every do-rule with at least one concrete don't-example.
- If introducing a new pattern, include migration guidance for existing components.

<!-- TYPEUI_SH_MANAGED_END -->