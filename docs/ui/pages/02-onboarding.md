# 02. Onboarding & Consent (`/onboarding`)

## Purpose, user moment, rubric criteria
- **Purpose**: 3-step progressive onboarding flow (**Step 1: Goal & Study Context** $\rightarrow$ **Step 2: Granular Telemetry Consent & Non-Biometric Lock** $\rightarrow$ **Step 3: 30-Second Input & Baseline Calibration Mode**) that establishes informed consent, proves privacy-by-default before a single keystroke is logged, and gets the user into their first assessment block in under 60 seconds.
- **User / Evaluator Moment**: Triggered when a user or evaluator clicks **"Start 2-Minute Baseline →"** on `/` (or selects the *Nour · First-Time Learner* persona). Evaluators inspect this page specifically for the **Safety & Ethics (6%)** and **UX (9%)** rubric criteria.
- **Rubric Criteria Served**:
  - **Safety, Privacy & Ethics (Phase 1 — 6%)**: Granular per-category opt-in toggles, mandatory **Non-Biometric Mode ON by default** (zero camera/microphone/raw keystroke content), explicit "What the AI Sees vs. Never Sees" live payload preview, and non-clinical disclaimer acknowledgment.
  - **UX & Accessibility (Phase 1 — 9%)**: Fast 3-step stepper with keyboard/touch parity check, zero dark patterns (Reject Non-Essential is as prominent as Accept), and 1-click **"Judge Fast-Track: Apply Default Safe Consent & Start"** button.
  - **Relevance (Phase 1 — 12%)**: Connects learner goals and schedule windows directly to Layer A (Task Runner) and Layer C (Goals & Plan).
- **Time Budget**: `1.5 hours` (+50% alert threshold: `2.25 hours`).

---

## Wireframes: desktop, mobile

### Desktop (`1440 px` — 8:4 Split: Interactive 3-Step Wizard + Live Consent & Payload Inspector)
```text
+--------------------------------------------------------------------------------------------------+
| [ST] SynapseTwin · CISTAC 1.0     [Simulated Data]    [3|6|7|10 Dims] [Dark/Light] [Style Guide] |
+--------------------------------------------------------------------------------------------------+
| STEPPER BAR:  [ (1) Learning Context ] ---> [ (2) Granular Consent ] ---> [ (3) Calibration ]    |
|                                             [ ⚡ Judge Fast-Track: Default Safe Consent & Go → ] |
+--------------------------------------------------------------------------------------------------+
| LEFT COLUMN (8 cols): ACTIVE ONBOARDING STEP CARD    | RIGHT COLUMN (4 cols): LIVE AI INSPECTOR  |
| +--------------------------------------------------+ | +---------------------------------------+ |
| | Step 2 of 3 · Granular Privacy & Non-Biometric   | | | 🔒 What SynapseTwin Sees (Live JSON)  | |
| |                                                  | | | {                                     | |
| | [✓] Core Task Telemetry (Required · Locked ON)   | | |   "nonBiometricMode": true,           | |
| |     Reaction time (ms), accuracy, and jitter.    | | |   "cameraMicAccess": "NEVER",         | |
| |                                                  | | |   "telemetry": ["rt_ms", "correct"],  | |
| | [✓] Temporal Brain Twin History (Optional · ON)  | | |   "historyRetentionDays": 42,         | |
| |     Saves 6-week SAT-JEPA snapshots locally.     | | |   "aiCoachExplainability": true       | |
| |                                                  | | | }                                     | |
| | [✓] Explainable AI Coach & Collab Score (ON)     | | |---------------------------------------| |
| |     Computes 0–100 AI Collaboration rubric.      | | | ✕ NEVER COLLECTED:                    | |
| |                                                  | | | • Camera / webcam / gaze video        | |
| | [ ] Optional Research Aggregate Export (OFF)     | | | • Microphone / voice audio            | |
| |     Disabled by default (zero external sharing). | | | • Free-text keystrokes outside tasks  | |
| |                                                  | | | • Clinical or medical identifiers     | |
| | [✓] Non-Clinical Educational Acknowledgment      | | +---------------------------------------+ |
| |                                                  | |                                           |
| | [ ← Previous Step ]      [ Continue to Step 3 →] | |                                           |
| +--------------------------------------------------+ |                                           |
+--------------------------------------------------------------------------------------------------+
```

### Mobile (`375 px` — Single-Column Step Stack)
```text
+---------------------------------------+
| [ST] SynapseTwin   [7 Dims] [Theme]   |
+---------------------------------------+
| STEP 1 · 2 · 3   [⚡ Judge Fast-Track] |
+---------------------------------------+
| ACTIVE STEP CARD                      |
| - Step 1: Primary Goal & Peak Window  |
| - Step 2: Granular Consent Toggles    |
| - Step 3: 2-Min Quick Baseline vs     |
|           Full 8-Task Calibration     |
| [ ← Back (44px) ] [ Next Step (44px)] |
+---------------------------------------+
| 🔒 WHAT SYNAPSETWIN SEES (LIVE JSON)  |
| Live redaction & non-biometric proof  |
+---------------------------------------+
```

---

## Content and copy deck
- **Page Header**:
  - Eyebrow: `🔒 Privacy-First Onboarding · Step ${step} of 3`
  - Headline (`<h1>`): `Configure your cognitive twin on your own terms.`
  - Subcopy: `Before a single trial begins, choose your focus goal, review the exact telemetry fields we log, and verify our mandatory non-biometric guarantee.`
- **Step 1 — Learning Focus & Schedule Context**:
  - Focus Goal Options:
    1. `Deep Focus & Working Memory` (*Reduce context-switching fatigue and strengthen multi-step holding capacity*)
    2. `Fast Set-Shifting & Exam Agility` (*Switch cleanly between analytical rules under time pressure*)
    3. `Balanced 360° Cognitive Twin` (*Calibrate all ${N} dimensions evenly with adaptive 85%-accuracy targeting*)
  - Preferred Study Window: `Morning (08:00–12:00)`, `Afternoon (13:00–17:00)`, `Evening (18:00–22:00)`
- **Step 2 — Granular Telemetry Consent & Non-Biometric Lock**:
  - Toggle 1 (`coreTelemetry`, required): `Core Task Timing & Accuracy (Required)` — `Logs reaction time in milliseconds (rt_ms), trial correctness, and hesitation jitter.`
  - Toggle 2 (`NonBiometricLock`, locked ON): `Mandatory Non-Biometric Mode (Always ON)` — `Hardware camera, microphone, eye-tracking, and biometric sensors are permanently disabled.`
  - Toggle 3 (`historicalSnapshots`, default ON): `Historised Brain Twin Snapshots` — `Stores longitudinal confidence intervals (±CI) so you can scrub across weeks.`
  - Toggle 4 (`coachAndCollab`, default ON): `Explainable AI Coach & 0–100 Collaboration Score` — `Enables the 5-part “Why this?” reasoning trail and AI verification rubric.`
  - Toggle 5 (`researchExport`, default OFF): `Anonymized Benchmark Comparison (Opt-In)` — `Off by default. Never shared without explicit action.`
  - Checkbox (`nonClinicalAck`, required to finish): `I understand SynapseTwin is an educational self-reflection and cognitive training tool, not a clinical or medical diagnostic device.`
- **Step 3 — Input Check & Baseline Mode Selection**:
  - Mode A (Recommended Default): `⚡ 2-Minute Quick Baseline (3 core trials per dimension)` — `Delivers your first Uncertainty Radar and AI Coach insight in ~120 seconds.`
  - Mode B: `🎯 Standard Calibration Block (8 trials per dimension)` — `Narrower initial confidence bands (±4% target CI) in ~5 minutes.`
  - Input Parity Check: Interactive `"Tap or Press Spacebar"` latency test button that measures 1 sample keystroke/tap (`e.g., 142 ms · Input timer calibrated`) so the user feels the tactile responsiveness before entering the Task Runner.

---

## States: loading, empty, partial, error, offline, low confidence
- **Step 1 / Step 2 / Step 3 Active States**: Interactive wizard navigation with persistent state in `useAppStore` (or local wizard state + store sync).
- **All-Steps Overview Mode (`Show All Steps`)**: Toggleable view so evaluators or screenshot tests can inspect all 3 steps simultaneously or step-by-step.
- **Validation / Missing Acknowledgement State (`partial` / `error`)**: If the user attempts to launch without checking the Non-Clinical Acknowledgment, an accessible inline alert (`role="alert"`) highlights the required checkbox without guilt language.
- **Loading / Saving Consent State (`loading`)**: Brief deterministic confirmation state when saving the consent ledger receipt.
- **Empty / Reset State (`empty`)**: `"Reset Consent to Defaults"` button restores clean initial settings.
- **Offline State (`offline`)**: Banner + live JSON indicator showing `"storageMode": "local_indexed_queue"`.
- **Low-Confidence Preview Note**: Explains in Step 3 why Quick Baseline starts with wider confidence intervals (`±12%` hatched) vs Standard Calibration (`±5%` solid).

---

## Interactions and motion (with the reduced-motion variant)
- **Live JSON Consent Inspector**: Toggling any switch in Step 2 immediately updates the `"What SynapseTwin Sees"` JSON payload and Consent Receipt hash on the right column.
- **30-Second Input Latency Micro-Test**: Pressing `Space` or clicking the test pad in Step 3 records a real `performance.now()` delta (or deterministic `138 ms` in test mode) and displays `"✓ Input timer calibrated"`.
- **Judge Fast-Track Button**: One click (`"⚡ Judge Fast-Track: Apply Default Safe Consent"`) checks all safe defaults, records a consent timestamp, and unlocks immediate launch to `/dashboard` or `/assessment`.
- **Reduced Motion**: Step transitions and button presses use instant state swaps under `prefers-reduced-motion: reduce` or `data-reduced-motion="true"`.

---

## Data contract (types) and the mock fixtures used
- **Consent Record Contract**:
  - `ConsentPreferences`: `{ coreTelemetry: true, nonBiometricMode: true, historicalSnapshots: boolean, coachAndCollab: boolean, researchExport: boolean, nonClinicalAck: boolean, baselineMode: 'quick-2min' | 'standard-5min', focusGoal: string, peakWindow: string, updatedAtIso: string }`
- **Dimension Generalisation**: Dynamically lists the active `3 | 6 | 7 | 8 | 10` dimensions from `getDimensionsByPreset(dimensionPreset)` in Step 3's calibration summary (`e.g., 7 dimensions × 3 trials = 21 micro-trials`).

---

## Accessibility notes: focus order, labels, chart table alternative
- **Stepper Semantics**: Stepper uses `<ol role="list">` with `aria-current="step"` on the active step button.
- **Toggle Semantics**: Every consent switch is a semantic `<button role="switch" aria-checked={...}>` or labeled `<input type="checkbox">` with `min-h-11` (`44px`) hit area and explicit `aria-describedby` linking to the plain-language explanation.
- **Live Region**: Live JSON inspector and validation banner use `aria-live="polite"` / `role="alert"`.

---

## Acceptance checklist (from the Definition of Done)
- [ ] Matches this approved spec; any deviation logged in `DECISIONS.md`.
- [ ] Only design tokens used (`npm run lint:tokens` exits 0).
- [ ] All states (Step 1, Step 2, Step 3, validation alert, input calibrated, offline, extreme text) implemented and screenshotted.
- [ ] Contrast computed via `check-contrast.mjs` ($\ge 4.5:1$ text, $\ge 3.0:1$ UI/marks).
- [ ] Complete keyboard navigation, `3px` focus ring, logical tab order, $\ge 44\text{ px}$ targets.
- [ ] Reduced motion respected.
- [ ] Color never carries meaning alone (Lock/Check/Cross glyphs + `ON`/`OFF` text labels on every switch).
- [ ] Copy passes `npm run lint:copy` with zero clinical or guilt terms.
- [ ] Zero CLS, zero horizontal scroll at `375 px`, survives `200%` zoom.
- [ ] Code-split route (`React.lazy`).
- [ ] Unit/component tests + Playwright axe-core check (`0` violations).
- [ ] Works seamlessly with 3, 6, 7, 8, and 10 dimensions.
- [ ] Docs, screenshots, `STATE.md` and commit are done.

---

## Decisions and known issues
- **Decisions**: Include an `"Expand All 3 Steps"` toggle alongside the 1-2-3 wizard stepper so evaluators (and full-page screenshots) can either step through sequentially or inspect the entire consent + calibration architecture on one canvas.
- **Known Issues**: None.

---

## Screenshots (paths) and commit hashes
- `docs/ui/screenshots/02-onboarding-1440.png` *(Pending Step 7 Visual QA)*
- `docs/ui/screenshots/02-onboarding-768.png` *(Pending Step 7 Visual QA)*
- `docs/ui/screenshots/02-onboarding-375.png` *(Pending Step 7 Visual QA)*
