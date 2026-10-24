# UI Changelog (`docs/ui/CHANGELOG.md`)

All notable UI, UX, design system, and documentation changes on `ui/main` follow Conventional Commits.

## [Unreleased] — Sprint Day 1 (2026-10-24)
### Added
- `docs/ui/pages/02-onboarding.md`: Complete 11-section page specification for Page 02 (`Onboarding & Consent`, route `/onboarding`) ready for Gate 1 review.
- `frontend/src/pages/WelcomePage.tsx`: Implemented and merged Page 01 (`Welcome` · HERO) into `ui/main` (`a4c1646`), featuring the 7:5 asymmetric split hero, live interactive `<UncertaintyRadar />` + `<WhyThisPanel />` with 7-state preview switcher, Live Engine & Telemetry Contract Architecture strip (`QUEST+ / 85%`, `SAT-JEPA Δc`, `95% ±CI Bands`, `0 Biometrics`), 4-Pillar challenge overview, and 1-click 3-Persona Demo Launcher (*Youssef*, *Salma*, *Nour*).
- `frontend/e2e/welcome.spec.ts` & `docs/ui/screenshots/01-welcome-*.png`: Added Playwright visual QA + `@axe-core/playwright` accessibility verification across `375px`, `768px`, and `1440px` viewports in both Playful Lab (Light) and Night Lab (Dark) themes.

### Fixed
- `frontend/src/styles/tokens.css`: Resolved circular `@theme` CSS variable self-reference in Tailwind CSS v4 and layered base/component rules under `@layer base` and `@layer components` so utility classes cascade deterministically.

## [`ui-m1-design-system`] — 2026-10-24
### Added
- `frontend/`: Complete React 18 + TypeScript (strict) + Tailwind CSS + OKLCH `tokens.css` foundation, `DimensionRegistry` (3/6/7/8/10 dimensions), `<UncertaintyRadar />`, `<WhyThisPanel />`, and automated QA scripts (`lint:tokens`, `lint:copy`, `check:contrast`).
- `frontend/src/pages/DesignSystemPage.tsx` & `docs/ui/screenshots/18-design-system-*.png`: Implemented and verified Page 18 (`/design-system`) across 375, 768, and 1440 px viewports with 0 `axe-core` violations.
- `docs/ui/02-design-system.md`: Locked **Playful Lab** + **Night Lab** OKLCH token specification, computed WCAG 2.1 contrast table, and 3-to-10 dimension Okabe-Ito colorblind-safe palette (`DEC-006`).
- `docs/ui/pages/18-design-system.md`: Complete 11-section page specification for Page 18 (`/design-system`).
- `docs/ui/README.md`, `00-context.md`, `01-ux-strategy.md`, `contracts.md`, `DECISIONS.md`, `direction-sprint.html`, `STATE.md`, `QA-log.md`, `ASSETS.md`, `JUDGES-UI.md`.
