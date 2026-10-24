# UI Changelog (`docs/ui/CHANGELOG.md`)

All notable UI, UX, design system, and documentation changes on `ui/main` follow Conventional Commits.

## [Unreleased] — Sprint Day 1 (2026-10-24)
### Added
- `frontend/src/pages/DashboardPage.tsx`, `frontend/src/components/signature/ProjectionFanChart.tsx` (Signature #4), `frontend/src/components/signature/FatigueHeatmap.tsx`, and `frontend/e2e/dashboard.spec.ts`: Implemented and verified Page 06 (`Dashboard · HERO`, route `/dashboard`) with 5 verification screenshots (`docs/ui/screenshots/06-dashboard-*.png`).
- `docs/ui/pages/06-dashboard.md`: Complete 11-section page specification for Page 06 (`Dashboard · HERO`, route `/dashboard`).
- `frontend/src/pages/OnboardingPage.tsx` & `frontend/e2e/onboarding.spec.ts`: Implemented and merged Page 02 (`Onboarding & Consent`, route `/onboarding`) into `ui/main` (`763968b`).
- `frontend/src/pages/WelcomePage.tsx`: Implemented and merged Page 01 (`Welcome` · HERO) into `ui/main` (`a4c1646`).

### Fixed
- `frontend/src/components/ui/Badge.tsx` & `frontend/src/components/layout/AppShell.tsx`: Added responsive wrapping support (`whitespace-normal max-w-full`) for long dimension badges and mobile header badges at `375px`.
- `frontend/src/styles/tokens.css`: Resolved circular `@theme` CSS variable self-reference in Tailwind CSS v4 and layered base/component rules under `@layer base` and `@layer components`.

## [`ui-m1-design-system`] — 2026-10-24
### Added
- `frontend/`: Complete React 18 + TypeScript (strict) + Tailwind CSS + OKLCH `tokens.css` foundation, `DimensionRegistry` (3/6/7/8/10 dimensions), `<UncertaintyRadar />`, `<WhyThisPanel />`, and automated QA scripts (`lint:tokens`, `lint:copy`, `check:contrast`).
- `frontend/src/pages/DesignSystemPage.tsx` & `docs/ui/screenshots/18-design-system-*.png`: Implemented and verified Page 18 (`/design-system`) across 375, 768, and 1440 px viewports with 0 `axe-core` violations.
- `docs/ui/02-design-system.md`: Locked **Playful Lab** + **Night Lab** OKLCH token specification, computed WCAG 2.1 contrast table, and 3-to-10 dimension Okabe-Ito colorblind-safe palette (`DEC-006`).
- `docs/ui/pages/18-design-system.md`: Complete 11-section page specification for Page 18 (`/design-system`).
- `docs/ui/README.md`, `00-context.md`, `01-ux-strategy.md`, `contracts.md`, `DECISIONS.md`, `direction-sprint.html`, `STATE.md`, `QA-log.md`, `ASSETS.md`, `JUDGES-UI.md`.
