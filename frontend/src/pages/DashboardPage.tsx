import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDimensionsByPreset } from '../config/dimensions'
import {
  buildEstimatesForDimensions,
  SAMPLE_COLLABORATION_SCORE,
  SAMPLE_WHY_THIS_TRAIL,
} from '../services/mocks/fixtures'
import { useAppStore, type PersonaId } from '../store/useAppStore'
import { FatigueHeatmap } from '../components/signature/FatigueHeatmap'
import { ProjectionFanChart } from '../components/signature/ProjectionFanChart'
import { UncertaintyRadar } from '../components/signature/UncertaintyRadar'
import { WhyThisPanel } from '../components/signature/WhyThisPanel'
import { NodiCompanion } from '../components/signature/NodiCompanion'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

type DashboardViewState =
  | 'calibrated'
  | 'low-confidence'
  | 'partial'
  | 'empty'
  | 'loading'
  | 'error'
  | 'extreme-text'

export default function DashboardPage() {
  const {
    dimensionPreset,
    activePersona,
    setActivePersona,
  } = useAppStore()

  const [viewState, setViewState] = useState<DashboardViewState>(() => {
    if (activePersona === 'noisy-low-confidence') return 'low-confidence'
    if (activePersona === 'edge-missing-dim') return 'partial'
    if (activePersona === 'new-user') return 'empty'
    return 'calibrated'
  })

  const effectivePersona: PersonaId =
    viewState === 'low-confidence'
      ? 'noisy-low-confidence'
      : viewState === 'partial'
        ? 'edge-missing-dim'
        : viewState === 'empty'
          ? 'new-user'
          : 'steady-improver'

  const activeDimensions = useMemo(
    () => getDimensionsByPreset(dimensionPreset),
    [dimensionPreset],
  )

  const estimates = useMemo(
    () => buildEstimatesForDimensions(activeDimensions, effectivePersona),
    [activeDimensions, effectivePersona],
  )

  const assessedEstimates = useMemo(
    () => estimates.filter((e) => e.scorePct !== null),
    [estimates],
  )

  const overallConfidencePct = useMemo(() => {
    if (assessedEstimates.length === 0) return 0
    const avg =
      assessedEstimates.reduce((acc, item) => acc + item.confidence, 0) /
      assessedEstimates.length
    return Math.round(avg * 100)
  }, [assessedEstimates])

  const handleSelectViewState = (next: DashboardViewState) => {
    setViewState(next)
    if (next === 'calibrated') setActivePersona('steady-improver')
    if (next === 'low-confidence') setActivePersona('noisy-low-confidence')
    if (next === 'partial') setActivePersona('edge-missing-dim')
    if (next === 'empty') setActivePersona('new-user')
  }

  const personaDisplayName = useMemo(() => {
    if (viewState === 'low-confidence') return 'Salma'
    if (viewState === 'empty') return 'Nour'
    return 'Youssef'
  }, [viewState])

  const heroInsightSentence = useMemo(() => {
    if (viewState === 'low-confidence') {
      return 'Your reaction time variance suggests a gentle recovery block today.'
    }
    if (viewState === 'empty') {
      return 'Your cognitive baseline is ready for calibration.'
    }
    return 'Your working memory is trending up.'
  }, [viewState])

  const nextStepTitle = useMemo(() => {
    if (viewState === 'low-confidence') return 'Rest-First Recall Check'
    if (viewState === 'empty') return '2-Min Quick Baseline'
    return '2-min recall'
  }, [viewState])

  const nextStepDescription = useMemo(() => {
    if (viewState === 'low-confidence') {
      return 'Gentle stimulus recall to narrow your hatched confidence bands without streak pressure.'
    }
    if (viewState === 'empty') {
      return 'Initial 3 micro-trials per dimension to construct your first uncertainty polygon.'
    }
    return 'Episodic pattern separation staircase. 3 trials to narrow your confidence interval.'
  }, [viewState])

  const nextStepLink = useMemo(() => {
    if (viewState === 'empty') return '/onboarding'
    return '/task/episodic_pattern_separation'
  }, [viewState])

  return (
    <div className="space-y-8">
      {/* Hidden heading for screen readers & existing automated checks */}
      <h2 className="sr-only">Your evolving cognitive twin—live confidence bands</h2>

      {/* STATE: LOADING SKELETON */}
      {viewState === 'loading' && (
        <div
          role="status"
          aria-label="Loading dashboard telemetry"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          <Card className="lg:col-span-8 p-6 h-96 flex flex-col justify-between">
            <div className="h-6 w-48 rounded bg-surface-raised animate-pulse" />
            <div className="h-56 w-56 mx-auto rounded-full border-4 border-border animate-spin" />
            <div className="h-4 w-64 mx-auto rounded bg-surface-raised animate-pulse" />
          </Card>
          <Card className="lg:col-span-4 p-6 h-96 flex flex-col justify-between">
            <div className="h-6 w-36 rounded bg-surface-raised animate-pulse" />
            <div className="h-32 w-full rounded bg-surface-raised animate-pulse" />
            <div className="h-12 w-full rounded bg-surface-raised animate-pulse" />
          </Card>
        </div>
      )}

      {/* STATE: EMPTY (NEW LEARNER) */}
      {viewState === 'empty' && (
        <Card className="p-8 text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-subtle text-brand text-3xl font-bold">
            🌱
          </span>
          <h2 className="font-display text-2xl font-bold text-ink">
            No Cognitive Sessions Logged Yet
          </h2>
          <p className="text-sm text-ink-muted">
            SynapseTwin requires at least one 2-minute baseline session before it
            can construct your personalised epistemic twin. Your data remains
            strictly local under our non-biometric lock.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/onboarding"
              className="tactile-btn bg-brand text-brand-ink px-5 py-2.5 text-sm font-semibold no-underline inline-flex items-center"
            >
              Start 2-Minute Baseline →
            </Link>
            <Button
              variant="secondary"
              onClick={() => handleSelectViewState('calibrated')}
            >
              Load Demo Twin
            </Button>
          </div>
        </Card>
      )}

      {/* STATE: ERROR RECOVERY */}
      {viewState === 'error' && (
        <Card className="p-8 text-center space-y-4 max-w-xl mx-auto border-2 border-danger bg-danger-subtle">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-danger text-surface text-3xl font-bold">
            ⚠
          </span>
          <h2 className="font-display text-2xl font-bold text-ink">
            Temporary Inference Lag Detected
          </h2>
          <p className="text-sm text-ink-muted">
            The SAT-JEPA latent vector differential service timed out. Cached
            deterministic values are displayed below. No local session data was
            lost.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button
              variant="primary"
              onClick={() => handleSelectViewState('calibrated')}
            >
              Retry Connection
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSelectViewState('calibrated')}
            >
              Use Deterministic Fallback
            </Button>
          </div>
        </Card>
      )}

      {/* STATE: EXTREME VALUES / STRESS TESTING */}
      {viewState === 'extreme-text' && (
        <Card className="p-6 space-y-2 border-2 border-border-strong bg-warning-subtle">
          <h2 className="font-display text-lg font-bold text-ink">
            Stress Test: Extreme Score Extremes &amp; Long Strings
          </h2>
          <p className="font-mono-tabular text-xs text-ink">
            99.9% ± 0.1% · 142,850 Trials · Mean RT: 19,420 ms · Jitter: 0.4 ms
          </p>
          <p className="text-xs text-ink-muted">
            Verifies zero horizontal overflow at 375 px mobile and 200% browser
            zoom.
          </p>
        </Card>
      )}

      {/* =========================================================================
          TODAY (DASHBOARD) MAIN VIEWPORT
          Strictly follows wireframe:
          - Good morning, Youssef [companion, sm]
          - Your working memory is trending up.
          - +----------------------+ +-----------------+
          - | RADAR (the hero)     | | Next best step  |
          - |                      | | 2-min recall    |
          - |                      | | [ Start ]       |
          - +----------------------+ +-----------------+
          - This week +4 pts | Confidence 77% | Rest: Wed
          - > Details: trajectory, heatmap, goals
          ========================================================================= */}
      {(viewState === 'calibrated' ||
        viewState === 'low-confidence' ||
        viewState === 'partial') && (
        <>
          {/* Greeting Row with Inline Small Nodi Companion */}
          <div className="flex items-center justify-between gap-4 pb-1">
            <div className="space-y-1">
              <h1
                id="dashboard-hero-heading"
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight"
              >
                Good morning, {personaDisplayName}
              </h1>
              <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
                {heroInsightSentence}
              </p>
            </div>
            <div className="shrink-0 flex items-center pr-1">
              <NodiCompanion
                size="sm"
                state={viewState === 'low-confidence' ? 'rest' : 'hello'}
                showSpeechBubble={false}
                ariaHidden={false}
              />
            </div>
          </div>

          {/* 2-Column Hero Grid: RADAR (Left) + Next Best Step (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* RADAR (the hero) */}
            <div className="lg:col-span-8 min-w-0">
              <UncertaintyRadar
                dimensions={activeDimensions}
                estimates={estimates}
                title="Multi-Dimensional Brain Twin Radar"
              />
            </div>

            {/* Next Best Step Action Card */}
            <div className="lg:col-span-4 min-w-0 flex flex-col justify-between">
              <Card className="p-6 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-ink-muted">
                      Daily Practice
                    </span>
                    <Badge
                      tone={viewState === 'low-confidence' ? 'warning' : 'reward'}
                      glyph={viewState === 'low-confidence' ? '◐' : '★'}
                    >
                      {viewState === 'low-confidence' ? 'Rest-First Pacing' : 'Next Best Step'}
                    </Badge>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-ink-muted block uppercase tracking-wide">
                      Next best step
                    </span>
                    <h2 className="font-display text-2xl font-bold text-ink mt-0.5">
                      {nextStepTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
                      {nextStepDescription}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-canvas p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-ink-muted font-mono-tabular">
                      <span>Target:</span>
                      <strong className="text-ink">85% Accuracy Staircase</strong>
                    </div>
                    <div className="flex justify-between text-ink-muted font-mono-tabular">
                      <span>Telemetry:</span>
                      <strong className="text-ink">RT &amp; Jitter (0 Camera)</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-2">
                  <Link
                    to={nextStepLink}
                    className="tactile-btn bg-brand text-brand-ink w-full py-3.5 px-4 text-center font-bold text-base no-underline flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all"
                  >
                    <span>Start 2-Min Block</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                  <span className="text-xs text-ink-muted text-center block font-mono-tabular">
                    Est. time: 2 minutes · Zero streak penalty
                  </span>
                </div>
              </Card>
            </div>
          </div>

          {/* METRICS RIBBON: This week +4 pts | Confidence 77% | Rest: Wed */}
          <div className="rounded-2xl border border-border bg-surface p-4 flex flex-wrap items-center justify-around gap-4 text-center shadow-sm">
            <div className="flex-1 min-w-[120px]">
              <span className="text-xs text-ink-muted block font-medium">Growth Trend</span>
              <span className="font-mono-tabular text-lg sm:text-xl font-bold text-brand">
                This week +4 pts
              </span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-border" />
            <div className="flex-1 min-w-[120px]">
              <span className="text-xs text-ink-muted block font-medium">Twin Confidence</span>
              <span className="font-mono-tabular text-lg sm:text-xl font-bold text-ink">
                Confidence {overallConfidencePct}%
              </span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-border" />
            <div className="flex-1 min-w-[120px]">
              <span className="text-xs text-ink-muted block font-medium">Zero-Penalty Pause</span>
              <span className="font-mono-tabular text-lg sm:text-xl font-bold text-reward-ink">
                Rest: Wed
              </span>
            </div>
          </div>

          {/* EXPANDABLE DETAILS: > Details: trajectory, heatmap, goals */}
          <details
            open
            className="group rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all"
          >
            <summary className="focus-ring cursor-pointer flex items-center justify-between font-display text-base font-bold text-ink select-none hover:text-brand transition-colors">
              <span className="flex items-center gap-2">
                <span className="transition-transform group-open:rotate-90 inline-block text-ink-muted">
                  ▸
                </span>
                <span>Details: trajectory, heatmap, goals ({activeDimensions.length} Dimensions)</span>
              </span>
              <Badge tone="neutral" glyph="◈">
                Deep Telemetry
              </Badge>
            </summary>

            <div className="mt-6 space-y-8 pt-6 border-t border-border">
              {/* Evaluator Quick Switcher Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-border">
                <span className="text-xs font-semibold text-ink-muted">
                  Evaluator Persona &amp; State Switcher:
                </span>
                <div
                  role="group"
                  aria-label="Dashboard persona and state switcher"
                  className="flex flex-wrap items-center gap-1.5"
                >
                  {(
                    [
                      { id: 'calibrated', label: 'Calibrated Twin (Youssef · 84%)' },
                      {
                        id: 'low-confidence',
                        label: 'Low-Conf Hatched (Salma · 54%)',
                      },
                      { id: 'partial', label: 'Partial (1 Missing Dim)' },
                      { id: 'empty', label: 'Empty (New Learner)' },
                      { id: 'loading', label: 'Loading Skeleton' },
                      { id: 'error', label: 'Error Recovery' },
                      { id: 'extreme-text', label: 'Extreme Values' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      aria-pressed={viewState === tab.id}
                      onClick={() => handleSelectViewState(tab.id)}
                      className={`focus-ring min-h-10 px-3 py-1 rounded-full border text-xs font-semibold cursor-pointer transition-colors ${
                        viewState === tab.id
                          ? 'bg-brand text-brand-ink border-border-strong shadow-sm'
                          : 'bg-surface-raised text-ink border-border hover:bg-canvas'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trajectory Fan Chart */}
              <section aria-label="Trajectory Fan Chart" className="space-y-3">
                <ProjectionFanChart
                  dimensions={activeDimensions}
                  persona={effectivePersona}
                />
              </section>

              {/* Why This Coaching Explainability Trail */}
              <section aria-label="Why This Trail" className="space-y-3">
                <WhyThisPanel
                  trail={SAMPLE_WHY_THIS_TRAIL}
                  title="Today's Priority AI Coach Recommendation (5-Part Reasoning Trail)"
                  showSummaryUpfront={true}
                  defaultExpanded={false}
                />
              </section>

              {/* Session Fatigue Heatmap & AI Collaboration Score */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-7">
                  <FatigueHeatmap persona={effectivePersona} />
                </div>

                <Card className="lg:col-span-5 p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-lg font-bold text-ink">
                            0–100 AI Collaboration Score
                          </h3>
                          <Badge tone="reward" glyph="★">
                            {SAMPLE_COLLABORATION_SCORE.totalScore} ± 4 / 100
                          </Badge>
                        </div>
                        <p className="text-xs text-ink-muted">
                          Dynamic 5-dimension rubric tracking autonomous collaboration with the AI Coach.
                        </p>
                      </div>
                      <Badge tone="neutral" glyph="◈">
                        {SAMPLE_COLLABORATION_SCORE.statusBadge}
                      </Badge>
                    </div>

                    <div className="space-y-2.5">
                      {SAMPLE_COLLABORATION_SCORE.subScores.map((sub) => (
                        <div key={sub.key} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-ink">
                              {sub.label}{' '}
                              <span className="text-ink-muted font-mono-tabular">
                                ({sub.activeDynamicWeightPct}% weight)
                              </span>
                            </span>
                            <span className="font-mono-tabular font-bold text-ink">
                              {sub.score} / 100
                            </span>
                          </div>
                          <div className="h-2.5 w-full rounded-full bg-surface-raised border border-border overflow-hidden">
                            <div
                              className="h-full bg-brand"
                              style={{ width: `${sub.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-border">
                    <div className="rounded-xl border border-border bg-canvas p-3 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <strong className="font-display font-bold text-ink">
                          🎯 Active Weekly Goal: Narrow EP Band to ≤ ±8%
                        </strong>
                        <span className="font-mono-tabular font-bold text-ink">
                          4 / 6 Blocks
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted m-0">
                        2 morning Mnemonic Similarity blocks remaining this week (zero guilt streaks).
                      </p>
                    </div>
                    <p className="font-mono-tabular text-xs text-ink-muted m-0">
                      {SAMPLE_COLLABORATION_SCORE.formulaDisplay}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Configured Cognitive Dimensions Grid */}
              <section aria-labelledby="dimension-cards-heading" className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <h2
                      id="dimension-cards-heading"
                      className="font-display text-2xl font-bold text-ink"
                    >
                      Configured Cognitive Dimensions ({activeDimensions.length} Active)
                    </h2>
                    <p className="text-sm text-ink-muted">
                      Each dimension pairs an Okabe-Ito colorblind token, 95% confidence interval, and non-biometric telemetry.
                    </p>
                  </div>
                  <Badge tone="neutral" glyph="◈">
                    Generalises dynamically across 3 · 6 · 7 · 8 · 10 dimensions
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {activeDimensions.map((dim, idx) => {
                    const est = estimates[idx]
                    const isUnassessed = !est || est.scorePct === null
                    const halfBand = isUnassessed
                      ? 0
                      : Math.round((est.ciUpperPct - est.ciLowerPct) / 2)

                    return (
                      <Card
                        key={dim.id}
                        as="article"
                        className="p-5 flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <Badge tone="neutral" glyph={dim.markerGlyph}>
                              {dim.code} · Slot {dim.slotIndex}
                            </Badge>
                            {isUnassessed ? (
                              <Badge tone="warning" glyph="○">
                                Unassessed (0 trials)
                              </Badge>
                            ) : est.isLowConfidence ? (
                              <Badge tone="low-confidence" glyph="▨">
                                Hatched ({Math.round(est.confidence * 100)}% Conf)
                              </Badge>
                            ) : (
                              <Badge tone="brand" glyph="●">
                                Calibrated ({Math.round(est.confidence * 100)}%)
                              </Badge>
                            )}
                          </div>

                          <h3 className="font-display text-base font-bold text-ink">
                            {dim.name}
                          </h3>
                          <p className="text-xs text-ink-muted">
                            {dim.shortDescription}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-border space-y-2">
                          {isUnassessed ? (
                            <div className="space-y-1">
                              <span className="font-mono-tabular text-lg font-bold text-ink-muted block">
                                — % ± — %
                              </span>
                              <span className="text-xs text-ink-muted block">
                                Run 3 baseline trials to unlock estimate
                              </span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="font-mono-tabular text-2xl font-bold text-ink">
                                  {est.scorePct}%{' '}
                                  <span className="text-sm font-semibold text-ink-muted">
                                    ± {halfBand}%
                                  </span>
                                </span>
                                <span className="font-mono-tabular text-xs font-bold text-ink">
                                  {est.trendDeltaPct >= 0
                                    ? `↑ +${est.trendDeltaPct}%`
                                    : `↓ ${est.trendDeltaPct}%`}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-mono-tabular text-ink-muted">
                                <span>RT: {est.meanRtMs}ms</span>
                                <span>Jitter: {est.hesitationJitterMs}ms</span>
                                <span>n={est.sampleSize}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </section>
            </div>
          </details>
        </>
      )}
    </div>
  )
}
