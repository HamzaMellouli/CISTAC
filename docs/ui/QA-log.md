# Quality Assurance & Verification Log (`docs/ui/QA-log.md`)

Every automated check and manual critique round is logged here with computed numbers.

## 1. Design Direction Sprint — Computed WCAG 2.1 Contrast Verification (2026-10-24)

| Direction | Foreground Token | Background Token | Computed Ratio | WCAG AA Requirement | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Playful Lab (Light)** | `ink` (`#1F1B3B`) | `canvas` (`#FFF8EE`) | **15.61 : 1** | $\ge 4.5 : 1$ (Body text) | PASS (AAA) |
| **Playful Lab (Light)** | `ink` (`#1F1B3B`) | `surface` (`#FFFFFF`) | **16.92 : 1** | $\ge 4.5 : 1$ (Body text) | PASS (AAA) |
| **Playful Lab (Light)** | `ink-muted` (`#5B5675`) | `canvas` (`#FFF8EE`) | **6.62 : 1** | $\ge 4.5 : 1$ (Body text) | PASS (AA) |
| **Playful Lab (Light)** | `surface` (`#FFFFFF`) | `brand` (`#0F766E`) | **5.48 : 1** | $\ge 4.5 : 1$ (Button text) | PASS (AA) |
| **Playful Lab (Light)** | `ink` (`#1F1B3B`) | `reward` (`#FFC83D`) | **10.64 : 1** | $\ge 4.5 : 1$ (Badge text) | PASS (AAA) |
| **Playful Lab (Light)** | `ink` (`#1F1B3B`) | `accent-coral` (`#FF6B6B`) | **5.89 : 1** | $\ge 4.5 : 1$ (Text on fill) | PASS (AA) |
| **Playful Lab (Light)** | `surface` (`#FFFFFF`) | `danger` (`#C62828`) | **5.62 : 1** | $\ge 4.5 : 1$ (Alert text) | PASS (AA) |
| **Playful Lab (Light)** | `surface` (`#FFFFFF`) | `success` (`#15803D`) | **5.02 : 1** | $\ge 4.5 : 1$ (Badge text) | PASS (AA) |
| **Playful Lab (Light)** | `surface` (`#FFFFFF`) | `info` (`#0369A1`) | **5.88 : 1** | $\ge 4.5 : 1$ (Badge text) | PASS (AA) |
| **Playful Lab (Light)** | `border-strong` (`#8C86A0`) | `canvas` (`#FFF8EE`) | **3.31 : 1** | $\ge 3.0 : 1$ (UI boundary) | PASS (AA) |
| **Calm Clarity (Light)** | `ink` (`#0F172A`) | `canvas` (`#F6F8FB`) | **16.80 : 1** | $\ge 4.5 : 1$ (Body text) | PASS (AAA) |
| **Calm Clarity (Light)** | `surface` (`#FFFFFF`) | `brand` (`#2F55D4`) | **6.21 : 1** | $\ge 4.5 : 1$ (Button text) | PASS (AA) |
| **Night Lab (Dark)** | `ink` (`#E8ECFF`) | `canvas` (`#0B1020`) | **16.12 : 1** | $\ge 4.5 : 1$ (Body text) | PASS (AAA) |
| **Night Lab (Dark)** | `canvas` (`#0B1020`) | `brand-cyan` (`#22D3EE`) | **10.51 : 1** | $\ge 4.5 : 1$ (Button text) | PASS (AAA) |

## 2. Okabe-Ito Adapted Dimension Palette Contrast on `#FFF8EE` (Light Canvas)
All 7 primary dimension strokes/markers are darkened from raw Okabe-Ito where needed so every graphical mark achieves $\ge 3.0 : 1$ on `#FFF8EE` **and** uses a unique geometric vertex glyph:

| Slot | Dimension Role | Raw Okabe-Ito | Adapted Light Token | Contrast on `#FFF8EE` | Vertex Marker Shape |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 1 | Working Memory (`WM`) | `#0072B2` | `#0072B2` | **4.92 : 1** | Circle (`●`) |
| 2 | Inhibition Control (`IC`) | `#D55E00` | `#C45100` | **4.24 : 1** | Square (`■`) |
| 3 | Cognitive Flexibility (`CF`) | `#009E73` | `#008662` | **4.15 : 1** | Triangle (`▲`) |
| 4 | Attention Networks (`AN`) | `#CC79A7` | `#9E4778` | **4.81 : 1** | Diamond (`◆`) |
| 5 | Divided Perceptual Speed (`PS`) | `#E69F00` | `#A86E00` | **3.94 : 1** | Pentagon (`⬠`) |
| 6 | Episodic Pattern Separation (`EP`) | `#56B4E9` | `#0B76A8` | **4.63 : 1** | Hexagon (`⬢`) |
| 7 | Visuospatial Planning & $G_f$ (`VP`) | `#F0E442` | `#7D7300` (stroke) / `#F0E442` (fill) | **4.61 : 1** | Star (`★`) |
| 8–10 | Extra / Surprise Dimensions | — | High-contrast stroke + dash/hatch | **$\ge 4.50 : 1$** | Cross (`✚`), Ring (`◎`), Hourglass (`⧗`) |

---

## 3. Page 18 (`/design-system`) Automated QA & Critique Log (2026-10-24)

- **`npm run lint:tokens`**: `PASS` — 0 hardcoded hex colors, rgb/hsl functions, arbitrary spacing, or raw durations outside `src/styles/`.
- **`npm run lint:copy`**: `PASS` — 0 clinical diagnostic or punitive guilt phrases in UI copy or mock fixtures.
- **`npm run check:contrast`**: `PASS` — 21/21 Light & Dark semantic and Okabe-Ito dimension pairs pass WCAG 2.1 thresholds.
- **`npm test` (Vitest)**: `PASS` — 4/4 unit & component tests passing (`designSystem.test.tsx`).
- **`npm run build` (`tsc -b && vite build`)**: `PASS` — 0 TypeScript errors; `DesignSystemPage` code-split at `32.30 kB` (`8.44 kB` gzipped).
- **`npm run qa:e2e` (Playwright + `@axe-core/playwright`)**: `PASS` — 0 `axe-core` violations in Light and Dark themes; 0 horizontal overflow at `375 px`, `768 px`, and `1440 px`; 6 verification screenshots saved to `docs/ui/screenshots/`.

---

## 4. Page 01 (`/` · `Welcome` HERO) Automated QA & Critique Log (2026-10-24)

- **`npm run lint:tokens`**: `PASS` — 100% design tokens used across `WelcomePage.tsx`, `AppShell.tsx`, and `Badge.tsx`.
- **`npm run lint:copy`**: `PASS` — 0 clinical or guilt terms in Welcome hero, 4-pillar cards, or 3-persona launcher fixtures.
- **`npm run check:contrast`**: `PASS` — 21/21 Light & Dark token pairs pass WCAG 2.1 AA/AAA thresholds.
- **`npm test` (Vitest)**: `PASS` — 5/5 tests pass in `src/tests/designSystem.test.tsx`.
- **`npm run build` (`tsc -b && vite build`)**: `PASS` — `WelcomePage` route chunk is `16.12 kB` (`5.09 kB` gzipped).
- **`npx playwright test e2e/welcome.spec.ts`**: `PASS` — 0 `axe-core` violations in Playful Lab (Light) and Night Lab (Dark); 0 horizontal overflow at `375 px`, `768 px`, and `1440 px`; 5 verification screenshots saved to `docs/ui/screenshots/01-welcome-*.png`.

---

## 5. Page 02 (`/onboarding` · `Onboarding & Consent`) Automated QA & Critique Log (2026-10-24)

- **`npm run lint:tokens`**: `PASS` — 100% design tokens used across `OnboardingPage.tsx` and `useAppStore.ts`.
- **`npm run lint:copy`**: `PASS` — 0 clinical or guilt terms across all 3 onboarding steps and validation banners.
- **`npm run check:contrast`**: `PASS` — 21/21 Light & Dark token pairs pass WCAG 2.1 AA/AAA thresholds.
- **`npm test` (Vitest)**: `PASS` — 6/6 unit & component tests pass (`src/tests/designSystem.test.tsx`).
- **`npm run build` (`tsc -b && vite build`)**: `PASS` — `OnboardingPage` route chunk is `25.37 kB` (`6.77 kB` gzipped).
- **`npx playwright test e2e/onboarding.spec.ts`**: `PASS` — 0 `axe-core` violations across Step Wizard, All-Steps Expanded, 10-Dimension Stress Mode, and Dark Theme; 0 horizontal overflow at `375 px`, `768 px`, and `1440 px`; 5 verification screenshots saved to `docs/ui/screenshots/02-onboarding-*.png`.
- **Critique Round 1 (Picky Designer)**: Added the **Active Calibration Blueprint** summary box in Step 1 to balance the 8:4 desktop columns, and updated `Badge.tsx` + `<pre>` wrapping so long dimension names and JSON lines wrap cleanly at `375 px`.
- **Critique Round 2 (Hostile Juror)**: Added explicit **Bound Backend Contracts** (`POST /v1/telemetry/event`, `GET /v1/tasks/next`, `DELETE /v1/user/telemetry`) below the live JSON payload inspector.


---

## 6. Page 06 (`/dashboard` · `Dashboard` HERO) Automated QA & Critique Log (2026-10-24)

- **`npm run lint:tokens`**: `PASS` — 100% design tokens used across `DashboardPage.tsx`, `ProjectionFanChart.tsx`, and `FatigueHeatmap.tsx`.
- **`npm run lint:copy`**: `PASS` — 0 clinical or guilt terms across all dashboard cards, trajectory fan legends, fatigue windows, and state recovery banners.
- **`npm run check:contrast`**: `PASS` — 21/21 Light & Dark token pairs pass WCAG 2.1 AA/AAA thresholds.
- **`npm test` (Vitest)**: `PASS` — 7/7 unit & component tests pass (`src/tests/designSystem.test.tsx`).
- **`npm run build` (`tsc -b && vite build`)**: `PASS` — `DashboardPage` route chunk is `26.20 kB` (`7.20 kB` gzipped).
- **`npx playwright test e2e/dashboard.spec.ts`**: `PASS` — 0 `axe-core` violations across Light (`Playful Lab`), Dark (`Night Lab`), Partial (`edge-missing-dim` with table toggles open), and 10-Dimension Stress Mode; 0 horizontal overflow at `375 px`, `768 px`, and `1440 px`; 5 verification screenshots saved to `docs/ui/screenshots/06-dashboard-*.png`.
- **Critique Round 1 (Picky Designer)**: Added the **SAT-JEPA Latent Twin State & Hysteresis** card in Row 1 so the 5-column left stack and 7-column right stack align cleanly at the bottom edge on `1440 px`, and updated `Badge.tsx` (`max-w-full whitespace-normal sm:whitespace-nowrap`) so long badges wrap inside `375 px` mobile cards without clipping.
- **Critique Round 2 (Hostile Juror)**: Verified accessible table toggles on all 3 visualizations (`<UncertaintyRadar />`, `<ProjectionFanChart />`, `<FatigueHeatmap />`) and explicit `"Design proposal, not validated"` badge + weighted formula printout on the 0–100 Collaboration Score card.


---

## 7. Page 05 (`/profile-reveal` · `Profile Reveal` HERO) + Mascot Sprint Automated QA & Critique Log (2026-10-24)

- **`npm run lint:tokens`**: `PASS` — 100% design tokens used across `ProfileRevealPage.tsx` and `Mascot.tsx`.
- **`npm run lint:copy`**: `PASS` — 0 clinical or guilt terms across all archetype discovery cards, Mascot messages, and dimension reveal strips.
- **`npm run check:contrast`**: `PASS` — 21/21 Light & Dark token pairs pass WCAG 2.1 AA/AAA thresholds.
- **`npm test` (Vitest)**: `PASS` — 8/8 unit & component tests pass (`src/tests/designSystem.test.tsx`).
- **`npm run build` (`tsc -b && vite build`)**: `PASS` — `ProfileRevealPage` route chunk is `20.28 kB` (`5.77 kB` gzipped) and `Mascot` chunk is `5.05 kB` (`1.67 kB` gzipped, well under the `15 kB` SVG budget).
- **`npx playwright test e2e/profileReveal.spec.ts`**: `PASS` — 0 `axe-core` violations across Light (`Playful Lab`), Dark (`Night Lab`), and 10-Dimension Hatched Stress Mode; 0 horizontal overflow at `375 px`, `768 px`, and `1440 px`; 5 verification screenshots saved to `docs/ui/screenshots/05-profile-reveal-*.png`.
- **Critique Round 1 (Picky Designer)**: Added the **Baseline Psychometric Convergence** card (`QUEST+ 85% Staircase`) to the right 5-column stack so the 7:5 desktop columns align cleanly at the bottom edge.
- **Critique Round 2 (Hostile Juror)**: Added `tabIndex={0}`, `role="region"`, and `aria-label="Snapshot provenance JSON payload"` on the scrollable `<pre>` snapshot inspector and verified SAT-JEPA hysteresis lock indicators (`1 / 3` vs `3 / 3` sessions).


---

## 8. Page 03 (`/assessment` · `Assessment Hub`) Automated QA & Critique Log (2026-10-24)

- **`npm run lint:tokens`**: `PASS` — 100% design tokens used across `AssessmentHubPage.tsx`.
- **`npm run lint:copy`**: `PASS` — 0 clinical or guilt terms across all task descriptions, staircase levels, and bias notes.
- **`npm run check:contrast`**: `PASS` — 21/21 Light & Dark token pairs pass WCAG 2.1 AA/AAA thresholds.
- **`npm test` (Vitest)**: `PASS` — 9/9 unit & component tests pass (`src/tests/designSystem.test.tsx`).
- **`npm run build` (`tsc -b && vite build`)**: `PASS` — `AssessmentHubPage` route chunk is `23.30 kB` (`6.39 kB` gzipped).
- **`npx playwright test e2e/assessmentHub.spec.ts`**: `PASS` — 0 `axe-core` violations across Light (`Playful Lab`), Dark (`Night Lab`), and 10-Dimension Table View; 0 horizontal overflow at `375 px`, `768 px`, and `1440 px`; 5 verification screenshots saved to `docs/ui/screenshots/03-assessment-hub-*.png`.
- **Critique Round 1 (Picky Designer)**: Added explicit `GET /v1/tasks/next` and `POST /v1/telemetry/event` contract summary boxes inside the **Scheduler & Telemetry Contracts** card so the 7:5 desktop columns align cleanly at the bottom edge.
- **Critique Round 2 (Hostile Juror)**: Verified the 1-click **"View Task Queue as Table"** semantic `<table>` toggle and explicit **Known Measurement Biases** per dimension.
