# 01. Welcome (`/`) · HERO PAGE

## Purpose, user moment, rubric criteria
- **Purpose**: First-impression landing screen that communicates the 4 pillars (*Assess, Understand, Coach, Improve*), proves epistemic honesty at a glance via a live interactive preview of the Uncertainty Radar, and launches users or evaluators into their first insight in under 3 minutes via two clear paths: **"Start 2-Minute Baseline"** or **"Try a Judge Demo Persona"**.
- **User / Evaluator Moment**: Second `0:00` of the 3–5 minute demo video, Slide 2 of the pitch deck, and the very first screen evaluators open. Must survive a video freeze-frame with zero visual clutter.
- **Rubric Criteria Served**:
  - **UX (Phase 1 — 9%)**: First insight in $\le 3$ minutes; unmistakable primary CTA vs. instant Judge Persona bypass.
  - **Relevance (Phase 1 — 12%)**: Clearly labels the 4 challenge pillars (*Assess, Understand, Coach, Improve*), non-biometric guarantee, and dynamic 0–100 Collaboration Score.
  - **Innovation & Profile Quality (Phase 1 — 12% & Phase 2 — 8%)**: Live interactive preview of the Uncertainty Radar (`76% ± 5%` vs hatched low-confidence range) right on the hero canvas.
- **Time Budget**: `2.5 hours` (+50% alert threshold: `3.75 hours`).

---

## Wireframes: desktop, mobile

### Desktop (`1440 px` — Asymmetric 7:5 Split Hero + 4-Pillar Proof Strip + Instant Persona Launcher)
```text
+--------------------------------------------------------------------------------------------------+
| [ST] SynapseTwin · CISTAC 1.0     [Simulated Data]    [3|6|7|10 Dims] [Dark/Light] [Style Guide] |
+--------------------------------------------------------------------------------------------------+
| HERO LEFT (7 cols)                                 | HERO RIGHT (5 cols): LIVE TWIN PREVIEW CARD |
| [Badge: ★ Non-Clinical · Uncertainty-Aware]        | +-----------------------------------------+ |
| [Badge: ✓ Mandatory Non-Biometric Mode ON]         | | Interactive Brain Twin Preview          | |
|                                                    | | [Steady Improver] [Noisy Low-Conf]      | |
| Meet your evolving cognitive twin—                 | |         ( Uncertainty Radar )           | |
| mapped with honest confidence ranges,              | |         ● WM 75%±5%  ■ IC 82%±6%        | |
| never fixed labels.                                | |         ▨ EP 54%±16% (Hatched)          | |
|                                                    | | [Why this advice? ▼] [View as Table]    | |
| Continuous micro-assessments, SAT-JEPA temporal    | +-----------------------------------------+ |
| twin modeling, and explainable AI coaching.        |                                             |
|                                                    |                                             |
| [ Start 2-Min Baseline → ]  [ Try Demo Persona ]   |                                             |
| ⏱ First insight in ~2 mins · Zero camera/mic req.  |                                             |
+----------------------------------------------------+---------------------------------------------+
| THE 4 CHALLENGE PILLARS (Layers A → C + Collaboration Score)                                     |
| +-----------------------+ +-----------------------+ +-----------------------+ +----------------+ |
| | 1. ASSESS (Layer A)   | | 2. UNDERSTAND (Twin)  | | 3. COACH (Layer B)    | | 4. IMPROVE (C) | |
| | Adaptive N-Back,      | | SAT-JEPA temporal     | | Every tip carries a   | | 85%-rule plan  | |
| | Stroop, UFOV, MST     | | state + 95% CI bands  | | 5-part "Why this?"    | | + 0–100 Collab | |
| +-----------------------+ +-----------------------+ +-----------------------+ +----------------+ |
+--------------------------------------------------------------------------------------------------+
| INSTANT JUDGE & DEMO PERSONA LAUNCHER (One-Click Teleport to Calibrated Profile)                 |
| +--------------------------------+ +--------------------------------+ +------------------------+ |
| | ● Youssef · Steady Improver    | | ▨ Salma · Low Confidence       | | ○ Nour · New Student   | |
| | 6 weeks history · 84% conf.    | | Irregular blocks · Hatched CI  | | 0 trials · Ready for   | |
| | Collab Score: 82 ± 4           | | Triggers fatigue coaching      | | 2-min onboarding flow  | |
| | [ Open Youssef's Dashboard → ] | | [ Inspect Hatched Twin → ]     | | [ Start Onboarding → ] | |
| +--------------------------------+ +--------------------------------+ +------------------------+ |
+--------------------------------------------------------------------------------------------------+
```

### Mobile (`375 px` — Single-Column Priority Stack)
```text
+---------------------------------------+
| [ST] SynapseTwin   [7 Dims] [Theme]   |
+---------------------------------------+
| [★ Non-Clinical] [✓ Non-Biometric]    |
| Meet your evolving cognitive twin—    |
| mapped with honest confidence ranges. |
|                                       |
| [ Start 2-Min Baseline → (44px) ]     |
| [ Jump to Judge Personas ↓ (44px) ]   |
+---------------------------------------+
| LIVE INTERACTIVE TWIN PREVIEW         |
| [Steady Improver] [Low Confidence]    |
|       ( Uncertainty Radar )           |
| [View as Table]                       |
+---------------------------------------+
| 4 PILLARS: Assess · Understand ·      |
| Coach · Improve                       |
+---------------------------------------+
| JUDGE PERSONA LAUNCHER                |
| [Card: Youssef · Steady Improver]     |
| [Card: Salma · Low Confidence]        |
| [Card: Nour · New Student]            |
+---------------------------------------+
```

---

## Content and copy deck
- **Eyebrow Badges**:
  - `★ CISTAC 1.0 · Non-Clinical Cognitive Growth Agent`
  - `✓ Mandatory Non-Biometric Mode Active`
- **Hero Headline**: `Meet your evolving cognitive twin—mapped with honest confidence ranges, never fixed labels.`
- **Hero Subcopy**: `Unlike static one-off tests, SynapseTwin continuously calibrates your profile across ${N} cognitive dimensions, shows transparent uncertainty bands (±CI), and explains the telemetry behind every piece of advice.`
- **Primary CTA**: `Start 2-Minute Baseline →` (routes to `/onboarding` or `/assessment`)
- **Secondary CTA**: `Explore Judge Personas` (smooth-scrolls/focuses the 3-persona launcher or switches active persona)
- **Trust Microcopy**: `First insight in under 3 minutes · Keyboard & touch ready · No camera or microphone required.`
- **4 Pillars Copy**:
  1. **Assess (Layer A)**: `Adaptive micro-tasks capturing accuracy, reaction time (ms), error bursts, and hesitation jitter.`
  2. **Understand (Brain Twin)**: `SAT-JEPA temporal smoothing and 95% confidence bands—hatched whenever sample size is still preliminary.`
  3. **Coach (Layer B)**: `Growth-mindset guidance with a 5-part “Why this?” reasoning trail and strict non-clinical guardrails.`
  4. **Improve (Layer C)**: `85%-accuracy staircase plans, session fatigue heatmaps, and a transparent 0–100 AI Collaboration Score.`

---

## States: loading, empty, partial, error, offline, low confidence
- **Ready (Default)**: Shows `steady-improver` (Youssef) in the Hero Preview Radar with solid high-confidence bands (`84%` overall confidence).
- **Low Confidence**: Clicking the `"Low Confidence (Hatched)"` preview tab on the hero card switches the live radar to `noisy-low-confidence` (Salma), highlighting the diagonal SVG hatching and preliminary range badge.
- **Partial**: Clicking `"Partial Profile"` shows how an unassessed dimension (`scorePct: null`) renders cleanly on the preview radar and table.
- **Loading**: Skeleton shimmer state for the preview card (`aria-busy="true"`).
- **Empty (`new-user`)**:Selecting the `"Nour · New Student (0 Trials)"` persona shows the zero-data baseline prompt.
- **Error**: Simulated profile fetch error card with 1-click `"Retry Preview"` recovery.
- **Offline & LLM-Down**: Respects global `<AppShell />` banners and adds a local notice that baseline tasks and deterministic personas work 100% offline.

---

## Interactions and motion (with the reduced-motion variant)
- **Hero Preview Persona Switcher**: Instant tab switch between *Calibrated (`steady-improver`)*, *Low-Confidence Hatched (`noisy-low-confidence`)*, and *Partial (`edge-missing-dim`)* right inside the hero card so evaluators see epistemic uncertainty in 1 click without leaving `/`.
- **1-Click Persona Teleport Cards**: Clicking any of the 3 persona cards at the bottom updates `useAppStore.activePersona` and navigates directly to the target route (`/onboarding` for New User, `/dashboard` for Steady Improver and Noisy Low-Confidence; until `/onboarding` and `/dashboard` are built in the next steps, displays a clear confirmation toast/banner with the active persona loaded).
- **Tactile Motion**: Buttons depress `translateY(2px)` on `:active` over `--duration-fast` (`120ms`); disabled under `prefers-reduced-motion: reduce` or `data-reduced-motion="true"`.
- **Mascot Note**: Per Section 7, the Mascot Sprint starts *after* Design Direction is locked and the Dashboard exists—so on Welcome we reserve a clean semantic slot (`data-mascot-slot="welcome-hero"`) with a friendly non-clinical greeting badge that upgrades to `<Mascot state="hello" />` during the Mascot Sprint.

---

## Data contract (types) and the mock fixtures used
- **Types (`frontend/src/contracts/`)**:
  - `DimensionConfig[]` from `getDimensionsByPreset(dimensionPreset)` (`3 | 6 | 7 | 8 | 10` dimensions).
  - `DimensionEstimate[]` from `buildEstimatesForDimensions(dimensions, activePersona)`.
  - `CollaborationScorePayload` (`SAMPLE_COLLABORATION_SCORE`) for the Pillar 4 preview badge (`82 ± 4`).
  - `WhyThisTrail` (`SAMPLE_WHY_THIS_TRAIL`) embedded inside the Hero Preview card.

---

## Accessibility notes: focus order, labels, chart table alternative
- **Heading Hierarchy**: Single `<h1>` (`Meet your evolving cognitive twin...`), `<h2>` for *Live Brain Twin Preview*, *The 4 Challenge Pillars*, and *Instant Judge & Demo Persona Launcher*, `<h3>` for individual pillar and persona cards.
- **Focus Order**: Skip link $\rightarrow$ Global header controls $\rightarrow$ Primary CTA (`Start 2-Minute Baseline`) $\rightarrow$ Secondary CTA (`Explore Judge Personas`) $\rightarrow$ Hero Preview tabs & `"View as Table"` toggle $\rightarrow$ 4 Pillar cards $\rightarrow$ 3 Persona launcher buttons.
- **Touch Targets**: All CTAs, preview tabs, and persona launcher buttons enforce `min-h-11` (`44px`).
- **Chart Table Alternative**: Hero `<UncertaintyRadar />` includes the 1-click `"View as Table"` button.

---

## Acceptance checklist (from the Definition of Done)
- [ ] Matches this approved spec; any deviation logged in `DECISIONS.md`.
- [ ] Only design tokens used (`npm run lint:tokens` exits 0).
- [ ] All states (ready, low-confidence hatched, partial, loading, empty, error, offline, extreme text) implemented and screenshotted.
- [ ] Contrast computed via `check-contrast.mjs` ($\ge 4.5:1$ text, $\ge 3.0:1$ UI/marks).
- [ ] Complete keyboard navigation, `3px` focus ring, logical tab order, $\ge 44\text{ px}$ targets.
- [ ] Reduced motion respected.
- [ ] Color never carries meaning alone (vertex shapes + glyph badges + table toggle).
- [ ] Copy passes `npm run lint:copy` with zero clinical or guilt terms.
- [ ] Zero CLS, zero horizontal scroll at `375 px`, survives `200%` zoom.
- [ ] Code-split route (`React.lazy`).
- [ ] Unit/component tests + Playwright axe-core check (`0` violations).
- [ ] Works seamlessly with 3, 6, 7, 8, and 10 dimensions.
- [ ] Docs, screenshots, `STATE.md` and commit are done.

---

## Decisions and known issues
- **Decisions**: Reserve `data-mascot-slot="welcome-hero"` on Page 01 until Page 06 (Dashboard) is built, honoring Section 7 (*"Start it only after the design direction is locked and the dashboard exists"*).
- **Known Issues**: None.

---

## Screenshots (paths) and commit hashes
- `docs/ui/screenshots/01-welcome-1440.png` *(Pending Step 7 Visual QA)*
- `docs/ui/screenshots/01-welcome-768.png` *(Pending Step 7 Visual QA)*
- `docs/ui/screenshots/01-welcome-375.png` *(Pending Step 7 Visual QA)*
