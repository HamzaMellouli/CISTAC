# UI Changelog (`docs/ui/CHANGELOG.md`)

All notable UI, UX, design system, and documentation changes on `ui/main` follow Conventional Commits.

## [Unreleased] — Sprint Day 2 (2026-10-25)
### Added
- `frontend/src/components/goals/HabitContractCard.tsx`, `frontend/src/pages/GoalsPage.tsx`, `frontend/e2e/goals.spec.ts`, and `docs/ui/screenshots/11-goals-*.png`: Implemented Page 11 (`Goals & Habit Contracts`, route `/goals`) featuring Zero-Guilt Streak Protection banner (`18 Days Protected · 3 Rest Days Honored · Zero Penalty`), active habit contracts list with 4 status filters, interactive Goal Tuner & Bayesian Epistemic ETA Simulator ($\hat{\tau} \pm \sigma_{\tau}$) with dynamic credible interval recalculation, mathematical model card, accessible screen-reader table alternative, and integrated `<WhyThisPanel />` and companion `<Mascot />`.
- `docs/ui/pages/11-goals.md`: Complete 11-section page specification for Page 11 (`Goals & Habit Contracts`, route `/goals`).
- `frontend/src/components/signature/CollaborationScoreCard.tsx`, `frontend/src/pages/CollaborationScorePage.tsx`, `frontend/e2e/collaboration.spec.ts`, and `docs/ui/screenshots/12-collaboration-*.png`: Implemented Page 12 (`AI Collaboration Score Deep-Dive`, route `/collaboration`) featuring **Signature #5 `<CollaborationScoreCard />`**, mandatory `"Design proposal, not validated"` badge, dynamic archetype weighting ($w_i(s_t)$), interactive 5-action telemetry simulator, 6-week longitudinal growth curve with accessible table region, and 5 sub-dimension evidence audit trails.
- `docs/ui/pages/12-collaboration.md`: Complete 11-section page specification for Page 12 (`AI Collaboration Score`, route `/collaboration`).
- `frontend/src/pages/PlanPage.tsx`, `frontend/e2e/plan.spec.ts`, and `docs/ui/screenshots/10-plan-*.png`: Implemented and merged Page 10 (`Plan & Adaptive Exercises`, route `/plan`) into `ui/main` (`ea1bd66`).
- `docs/ui/pages/10-plan.md`: Complete 11-section page specification for Page 10 (`Plan & Adaptive Exercises`, route `/plan`).
- `frontend/src/pages/DimensionDetailPage.tsx`, `frontend/src/components/signature/ProjectionFanChart.tsx`, and `frontend/e2e/dimensionDetail.spec.ts`: Implemented and merged Page 07 (`Dimension Detail`, route `/dimensions/:dimId`) into `ui/main` (`d54f2ad`).
- `docs/ui/pages/07-dimension-detail.md`: Complete 11-section page specification for Page 07 (`Dimension Detail`, route `/dimensions/:dimId`).
- `frontend/src/pages/AiCoachPage.tsx`, `frontend/src/utils/copyLinter.ts`, and `frontend/e2e/aiCoach.spec.ts`: Implemented and merged Page 09 (`AI Coach · HERO`, route `/coach`) into `ui/main` (`9cbd702`).
- `docs/ui/pages/09-ai-coach.md`: Complete 11-section page specification for Page 09 (`AI Coach · HERO`, route `/coach`).
- `frontend/src/components/signature/BrainTwinTimeTravel.tsx`, `frontend/src/pages/BrainTwinPage.tsx`, and `frontend/e2e/brainTwin.spec.ts`: Implemented and merged Page 08 (`Brain Twin & Historical Timeline · HERO`, route `/brain-twin`) and Signature #2 `<BrainTwinTimeTravel />` into `ui/main` (`a256024`).
- `docs/ui/pages/08-brain-twin.md`: Complete 11-section page specification for Page 08 (`Brain Twin & Historical Timeline · HERO`, route `/brain-twin`) and Signature #2 `<BrainTwinTimeTravel />`.

## [`ui-m2-core-pages`] — 2026-10-24
### Added
- `frontend/src/pages/TaskRunnerPage.tsx` & `frontend/e2e/taskRunner.spec.ts`: Implemented and merged Page 04 (`Task Runner · HERO`, route `/task/:dimId`) into `ui/main` (`c1413d9`).
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
