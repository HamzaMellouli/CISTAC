import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BRAND_CONFIG } from '../config/brand'
import { getDimensionsByPreset } from '../config/dimensions'
import {
  buildEstimatesForDimensions,
  SAMPLE_COLLABORATION_SCORE,
  SAMPLE_WHY_THIS_TRAIL,
} from '../services/mocks/fixtures'
import { useAppStore, type PersonaId } from '../store/useAppStore'
import { UncertaintyRadar } from '../components/signature/UncertaintyRadar'
import { WhyThisPanel } from '../components/signature/WhyThisPanel'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

type HeroPreviewState =
  | 'calibrated'
  | 'low-confidence'
  | 'partial'
  | 'loading'
  | 'empty'
  | 'error'
  | 'extreme-text'

interface PersonaLauncherCardSpec {
  id: PersonaId
  name: string
  roleLabel: string
  badgeLabel: string
  badgeTone: 'brand' | 'low-confidence' | 'reward'
  badgeGlyph: string
  summary: string
  metricsLine: string
  ctaLabel: string
  previewTargetState: HeroPreviewState
}

const PERSONA_CARDS: readonly PersonaLauncherCardSpec[] = [
  {
    id: 'steady-improver',
    name: 'Youssef · Steady Improver',
    roleLabel: '6 Weeks History · 14 Snapshots',
    badgeLabel: 'Calibrated (84% Conf)',
    badgeTone: 'brand',
    badgeGlyph: '●',
    summary:
      'Consistent 2-minute blocks across 6 weeks with narrowing confidence intervals, active SAT-JEPA cluster progression, and high AI collaboration.',
    metricsLine: 'Collab Score: 82 ± 4 · Mean RT: 585 ms · 0 Error Bursts',
    ctaLabel: 'Load Youssef (Calibrated Twin)',
    previewTargetState: 'calibrated',
  },
  {
    id: 'noisy-low-confidence',
    name: 'Salma · Irregular Schedule',
    roleLabel: 'High RT Variance · Late-Night Blocks',
    badgeLabel: 'Hatched Low-Conf (<60%)',
    badgeTone: 'low-confidence',
    badgeGlyph: '▨',
    summary:
      'Demonstrates how SynapseTwin handles noisy response times and small sample sizes with honest diagonal hatching and rest-first coaching.',
    metricsLine: '4 Hatched Dimensions · Jitter: 195 ms · Preliminary Range',
    ctaLabel: 'Load Salma (Hatched Twin)',
    previewTargetState: 'low-confidence',
  },
  {
    id: 'new-user',
    name: 'Nour · First-Time Learner',
    roleLabel: '0 Prior Sessions · Fresh Start',
    badgeLabel: 'Ready for 2-Min Baseline',
    badgeTone: 'reward',
    badgeGlyph: '★',
    summary:
      'Experience the zero-data entry flow: granular consent, mandatory non-biometric lock, and the 2-minute Quick Baseline assessment.',
    metricsLine: '0 Trials Logged · Non-Biometric Default ON · Est. 2 min',
    ctaLabel: 'Load Nour (New Baseline)',
    previewTargetState: 'empty',
  },
]

const FOUR_PILLARS = [
  {
    step: '01 · ASSESS (Layer A)',
    title: 'Adaptive Micro-Tasks, Zero Biometrics Required',
    badge: 'Reaction Time · Error Bursts · Jitter',
    badgeTone: 'brand' as const,
    glyph: '●',
    description:
      'Interactive cognitive tasks (N-Back, Stroop, UFOV, Mnemonic Similarity, Matrix & Tower) adapt toward 85% accuracy using client-side staircase and QUEST+ engines without camera or microphone collection.',
  },
  {
    step: '02 · UNDERSTAND (Brain Twin)',
    title: 'Historised Profile with Honest Uncertainty Bands',
    badge: 'SAT-JEPA + 95% CI Ranges',
    badgeTone: 'info' as const,
    glyph: '◆',
    description:
      'Every dimension is modeled as a percentage estimate plus confidence interval (±CI). When confidence is below 60%, bands automatically switch to diagonal SVG hatching.',
  },
  {
    step: '03 · COACH (Layer B)',
    title: 'Explainable, Non-Clinical Growth Guidance',
    badge: '5-Part “Why This?” Trail',
    badgeTone: 'success' as const,
    glyph: '✓',
    description:
      'Every piece of coaching advice exposes its observed telemetry, SAT-JEPA prototype delta (Δc), confidence bar, and counterfactual condition—enforced by an automated non-clinical copy linter.',
  },
  {
    step: '04 · IMPROVE (Layer C + Collab Score)',
    title: 'Adaptive Weekly Plans & 0–100 Collaboration Score',
    badge: `Collab Score: ${SAMPLE_COLLABORATION_SCORE.totalScore} ± 4`,
    badgeTone: 'reward' as const,
    glyph: '★',
    description:
      'Tracks historical growth curves, session fatigue heatmaps, and our transparent 5-weight AI Collaboration Score (Clarification 20%, Verification 25%, Iteration 20%, Autonomy 20%, Responsible Use 15%).',
  },
] as const

export default function WelcomePage() {
  const {
    dimensionPreset,
    activePersona,
    setActivePersona,
    showMascot,
  } = useAppStore()

  const [previewState, setPreviewState] =
    useState<HeroPreviewState>('calibrated')
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null)

  const activeDimensions = useMemo(
    () => getDimensionsByPreset(dimensionPreset),
    [dimensionPreset],
  )

  const previewPersona: PersonaId =
    previewState === 'low-confidence'
      ? 'noisy-low-confidence'
      : previewState === 'partial'
        ? 'edge-missing-dim'
        : previewState === 'empty'
          ? 'new-user'
          : 'steady-improver'

  const previewEstimates = useMemo(
    () => buildEstimatesForDimensions(activeDimensions, previewPersona),
    [activeDimensions, previewPersona],
  )

  const handleSelectPersona = (card: PersonaLauncherCardSpec) => {
    setActivePersona(card.id)
    setPreviewState(card.previewTargetState)
    setSelectedNotice(
      `Active persona switched to ${card.name} (${activeDimensions.length} cognitive dimensions active).`,
    )
  }

  return (
    <div className="space-y-8">
      {/* Live Feedback Toast / Status Banner when Persona or Baseline is triggered */}
      {selectedNotice && (
        <div
          role="status"
          aria-live="polite"
          className="tactile-card bg-brand-subtle p-4 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5">
            <Badge tone="brand" glyph="✓">
              Persona Active
            </Badge>
            <span className="text-sm font-semibold text-ink">
              {selectedNotice}
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedNotice(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* HERO SECTION: Asymmetric 7:5 Desktop Grid with Matched Vertical Rhythm */}
      <section
        aria-labelledby="welcome-hero-heading"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        {/* Left Column (7 cols): Value Proposition, Mascot Greeting Slot, Primary CTAs, Engine Readiness Strip */}
        <Card className="lg:col-span-7 p-6 flex flex-col justify-between gap-5">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="reward" glyph="★">
                CISTAC 1.0 · Cognitive Growth Agent
              </Badge>
              <Badge tone="success" glyph="✓">
                Mandatory Non-Biometric Mode ON
              </Badge>
              <Badge tone="info" glyph="◈">
                {activeDimensions.length} Dimensions Configured
              </Badge>
            </div>

            <div className="space-y-3">
              <h1
                id="welcome-hero-heading"
                className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight"
              >
                Meet your evolving cognitive twin—mapped with honest confidence
                ranges, never fixed labels.
              </h1>
              <p className="text-base text-ink-muted">
                Unlike one-off static tests,{' '}
                <strong>{BRAND_CONFIG.productName}</strong> continuously
                calibrates your profile across{' '}
                <strong>{activeDimensions.length} cognitive dimensions</strong>,
                visualizes epistemic uncertainty (
                <code className="font-mono-tabular">±CI</code>), and shows the
                exact telemetry behind every piece of coaching advice.
              </p>
            </div>

            {/* Reserved Semantic Mascot Welcome Slot (Upgrades to <Mascot state="hello" /> in Mascot Sprint) */}
            {showMascot && (
              <div
                data-mascot-slot="welcome-hero"
                className="rounded-md border-2 border-border-strong bg-surface-raised p-4 flex items-start gap-3.5"
              >
                <div
                  aria-hidden="true"
                  className="h-12 w-12 shrink-0 rounded-md border-2 border-border-strong bg-reward text-reward-ink flex items-center justify-center font-display text-lg font-bold"
                >
                  ✦
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-sm font-bold text-ink">
                      Friendly Companion Guide · Non-Clinical &amp; Zero-Guilt
                    </span>
                    <Badge tone="neutral" glyph="●">
                      State: Hello
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-muted">
                    “Welcome! Whether you have 2 minutes for a quick baseline or
                    want to explore a pre-calibrated 6-week Brain Twin, every
                    trial helps narrow your confidence range—with zero streak
                    pressure.”
                  </p>
                </div>
              </div>
            )}

            {/* Primary & Secondary Action Bar */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setActivePersona('new-user')
                  setPreviewState('calibrated')
                  setSelectedNotice(
                    '2-Minute Quick Baseline selected (3 core trials per dimension · Non-biometric telemetry ready).',
                  )
                }}
              >
                Start 2-Minute Baseline →
              </Button>

              <a
                href="#persona-launcher"
                className="tactile-btn bg-surface text-ink hover:bg-surface-raised px-5 py-3 text-base font-semibold no-underline inline-flex items-center justify-center"
              >
                Try a Judge Demo Persona ↓
              </a>

              <Link
                to="/design-system"
                className="focus-ring min-h-11 px-3 py-2 rounded-sm text-sm font-semibold text-ink underline inline-flex items-center"
              >
                Inspect Living Design System
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {/* Live CISTAC 1.0 Engine & Telemetry Contract Readiness Strip */}
            <div className="rounded-md border-2 border-border bg-canvas p-4 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display text-xs font-bold uppercase tracking-wider text-ink">
                  Live Engine &amp; Telemetry Contract Architecture
                </span>
                <Badge tone="brand" glyph="●">
                  8 Task Schemas + 5-Weight Collab Rubric
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="rounded-sm border border-border bg-surface p-2">
                  <span className="font-mono-tabular font-bold text-ink block">
                    QUEST+ / 85%
                  </span>
                  <span className="text-ink-muted">
                    Psychometric staircase target
                  </span>
                </div>
                <div className="rounded-sm border border-border bg-surface p-2">
                  <span className="font-mono-tabular font-bold text-ink block">
                    SAT-JEPA Δc
                  </span>
                  <span className="text-ink-muted">
                    Latent trajectory embedding
                  </span>
                </div>
                <div className="rounded-sm border border-border bg-surface p-2">
                  <span className="font-mono-tabular font-bold text-ink block">
                    95% ±CI Bands
                  </span>
                  <span className="text-ink-muted">
                    Hatched when conf &lt; 60%
                  </span>
                </div>
                <div className="rounded-sm border border-border bg-surface p-2">
                  <span className="font-mono-tabular font-bold text-ink block">
                    0 Biometrics
                  </span>
                  <span className="text-ink-muted">
                    RT, accuracy &amp; jitter only
                  </span>
                </div>
              </div>
            </div>

            {/* Trust & Epistemic Guarantee Footnote */}
            <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-ink-muted">
              <div>
                <strong className="text-ink block font-semibold">
                  ⏱ First Insight ≤ 3 Mins
                </strong>
                Quick Baseline (3 trials/dim) or 1-click seeded persona.
              </div>
              <div>
                <strong className="text-ink block font-semibold">
                  🔒 Privacy by Default
                </strong>
                Reaction time &amp; accuracy only—no raw audio or video ever
                stored.
              </div>
              <div>
                <strong className="text-ink block font-semibold">
                  📐 Epistemic Honesty
                </strong>
                Every score carries a 95% confidence band and “Why this?” trail.
              </div>
            </div>
          </div>
        </Card>

        {/* Right Column (5 cols): Live Interactive Brain Twin Preview */}
        <Card className="lg:col-span-5 p-4 flex flex-col justify-between gap-3">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">
                  Live Brain Twin Preview
                </h2>
                <p className="text-xs text-ink-muted">
                  Inspect how confidence intervals &amp; states render live:
                </p>
              </div>
              <Badge tone="brand" glyph="◈">
                Persona: {activePersona}
              </Badge>
            </div>

            {/* Interactive Preview State Switcher */}
            <div
              role="group"
              aria-label="Hero Brain Twin preview state switcher"
              className="flex flex-wrap gap-1.5"
            >
              {(
                [
                  { id: 'calibrated', label: 'Calibrated (84%)' },
                  { id: 'low-confidence', label: 'Low-Conf (Hatched)' },
                  { id: 'partial', label: 'Partial (1 Missing)' },
                  { id: 'loading', label: 'Loading' },
                  { id: 'empty', label: 'Empty (New)' },
                  { id: 'error', label: 'Error' },
                  { id: 'extreme-text', label: 'Extreme Values' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={previewState === tab.id}
                  onClick={() => setPreviewState(tab.id)}
                  className={`focus-ring min-h-11 px-2.5 py-1 rounded-sm border text-xs font-semibold cursor-pointer ${
                    previewState === tab.id
                      ? 'bg-brand text-brand-ink border-border-strong'
                      : 'bg-surface-raised text-ink border-border hover:bg-canvas'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* State-Specific Preview Body */}
            {previewState === 'loading' && (
              <div
                role="status"
                aria-label="Loading Brain Twin preview"
                className="rounded-md border-2 border-border bg-surface-raised p-6 h-80 flex flex-col justify-between"
              >
                <div className="h-5 w-48 rounded-sm bg-canvas" />
                <div className="h-44 w-44 mx-auto rounded-pill border-4 border-border" />
                <div className="h-4 w-56 mx-auto rounded-sm bg-canvas" />
              </div>
            )}

            {previewState === 'empty' && (
              <div className="rounded-md border-2 border-dashed border-border-strong bg-surface-raised p-6 text-center space-y-3">
                <Badge tone="reward" glyph="★">
                  New Learner · 0 Trials Completed
                </Badge>
                <h3 className="font-display text-lg font-bold text-ink">
                  No Brain Twin snapshot yet—ready for calibration
                </h3>
                <p className="text-xs text-ink-muted">
                  Run the 2-minute Quick Baseline (3 trials across each of the{' '}
                  {activeDimensions.length} dimensions) to generate your first
                  uncertainty polygon.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setPreviewState('calibrated')}
                >
                  Preview Calibrated Twin Instead
                </Button>
              </div>
            )}

            {previewState === 'error' && (
              <div
                role="alert"
                className="rounded-md border-2 border-danger bg-danger-subtle p-5 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <strong className="font-display text-base font-bold text-ink">
                    ✕ Preview Snapshot Unavailable
                  </strong>
                  <Badge tone="danger" glyph="!">
                    Simulated Timeout
                  </Badge>
                </div>
                <p className="text-xs text-ink">
                  Unable to reach `/v1/dashboard/profile`. Local mock fixtures
                  and offline task buffering remain available.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setPreviewState('calibrated')}
                >
                  Retry Preview Load
                </Button>
              </div>
            )}

            {previewState === 'extreme-text' && (
              <div className="rounded-md border-2 border-border-strong bg-surface-raised p-4 space-y-2 min-w-0">
                <Badge tone="info" glyph="◈">
                  Overflow &amp; High-Magnitude Stress Check
                </Badge>
                <h3 className="font-display text-base font-bold text-ink break-words">
                  Cross-Modal Visuospatial Relational Pattern Separation &amp;
                  Executive Interference Suppression
                </h3>
                <p className="font-mono-tabular text-xl font-bold text-ink">
                  99.8% ± 0.2% · 9,999,999 events · 18,450 ms
                </p>
                <p className="text-xs text-ink-muted">
                  Verifies zero horizontal overflow at 375 px and 200% browser
                  zoom.
                </p>
              </div>
            )}

            {(previewState === 'calibrated' ||
              previewState === 'low-confidence' ||
              previewState === 'partial') && (
              <div className="space-y-3">
                <UncertaintyRadar
                  dimensions={activeDimensions}
                  estimates={previewEstimates}
                  title="Interactive Twin Radar Preview"
                />
                <WhyThisPanel
                  trail={SAMPLE_WHY_THIS_TRAIL}
                  title="Sample Coaching Explainability Trail"
                />
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* SECTION 2: THE 4 CHALLENGE PILLARS (Assess -> Understand -> Coach -> Improve) */}
      <section aria-labelledby="pillars-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2
              id="pillars-heading"
              className="font-display text-2xl font-bold text-ink"
            >
              How {BRAND_CONFIG.productName} Closes the Cognitive Growth Loop
            </h2>
            <p className="text-sm text-ink-muted">
              Every mandatory CISTAC 1.0 layer is visible, explainable, and
              connected end-to-end.
            </p>
          </div>
          <Badge tone="neutral" glyph="◈">
            Layers A · B · C + Collaboration Score
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FOUR_PILLARS.map((pillar) => (
            <Card
              key={pillar.step}
              as="article"
              className="flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <span className="font-mono-tabular text-xs font-bold uppercase text-ink-muted block">
                  {pillar.step}
                </span>
                <h3 className="font-display text-lg font-bold text-ink">
                  {pillar.title}
                </h3>
                <p className="text-xs text-ink-muted">{pillar.description}</p>
              </div>
              <div className="pt-2 border-t border-border">
                <Badge tone={pillar.badgeTone} glyph={pillar.glyph}>
                  {pillar.badge}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SECTION 3: INSTANT JUDGE & DEMO PERSONA LAUNCHER */}
      <section
        id="persona-launcher"
        aria-labelledby="personas-heading"
        className="space-y-4"
      >
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2
              id="personas-heading"
              className="font-display text-2xl font-bold text-ink"
            >
              Try a Seeded Demo Persona (First Insight in 1 Click)
            </h2>
            <p className="text-sm text-ink-muted">
              For evaluators and demos: switch instantaneously between a 6-week
              calibrated profile, a noisy low-confidence profile, or a brand-new
              student.
            </p>
          </div>
          <Badge tone="reward" glyph="★">
            Deterministic Seeded Fixtures
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PERSONA_CARDS.map((card) => {
            const isSelected = activePersona === card.id
            return (
              <Card
                key={card.id}
                as="article"
                className="flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge tone={card.badgeTone} glyph={card.badgeGlyph}>
                      {card.badgeLabel}
                    </Badge>
                    {isSelected && (
                      <Badge tone="success" glyph="✓">
                        Active
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink">
                      {card.name}
                    </h3>
                    <p className="font-mono-tabular text-xs font-semibold text-ink-muted">
                      {card.roleLabel}
                    </p>
                  </div>
                  <p className="text-sm text-ink">{card.summary}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-border">
                  <p className="font-mono-tabular text-xs text-ink-muted">
                    {card.metricsLine}
                  </p>
                  <Button
                    variant={isSelected ? 'reward' : 'primary'}
                    className="w-full"
                    onClick={() => handleSelectPersona(card)}
                  >
                    {isSelected ? `✓ ${card.name} Loaded` : card.ctaLabel}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
