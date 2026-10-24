# UI Changelog (`docs/ui/CHANGELOG.md`)

All notable UI, UX, design system, and documentation changes on `ui/main` follow Conventional Commits.

## [Unreleased] — Sprint Day 1 (2026-10-24)
### Added
- `frontend/src/pages/TaskRunnerPage.tsx` & `frontend/e2e/taskRunner.spec.ts`: Implemented Page 04 (`Task Runner · HERO`, route `/task/:dimId`) with 4-trial psychometric stimuli across all task schemas, Zero-Distraction Lock (`<Mascot />` auto-hide during timed trials), Tab-Blur / `visibilitychange` Auto-Pause Guard, live `POST /v1/telemetry/event` JSON stream, and 5 verification screenshots in `docs/ui/screenshots/04-task-runner-*.png`.
- `docs/ui/pages/04-task-runner.md`: Complete 11-section page specification for Page 04 (`Task Runner · HERO`, route `/task/:dimId`).
- `frontend/src/pages/AssessmentHubPage.tsx` & `frontend/e2e/assessmentHub.spec.ts`: Implemented and merged Page 03 (`Assessment Hub`, route `/assessment`) into `ui/main` (`2ab8f50`).
- `docs/ui/pages/03-assessment-hub.md`: Complete 11-section page specification for Page 03 (`Assessment Hub`, route `/assessment`).
- `frontend/src/pages/ProfileRevealPage.tsx`, `frontend/src/components/signature/Mascot.tsx` (Signature #8), and `frontend/e2e/profileReveal.spec.ts`: Implemented and merged Page 05 (`Profile Reveal · HERO`, route `/profile-reveal`) and `<Mascot />` into `ui/main` (`fdb1ff9`).
- `docs/ui/pages/05-profile-reveal.md`: Complete 11-section page specification for Page 05 (`Profile Reveal · HERO`, route `/profile-reveal`) and the Mascot Sprint (`<Mascot />` Signature #8).
- `frontend/src/pages/DashboardPage.tsx`, `frontend/src/components/signature/ProjectionFanChart.tsx` (Signature #4), `frontend/src/components/signature/FatigueHeatmap.tsx`, and `frontend/e2e/dashboard.spec.ts`: Implemented and merged Page 06 (`Dashboard · HERO`, route `/dashboard`) into `ui/main` (`6612867`).
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
