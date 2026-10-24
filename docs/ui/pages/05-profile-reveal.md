# 05. Profile Reveal (`/profile-reveal`) · HERO PAGE (+ Mascot Sprint)

## Purpose, user moment, rubric criteria
- **Purpose**: The high-emotion, zero-judgment **"Aha!" moment** immediately after a learner completes their 2-minute Quick Baseline (or after an evaluator clicks **"Inspect Profile Reveal"**). It reveals the learner's initial **Cognitive Brain Twin** with honest $\pm\text{CI}$ bands, their **SAT-JEPA Archetype Discovery Card** (with hysteresis explanation), their **Top 2 Calibrated Strengths** vs **Top 1 Calibration Opportunity** (hatched low-confidence dimension), **Signature Component #8 (`<Mascot />`)**, and their **First Explainable AI Coach Micro-Step** (`<WhyThisPanel />`).
- **User / Evaluator Moment**: Reached within $\le 3\text{ minutes}$ of opening the app. Turns raw behavioral telemetry into an empowering, non-clinical narrative before transitioning into the full `/dashboard`.
- **Rubric Criteria Served**:
  - **UX & First Insight in $\le 3\text{ Min}$ (Phase 1 — 9%)**: Delivers an immediate, motivating cognitive twin synthesis with zero diagnostic anxiety.
  - **Innovation & Profile Quality (Phase 1 — 12% & Phase 2 — 8%)**: Features **Signature #8 (`<Mascot />` 5-state SVG companion)**, **Signature #1 (`<UncertaintyRadar />`)**, **Signature #3 (`<WhyThisPanel />`)**, and explicit **SAT-JEPA Prototype Differential Vector ($\Delta c$) + Hysteresis Lock** visualization.
  - **Generalisation (Phase 2 — 10%)**: Dynamically computes top calibrated strengths, hatched calibration target, and dimension breakdown for `3 | 6 | 7 | 8 | 10` dimensions.
- **Time Budget**: `3 hours` (+50% alert threshold: `4.5 hours`).

---

## Wireframes: desktop, mobile

### Desktop (`1440 px` — 12-Column Celebration & Synthesis Grid)
```text
+--------------------------------------------------------------------------------------------------+
| [ST] SynapseTwin · CISTAC 1.0     [Simulated Data]    [3|6|7|10 Dims] [Dark/Light] [Style Guide] |
+--------------------------------------------------------------------------------------------------+
| REVEAL STAGE HEADER + PERSONA / STATE SWITCHER + MASCOT TOGGLE                                   |
| [★ Brain Twin Snapshot #1 Unlocked] [Non-Clinical · 95% CI Bands] [Show Mascot: ON/OFF]          |
| [Persona: Calibrated Reveal | First-Session Hatched | Partial | Empty | Loading | Error]         |
+-------------------------------------------------------+------------------------------------------+
| LEFT (7 cols): ARCHETYPE REVEAL + MASCOT COMPANION    | RIGHT (5 cols): INITIAL TWIN RADAR       |
| +---------------------------------------------------+ | +--------------------------------------+ |
| | [<Mascot state="celebrate" />]                    | | | Initial Cognitive Twin Radar         | |
| | ARCHETYPE DISCOVERED · SAT-JEPA CLUSTER C5        | | | [Hatched = Conf < 60%] [View Table]  | |
| | "Analytical Pattern Builder"                      | | |                                      | |
| | Prototype Δc: +0.18 · Hysteresis: 3/3 Confirm     | | |         ( Uncertainty Radar )        | |
| |                                                   | | |     ● WM 68%±5%      ■ IC 75%±6%     | |
| | +-----------------------+ +---------------------+ | | |     ⬢ EP 81%±16% (Hatched)           | |
| | | TOP CALIBRATED ANCHOR | | NEXT TO CALIBRATE   | | | |                                      | |
| | | ◆ Attention (89% ±5%) | | ⬢ Episodic (81%±16%)| | | +--------------------------------------+ |
| | | Solid 84% Confidence  | | ▨ Hatched (48% Conf)| | |                                          |
| | +-----------------------+ +---------------------+ | | +--------------------------------------+ |
| +---------------------------------------------------+ | | Snapshot Provenance & Confidence     | |
|                                                       | | • Trials Logged: 162  • Jitter: 64ms | |
| +---------------------------------------------------+ | | • Receipt: CONSENT-ST-2026-8F4A      | |
| | YOUR FIRST EXPLAINABLE MICRO-STEP (<WhyThisPanel>)| | +--------------------------------------+ |
| | 5-Part Reasoning Trail + Counterfactual Guarantee | |                                          |
| +---------------------------------------------------+ |                                          |
+-------------------------------------------------------+------------------------------------------+
| BOTTOM ROW: DIMENSION-BY-DIMENSION REVEAL STRIP (Adapts to 3 / 6 / 7 / 8 / 10 Dimensions)        |
| [● WM 68%±5%] [■ IC 75%±6%] [▲ CF 82%±7%] [◆ AN 89%±5%] [⬠ PS 74%±6%] [⬢ EP 81%±16% ▨] [★ VP]   |
|                                                                                                  |
| [ → Open Full Command Dashboard (/dashboard) ]  [ Calibrate Hatched Dimension ]  [ Export JSON ] |
+--------------------------------------------------------------------------------------------------+
```

### Mobile (`375 px` — Single-Column Reveal Flow)
```text
+---------------------------------------+
| [ST] SynapseTwin   [7 Dims] [Theme]   |
+---------------------------------------+
| REVEAL HEADER & PERSONA SWITCHER      |
+---------------------------------------+
| 1. ARCHETYPE & MASCOT REVEAL CARD     |
|    (<Mascot /> + Strengths vs Hatched)|
+---------------------------------------+
| 2. INITIAL UNCERTAINTY RADAR          |
|    (+ "View as Table" Toggle)         |
+---------------------------------------+
| 3. FIRST EXPLAINABLE COACH STEP       |
|    (<WhyThisPanel /> 5-Part Trail)    |
+---------------------------------------+
| 4. DIMENSION REVEAL CARDS (3–10 Dims) |
+---------------------------------------+
| 5. PRIMARY CTA: OPEN DASHBOARD        |
+---------------------------------------+
```

---

## Content and copy deck
- **Hero Eyebrow**: `★ Brain Twin Snapshot Unlocked · Non-Clinical Cognitive Synthesis`
- **Hero Headline (`<h1>`)**: `Meet your initial Cognitive Twin—calibrated strengths, honest confidence bands, and your first 2-minute next step.`
- **Hero Subcopy**: `Your scores are not fixed labels or IQ tests. Solid bands show dimensions where your response timing is already consistent; diagonally hatched bands simply need 1–2 more micro-blocks to narrow their ±CI range.`
- **Archetype Discovery Copy**:
  - Calibrated (`steady-improver`): `Analytical Pattern Builder (Cluster C5)` — *"Fast rule-switching and steady working-memory updating across dual-stream blocks."*
  - Preliminary Hatched (`noisy-low-confidence`): `Exploratory Fast-Responder (Provisional Cluster C2 · Hatched)` — *"Brisk initial reaction speed with wide confidence intervals (±16%) that will narrow after a rested morning session."*
- **Signature #8 `<Mascot />` States (Mascot Sprint)**:
  - `idle`: Gentle floating synaptic prism with calm breathing pulse (`prefers-reduced-motion` static).
  - `hello`: Warm wave gesture used on `WelcomePage` (`/`).
  - `thinking`: Orbiting telemetry nodes used during baseline synthesis and partial calibration states.
  - `celebrate`: Warm gold reward spark (`#FFC83D`) used on `ProfileRevealPage` (`/profile-reveal`) and calibrated `DashboardPage` (`/dashboard`).
  - `rest`: Soft teal crescent + calm horizontal posture used when evening fatigue or high jitter is detected (`noisy-low-confidence`).

---

## States: loading, empty, partial, error, offline, low confidence
- **Calibrated Reveal (`steady-improver`)**: Shows confirmed archetype (`Cluster C5`), 6 solid dimensions + 1 hatched dimension (`EP`), and `<Mascot state="celebrate" />`.
- **First-Session Low-Confidence Reveal (`noisy-low-confidence`)**: Shows provisional hatched archetype (`Provisional Cluster C2`), 4 hatched dimensions (`< 60%` confidence), and `<Mascot state="rest" />` with rest-first guidance.
- **Partial Reveal (`edge-missing-dim`)**: Highlights that Divided Perceptual Speed (`PS`) has `0` trials (`Unassessed — 90s block remaining`) with `<Mascot state="thinking" />`.
- **Empty State (`new-user`)**: Prompts the learner to complete the 2-minute baseline first or load a sample reveal snapshot.
- **Loading (`loading`)**: Accessible synthesis skeleton (`role="status"`, `aria-label="Synthesizing cognitive twin reveal"`).
- **Error (`error`)**: Simulated snapshot synthesis timeout (`role="alert"`) with 1-click retry.
- **Extreme Values (`extreme-text`)**: Stress-tests `99.9% ± 0.1%` and `10` dimensions at `375 px` with zero horizontal scroll.

---

## Interactions and motion (with the reduced-motion variant)
- **Interactive Mascot State Switcher & Global Toggle**: Users and evaluators can toggle `"Show Companion Guide"` (`showMascot` in `useAppStore`) or preview all 5 `<Mascot />` states (`idle`, `hello`, `thinking`, `celebrate`, `rest`).
- **Step-by-Step Reveal Tabs / Full View**: Allows inspecting the reveal all at once or filtering by `Calibrated Strengths (≥60% Conf)` vs `Hatched Calibration Targets (<60% Conf)`.
- **1-Click Snapshot JSON Inspector**: Expands the exact `TwinProfileSnapshot` JSON payload generated at reveal time.
- **Reduced Motion**: When `reducedMotion === true`, `<Mascot />` disables all CSS/SVG keyframe animations and renders crisp static SVG postures.

---

## Data contract (types) and the mock fixtures used
- **`DimensionConfig[]`** & **`DimensionEstimate[]`** from `getDimensionsByPreset(dimensionPreset)` and `buildEstimatesForDimensions(activeDimensions, activePersona)`.
- **`MascotState`**: `'idle' | 'hello' | 'thinking' | 'celebrate' | 'rest'` exported from `frontend/src/components/signature/Mascot.tsx`.
- **`WhyThisTrail`** (`SAMPLE_WHY_THIS_TRAIL`) & **`ConsentPreferences`** (`useAppStore`).

---

## Accessibility notes: focus order, labels, chart table alternative
- `<Mascot />` renders with `role="img"` and a descriptive `aria-label` when conveying state context, or `aria-hidden="true"` when paired with adjacent visible state text so screen readers never announce duplicate boilerplate.
- `<UncertaintyRadar />` includes its 1-click `"View as Table"` toggle.
- Every strength and calibration card pairs its Okabe-Ito color token with its unique geometric glyph (`●`, `■`, `▲`, `◆`, `⬠`, `⬢`, `★`, `✚`, `◎`, `⧗`) and explicit confidence badge (`Solid` vs `▨ Hatched`).

---

## Acceptance checklist (from the Definition of Done)
- [ ] Matches this approved spec; any deviation logged in `DECISIONS.md`.
- [ ] Only design tokens used (`npm run lint:tokens` exits 0).
- [ ] All states (`steady-improver`, `noisy-low-confidence`, `edge-missing-dim`, `new-user`, `loading`, `error`, `extreme-text`) implemented and screenshotted.
- [ ] Contrast computed via `check-contrast.mjs` ($\ge 4.5:1$ text, $\ge 3.0:1$ UI/marks).
- [ ] Complete keyboard navigation, `3px` focus ring, logical tab order, $\ge 44\text{ px}$ targets.
- [ ] Reduced motion respected (static SVG mascot + instant transitions).
- [ ] Color never carries meaning alone.
- [ ] Copy passes `npm run lint:copy` with zero clinical or guilt terms.
- [ ] Zero CLS, zero horizontal scroll at `375 px`, survives `200%` zoom.
- [ ] Code-split route (`React.lazy`).
- [ ] Unit/component tests + Playwright `axe-core` check (`0` violations).
- [ ] Works seamlessly with 3, 6, 7, 8, and 10 dimensions.
- [ ] Docs, screenshots, `STATE.md` and commit are done.

---

## Decisions and known issues
- **Decisions**: Build **Signature #8 (`<Mascot />`)** in `frontend/src/components/signature/Mascot.tsx` ($\le 15\text{ KB}$ inline SVG across all 5 states) and wire it into `ProfileRevealPage.tsx`, `WelcomePage.tsx`, `DashboardPage.tsx`, and `DesignSystemPage.tsx`.
- **Known Issues**: None.

---

## Screenshots (paths) and commit hashes
- `docs/ui/screenshots/05-profile-reveal-1440.png` *(Pending Step 7 Visual QA)*
- `docs/ui/screenshots/05-profile-reveal-768.png` *(Pending Step 7 Visual QA)*
- `docs/ui/screenshots/05-profile-reveal-375.png` *(Pending Step 7 Visual QA)*
