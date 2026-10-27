import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BRAND_CONFIG } from '../config/brand'
import { getDimensionsByPreset } from '../config/dimensions'
import {
  buildEstimatesForDimensions,
  SAMPLE_WHY_THIS_TRAIL,
} from '../services/mocks/fixtures'
import { useAppStore, type PersonaId } from '../store/useAppStore'
import { UncertaintyRadar } from '../components/signature/UncertaintyRadar'
import { WhyThisPanel } from '../components/signature/WhyThisPanel'
import { NodiCompanion } from '../components/signature/NodiCompanion'
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

const THREE_STEPS = [
  {
    number: '01',
    stepLabel: 'Step 1 · Assess',
    title: 'Adaptive Micro-Tasks',
    badge: 'Layer A Psychometrics',
    badgeTone: 'brand' as const,
    glyph: '●',
    description:
      'Engage in 2-minute cognitive tasks (Pattern Separation, Working Memory, Inhibitory Control) that calibrate in real time. Strictly reaction time, accuracy, and jitter—zero camera, audio, or biometric telemetry.',
  },
  {
    number: '02',
    stepLabel: 'Step 2 · Understand',
    title: 'Honest Uncertainty Bands',
    badge: '95% ±CI & Hatched States',
    badgeTone: 'info' as const,
    glyph: '◆',
    description:
      'Your cognitive twin visualizes confidence ranges (±CI) for every dimension. When sample sizes are small or variance is high (<60% confidence), bands switch to honest diagonal hatching instead of false certainty.',
  },
  {
    number: '03',
    stepLabel: 'Step 3 · Grow',
    title: 'Zero-Guilt Daily Guidance',
    badge: 'Layer B + C Coaching',
    badgeTone: 'reward' as const,
    glyph: '✓',
    description:
      'Receive explainable growth suggestions showing exact underlying telemetry and reasoning. Habit contracts and rest days are respected with zero guilt streaks or penalty scores.',
  },
] as const

export default function WelcomePage() {
  const navigate = useNavigate()
  const {
    dimensionPreset,
    activePersona,
    setActivePersona,
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

  const handleStartBaseline = () => {
    setActivePersona('new-user')
    navigate('/onboarding')
  }

  return (
    <div className="space-y-16">
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

      {/* =========================================================================
          FIRST-RUN HERO VIEWPORT
          Strictly follows wireframe:
          - Logo & Skip intro at top
          - Companion occupying ~40% of the screen height
          - "Let's map how your mind works in 2 minutes."
          - "No labels. No scores to fail."
          - "[ Start my 2-minute baseline ]"
          - "How your data is used"
          ========================================================================= */}
      <section
        aria-labelledby="welcome-hero-heading"
        className="min-h-[calc(100vh-6rem)] flex flex-col justify-between items-center text-center px-4 py-6 max-w-3xl mx-auto"
      >
        {/* Mobile & First-Run Header Quick Bar */}
        <div className="w-full flex items-center justify-between gap-4 pb-2 md:hidden">
          <span className="font-display text-sm font-bold text-ink flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-brand-ink text-xs font-bold"
            >
              ST
            </span>
            {BRAND_CONFIG.productName}
          </span>
          <Link
            to="/dashboard"
            className="focus-ring text-xs font-semibold text-ink-muted hover:text-ink px-3 py-1.5 rounded-full border border-border bg-surface no-underline inline-flex items-center gap-1"
          >
            <span>Skip intro</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Companion: Centered, occupying ~40% of the screen height */}
        <div className="w-full flex-1 flex items-center justify-center py-2 sm:py-4 my-auto">
          <div className="flex items-center justify-center max-h-[42vh]">
            <NodiCompanion
              size="hero"
              state="hello"
              showSpeechBubble={false}
              className="mx-auto"
            />
          </div>
        </div>

        {/* Core Value Proposition (Fredoka Display + Lexend Body) */}
        <div className="space-y-3 max-w-xl mx-auto my-auto pt-2">
          <h1
            id="welcome-hero-heading"
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-ink tracking-tight leading-tight"
          >
            Let's map how your mind works in 2 minutes.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-ink-muted font-normal leading-relaxed">
            No labels. No scores to fail.
          </p>
        </div>

        {/* Primary CTA & Privacy Transparency Link */}
        <div className="flex flex-col items-center gap-3.5 my-auto pt-6 pb-2">
          <Button
            variant="primary"
            size="lg"
            className="min-h-12 px-8 py-3.5 text-base sm:text-lg font-bold shadow-md hover:shadow-lg transition-transform hover:scale-[1.02]"
            onClick={handleStartBaseline}
          >
            Start my 2-minute baseline →
          </Button>

          <Link
            to="/privacy"
            className="focus-ring text-xs sm:text-sm font-semibold text-ink-muted hover:text-ink underline transition-colors rounded-sm px-2 py-1"
          >
            How your data is used
          </Link>
        </div>

        {/* Clean Scroll Cue */}
        <div className="pt-4">
          <a
            href="#how-it-works"
            className="focus-ring inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-colors py-1.5 px-3 rounded-full hover:bg-surface-raised"
          >
            <span>Below the fold: how it works (3 steps) &amp; live radar preview</span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      {/* =========================================================================
          BELOW THE FOLD: HOW IT WORKS (3 STEPS)
          ========================================================================= */}
      <section
        id="how-it-works"
        aria-labelledby="how-it-works-heading"
        className="pt-12 space-y-8 border-t border-border"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-ink-muted">
            3-Step Cognitive Feedback Loop
          </span>
          <h2
            id="how-it-works-heading"
            className="font-display text-2xl sm:text-3xl font-bold text-ink"
          >
            How SynapseTwin Works
          </h2>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            A continuous calibration loop designed with scientific precision,
            transparent uncertainty bands, and zero camera or microphone requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {THREE_STEPS.map((step) => (
            <Card
              key={step.number}
              as="article"
              className="p-6 flex flex-col justify-between gap-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-tabular text-xs font-bold uppercase text-ink-muted tracking-wider">
                    {step.stepLabel}
                  </span>
                  <Badge tone={step.badgeTone} glyph={step.glyph}>
                    {step.badge}
                  </Badge>
                </div>
                <h3 className="font-display text-xl font-bold text-ink">
                  {step.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-ink-muted font-mono-tabular">
                <span>Phase {step.number}</span>
                <span className="text-ink font-semibold">100% Non-Biometric</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* =========================================================================
          BELOW THE FOLD: LIVE RADAR PREVIEW
          ========================================================================= */}
      <section
        id="radar-preview"
        aria-labelledby="radar-preview-heading"
        className="pt-12 space-y-6 border-t border-border"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-ink-muted">
              Interactive Epistemic Visualization
            </span>
            <h2
              id="radar-preview-heading"
              className="font-display text-2xl sm:text-3xl font-bold text-ink"
            >
              Meet your evolving cognitive twin—Live Radar Preview
            </h2>
            <p className="text-sm text-ink-muted mt-1">
              Inspect how confidence intervals (<code className="font-mono-tabular">±CI</code>) and hatched low-confidence states render live:
            </p>
          </div>
          <Badge tone="brand" glyph="◈">
            Active Persona: {activePersona}
          </Badge>
        </div>

        {/* Interactive Preview State Switcher */}
        <div
          role="group"
          aria-label="Hero Brain Twin preview state switcher"
          className="flex flex-wrap gap-2"
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
              className={`focus-ring min-h-10 px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-colors ${
                previewState === tab.id
                  ? 'bg-brand text-brand-ink border-border-strong shadow-sm'
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
            className="rounded-xl border-2 border-border bg-surface-raised p-8 h-96 flex flex-col justify-between"
          >
            <div className="h-5 w-48 rounded bg-canvas animate-pulse" />
            <div className="h-48 w-48 mx-auto rounded-full border-4 border-border border-t-brand animate-spin" />
            <div className="h-4 w-56 mx-auto rounded bg-canvas animate-pulse" />
          </div>
        )}

        {previewState === 'empty' && (
          <div className="rounded-xl border-2 border-dashed border-border-strong bg-surface-raised p-8 text-center space-y-4 max-w-lg mx-auto">
            <Badge tone="reward" glyph="★">
              New Learner · 0 Trials Completed
            </Badge>
            <h3 className="font-display text-xl font-bold text-ink">
              No Brain Twin snapshot yet—ready for calibration
            </h3>
            <p className="text-sm text-ink-muted">
              Run the 2-minute Quick Baseline (3 micro-trials across each configured dimension) to generate your first uncertainty polygon.
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
            className="rounded-xl border-2 border-danger bg-danger-subtle p-6 space-y-4 max-w-lg mx-auto"
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
              Unable to reach `/v1/dashboard/profile`. Local mock fixtures and offline task buffering remain available.
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
          <div className="rounded-xl border-2 border-border-strong bg-surface-raised p-6 space-y-3 min-w-0 max-w-lg mx-auto">
            <Badge tone="info" glyph="◈">
              Overflow &amp; High-Magnitude Stress Check
            </Badge>
            <h3 className="font-display text-base font-bold text-ink break-words">
              Cross-Modal Visuospatial Relational Pattern Separation &amp; Executive Interference Suppression
            </h3>
            <p className="font-mono-tabular text-xl font-bold text-ink">
              99.8% ± 0.2% · 9,999,999 events · 18,450 ms
            </p>
            <p className="text-xs text-ink-muted">
              Verifies zero horizontal overflow at 375 px and 200% browser zoom.
            </p>
          </div>
        )}

        {(previewState === 'calibrated' ||
          previewState === 'low-confidence' ||
          previewState === 'partial') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <UncertaintyRadar
                dimensions={activeDimensions}
                estimates={previewEstimates}
                title="Interactive Twin Radar Preview"
              />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <WhyThisPanel
                trail={SAMPLE_WHY_THIS_TRAIL}
                title="Sample Coaching Explainability Trail"
              />
              <Card className="p-4 space-y-2">
                <span className="font-display text-xs font-bold uppercase tracking-wider text-ink block">
                  CISTAC 1.0 Epistemic Guarantee
                </span>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Every score is represented as an interval estimate, never a single point. When data confidence falls below 60%, the polygon switches to diagonal SVG hatching to prevent misleading impressions of precision.
                </p>
              </Card>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          BELOW THE FOLD: SEEDED DEMO PERSONA LAUNCHER
          ========================================================================= */}
      <section
        id="persona-launcher"
        aria-labelledby="personas-heading"
        className="pt-12 pb-8 space-y-6 border-t border-border"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-ink-muted">
              Deterministic Seeded Fixtures
            </span>
            <h2
              id="personas-heading"
              className="font-display text-2xl sm:text-3xl font-bold text-ink"
            >
              Try a Seeded Demo Persona
            </h2>
            <p className="text-sm text-ink-muted mt-1">
              For evaluators and defense demonstrations: instantaneously switch between calibrated history, noisy low-confidence telemetry, or a brand-new student.
            </p>
          </div>
          <Badge tone="reward" glyph="★">
            1-Click Evaluator Presets
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PERSONA_CARDS.map((card) => {
            const isSelected = activePersona === card.id
            return (
              <Card
                key={card.id}
                as="article"
                className="flex flex-col justify-between gap-4 p-6"
              >
                <div className="space-y-3">
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
                    <p className="font-mono-tabular text-xs font-semibold text-ink-muted mt-0.5">
                      {card.roleLabel}
                    </p>
                  </div>
                  <p className="text-sm text-ink-muted leading-relaxed">{card.summary}</p>
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
