# UI Changelog (`docs/ui/CHANGELOG.md`)

All notable UI, UX, design system, and documentation changes on `ui/main` follow Conventional Commits.

## [Unreleased] — Sprint Day 1 (2026-10-24)
### Added
- `frontend/`: Complete React 18 + TypeScript (strict) + Tailwind CSS + OKLCH `tokens.css` foundation, `DimensionRegistry` (3/6/7/8/10 dimensions), `<UncertaintyRadar />`, `<WhyThisPanel />`, and automated QA scripts (`lint:tokens`, `lint:copy`, `check:contrast`).
- `frontend/src/pages/DesignSystemPage.tsx` & `docs/ui/screenshots/18-design-system-*.png`: Implemented and verified Page 18 (`/design-system`) across 375, 768, and 1440 px viewports with 0 `axe-core` violations.
- `docs/ui/02-design-system.md`: Locked **Playful Lab** + **Night Lab** OKLCH token specification, computed WCAG 2.1 contrast table, and 3-to-10 dimension Okabe-Ito colorblind-safe palette (`DEC-006`).
- `docs/ui/pages/18-design-system.md`: Complete 11-section page specification for Page 18 (`/design-system`) ready for Gate 1 review.
- `docs/ui/README.md`: Documentation index and page spec registry.
- `docs/ui/00-context.md`: Challenge brief rules, dates, and rubric proof strategy.
- `docs/ui/contracts.md`: Full TypeScript contract specification bridging Member 1's `assessment_engine` (`TelemetryEvent`, `TaskPayload`) with Layers B & C (`BrainTwinProfile`, `WhyThisTrail`, `CollaborationScorePayload`).
- `docs/ui/DECISIONS.md`: Logged `DEC-001` through `DEC-005`.
- `docs/ui/direction-sprint.html`: Self-contained 3-tile Design Direction Sprint showcase (**Playful Lab**, **Calm Clarity**, **Night Lab**) with interactive typography pairing switcher, tactile button sets, explainable metric cards, and mini uncertainty radar with table toggle.
- `docs/ui/STATE.md`, `docs/ui/QA-log.md`, `docs/ui/ASSETS.md`, `docs/ui/JUDGES-UI.md`: Governance and verification logs initialized.
