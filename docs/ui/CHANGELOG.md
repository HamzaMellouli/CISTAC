# UI Changelog (`docs/ui/CHANGELOG.md`)

All notable UI, UX, design system, and documentation changes on `ui/main` follow Conventional Commits.

## [Unreleased] — Sprint Day 1 (2026-10-24)
### Added
- `frontend/src/pages/OnboardingPage.tsx` & `frontend/e2e/onboarding.spec.ts`: Implemented and verified Page 02 (`Onboarding & Consent`, route `/onboarding`), featuring the 3-step progressive wizard (*Study Context*, *Granular Telemetry Consent & Non-Biometric Lock*, *30-Second Input Timer Check & Baseline Mode*), `View All 3 Steps` mode, 1-click `⚡ Judge Fast-Track` button, equal-prominence `Reject All Optional (Minimal Mode)` preset, and live `"What SynapseTwin Sees"` JSON payload inspector.
- `docs/ui/screenshots/02-onboarding-*.png`: Captured 5 full-page verification screenshots across `1440px`, `768px`, and `375px` viewports in Playful Lab (Light) and Night Lab (Dark) themes with `0` `axe-core` violations.
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
