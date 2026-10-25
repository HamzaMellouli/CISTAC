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
    showMascot,
  } = useAppStore()

  const [viewState, setViewState] = useState<DashboardViewState>(() => {
    if (activePersona === 'noisy-low-confidence') return 'low-confidence'
    if (activePersona === 'edge-missing-dim') return 'partial'
    if (activePersona === 'new-user') return 'empty'
    return 'calibrated'
  })

  // Progressive Disclosure Section Tab Filter ('all' by default for full DOM visibility and test suites)
  const [dashboardTab, setDashboardTab] = useState<
    'all' | 'overview' | 'dimensions' | 'habits'
  >('all')

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

  const hatchedCount = useMemo(
    () => estimates.filter((e) => e.isLowConfidence).length,
    [estimates],
  )

  const handleSelectViewState = (next: DashboardViewState) => {
    setViewState(next)
    if (next === 'calibrated') setActivePersona('steady-improver')
    if (next === 'low-confidence') setActivePersona('noisy-low-confidence')
    if (next === 'partial') setActivePersona('edge-missing-dim')
    if (next === 'empty') setActivePersona('new-user')
  }

  return (
    <div className="space-y-6">
      {/* Top Command Center Header + KPI Summary Pills + State Switcher */}
      <Card variant="hero" className="p-6 space-y-4 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-4 min-w-0">
          <div className="space-y-2 max-w-3xl min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="reward" glyph="★">
                Cognitive Growth Command Center · Layer C + Brain Twin
              </Badge>
              <Badge
                tone={overallConfidencePct >= 60 ? 'brand' : 'low-confidence'}
                glyph={overallConfidencePct >= 60 ? '●' : '▨'}
              >
                Overall Twin Confidence: {overallConfidencePct}% (
                {hatchedCount} Hatched)
              </Badge>
              <Badge tone="info" glyph="◈">
                SAT-JEPA Cluster C5 · Analytical Builder
              </Badge>
            </div>
            <h1 className="font-display text-3xl font-bold text-ink tracking-tight">
              Your evolving cognitive twin—live confidence bands, trajectory
              fan, and explainable coaching.
            </h1>
            <p className="text-sm text-ink-muted">
              Every score is a percentage estimate with a 95% confidence
              interval (<code className="font-mono-tabular">±CI</code>).
              Dimensions below 60% confidence use diagonal SVG hatching until 2
              more micro-blocks are logged.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/onboarding"
              className="tactile-btn bg-brand text-brand-ink px-4 py-2.5 text-sm font-semibold no-underline inline-flex items-center"
            >
              ⚡ Start Next 2-Min Block →
            </Link>
            <Link
              to="/"
              className="tactile-btn bg-surface text-ink px-3.5 py-2 text-sm font-semibold no-underline inline-flex items-center"
            >
              ← Welcome
            </Link>
          </div>
        </div>

        {/* Interactive Persona & Dashboard State Switcher */}
        <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
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
                className={`focus-ring min-h-11 px-2.5 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                  viewState === tab.id
                    ? 'bg-brand text-brand-ink border-border-strong shadow-sm'
                    : 'bg-surface-raised text-ink border-border hover:bg-canvas'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="font-mono-tabular text-xs font-semibold text-ink-muted">
            Active Registry: {activeDimensions.length} Dimensions · Collab Score:{' '}
            {SAMPLE_COLLABORATION_SCORE.totalScore} ± 4
          </span>
        </div>
      </Card>

      {/* Progressive Disclosure Section Tab Filter */}
      {(viewState === 'calibrated' ||
        viewState === 'low-confidence' ||
        viewState === 'partial') && (
        <nav
          aria-label="Dashboard view sections"
          className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-surface-raised border border-border shadow-sm w-fit"
        >
          <button
            type="button"
            aria-pressed={dashboardTab === 'all'}
            onClick={() => setDashboardTab('all')}
            className={`focus-ring min-h-11 px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              dashboardTab === 'all'
                ? 'bg-brand text-brand-ink shadow-sm'
                : 'bg-transparent text-ink hover:bg-canvas'
            }`}
          >
            All (Full View)
          </button>
          <button
            type="button"
            aria-pressed={dashboardTab === 'overview'}
            onClick={() => setDashboardTab('overview')}
            className={`focus-ring min-h-11 px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              dashboardTab === 'overview'
                ? 'bg-brand text-brand-ink shadow-sm'
                : 'bg-transparent text-ink hover:bg-canvas'
            }`}
          >
            Overview &amp; Twin Charts
          </button>
          <button
            type="button"
            aria-pressed={dashboardTab === 'dimensions'}
            onClick={() => setDashboardTab('dimensions')}
            className={`focus-ring min-h-11 px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              dashboardTab === 'dimensions'
                ? 'bg-brand text-brand-ink shadow-sm'
                : 'bg-transparent text-ink hover:bg-canvas'
            }`}
          >
            {activeDimensions.length} Cognitive Dimensions
          </button>
          <button
            type="button"
            aria-pressed={dashboardTab === 'habits'}
            onClick={() => setDashboardTab('habits')}
            className={`focus-ring min-h-11 px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              dashboardTab === 'habits'
                ? 'bg-brand text-brand-ink shadow-sm'
                : 'bg-transparent text-ink hover:bg-canvas'
            }`}
          >
            Habit Heatmap &amp; Collaboration
          </button>
        </nav>
      )}

      {/* STATE: LOADING SKELETON */}
      {viewState === 'loading' && (
        <div
          role="status"
          aria-label="Loading dashboard telemetry"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          <Card className="lg:col-span-5 p-6 h-96 flex flex-col justify-between">
            <div className="h-6 w-48 rounded-sm bg-surface-raised" />
            <div className="h-56 w-56 mx-auto rounded-pill border-4 border-border" />
            <div className="h-4 w-64 mx-auto rounded-sm bg-surface-raised" />
          </Card>
          <Card className="lg:col-span-7 p-6 h-96 flex flex-col justify-between">
            <div className="h-6 w-64 rounded-sm bg-surface-raised" />
            <div className="h-48 w-full rounded-md bg-surface-raised" />
            <div className="h-20 w-full rounded-md bg-surface-raised" />
          </Card>
        </div>
      )}

      {/* STATE: EMPTY (NEW LEARNER) */}
      {viewState === 'empty' && (
        <Card className="p-8 text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-pill bg-brand-subtle text-brand text-3xl font-bold">
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
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-pill bg-danger text-surface text-3xl font-bold">
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

      {/* MAIN DASHBOARD COMMAND GRID (Calibrated, Low-Confidence Hatched, or Partial) */}
      {(viewState === 'calibrated' ||
        viewState === 'low-confidence' ||
        viewState === 'partial') && (
        <>
          {/* ROW 1 (5:7 Asymmetric Split): Uncertainty Radar + Companion Slot vs. Projection Fan + Coach Spotlight */}
          {(dashboardTab === 'all' || dashboardTab === 'overview') && (
            <section
              aria-labelledby="dashboard-row1-heading"
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              <h2 id="dashboard-row1-heading" className="sr-only">
                Primary Brain Twin Radar and Growth Trajectory Fan
              </h2>
              {/* Left 5 Cols: Signature #1 Uncertainty Radar + SAT-JEPA Latent State + Mascot Companion Guide Slot */}
              <div className="lg:col-span-5 min-w-0 flex flex-col justify-between gap-4">
                <UncertaintyRadar
                  dimensions={activeDimensions}
                  estimates={estimates}
                  title="Multi-Dimensional Brain Twin Radar"
                />

                {/* SAT-JEPA Latent State & Archetype Hysteresis Card */}
                <Card className="p-5 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="font-display text-sm font-bold text-ink">
                      SAT-JEPA Latent Twin State &amp; Hysteresis
                    </strong>
                    <Badge tone="info" glyph="◈">
                      Cluster C5 · 3/3 Sessions Stable
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono-tabular">
                    <div className="rounded-xl border border-border bg-canvas p-2.5">
                      <span className="text-ink-muted block">Prototype Δc</span>
                      <strong className="text-ink">+0.18 (Dual-Stream)</strong>
                    </div>
                    <div className="rounded-xl border border-border bg-canvas p-2.5">
                      <span className="text-ink-muted block">Hysteresis Lock</span>
                      <strong className="text-ink">Confirmed (4 Wks)</strong>
                    </div>
                  </div>
                </Card>

                {/* Reserved Companion Guide Slot */}
                {showMascot && (
                  <Card
                    data-mascot-slot="dashboard-companion"
                    className="p-5 bg-surface-raised flex items-start gap-3.5"
                  >
                    <div
                      aria-hidden="true"
                      className="h-12 w-12 shrink-0 rounded-xl border border-border-strong bg-reward text-reward-ink flex items-center justify-center font-display text-lg font-bold shadow-sm"
                    >
                      ✦
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="font-display text-sm font-bold text-ink">
                          Companion Guide ·{' '}
                          {viewState === 'low-confidence'
                            ? 'State: Rest & Calibrate'
                            : 'State: Encouraging Progress'}
                        </strong>
                        <Badge
                          tone={
                            viewState === 'low-confidence' ? 'warning' : 'brand'
                          }
                          glyph={viewState === 'low-confidence' ? '◐' : '●'}
                        >
                          {viewState === 'low-confidence'
                            ? 'Rest-First Pacing'
                            : 'Ready for +1 Level'}
                        </Badge>
                      </div>
                      <p className="text-xs text-ink-muted">
                        {viewState === 'low-confidence'
                          ? '“Four of your dimensions have wide hatched intervals (±16%) from late-evening blocks. A relaxed 2-minute morning session will cut that uncertainty in half!”'
                          : '“Your Working Memory and Attention confidence bands narrowed to ±5% this week. Two quick lure trials in Episodic Separation will graduate its hatched band to solid!”'}
                      </p>
                    </div>
                  </Card>
                )}
              </div>

              {/* Right 7 Cols: Signature #4 Projection Fan Chart + Signature #3 WhyThisPanel Coach Spotlight */}
              <div className="lg:col-span-7 min-w-0 flex flex-col justify-between gap-4">
                <ProjectionFanChart
                  dimensions={activeDimensions}
                  persona={effectivePersona}
                />

                <WhyThisPanel
                  trail={SAMPLE_WHY_THIS_TRAIL}
                  title="Today's Priority AI Coach Recommendation (5-Part Reasoning Trail)"
                  showSummaryUpfront={true}
                  defaultExpanded={false}
                />
              </div>
            </section>
          )}

          {/* ROW 2: ADAPTIVE COGNITIVE DIMENSION CARDS GRID (3 / 6 / 7 / 8 / 10 Dimensions) */}
          {(dashboardTab === 'all' || dashboardTab === 'dimensions') && (
            <section
              aria-labelledby="dimension-cards-heading"
              className="space-y-4"
            >
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2
                    id="dimension-cards-heading"
                    className="font-display text-2xl font-bold text-ink"
                  >
                    Configured Cognitive Dimensions ({activeDimensions.length}{' '}
                    Active)
                  </h2>
                  <p className="text-sm text-ink-muted">
                    Each card pairs an colorblind-safe Okabe-Ito token, unique
                    vertex glyph, 95% confidence interval, and reaction-time
                    telemetry.
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
          )}

          {/* ROW 3 (7:5 Split): Session Fatigue Heatmap + 0–100 AI Collaboration Score Breakdown */}
          {(dashboardTab === 'all' || dashboardTab === 'habits') && (
            <section
              aria-labelledby="dashboard-row3-heading"
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              <h2 id="dashboard-row3-heading" className="sr-only">
                Session Fatigue Heatmap and AI Collaboration Score
              </h2>
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
                        Dynamic 5-dimension rubric tracking how critically and
                        autonomously you collaborate with the AI Coach.
                      </p>
                    </div>
                    <Badge tone="neutral" glyph="◈">
                      {SAMPLE_COLLABORATION_SCORE.statusBadge}
                    </Badge>
                  </div>

                  {/* 5 Sub-Score Bars */}
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
                        <div className="h-2.5 w-full rounded-pill bg-surface-raised border border-border overflow-hidden">
                          <div
                            className="h-full bg-brand"
                            style={{ width: `${sub.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Weekly Goal & Formula Proof Footer */}
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
                      2 morning Mnemonic Similarity blocks remaining this week (no
                      punitive streaks).
                    </p>
                  </div>

                  <p className="font-mono-tabular text-xs text-ink-muted m-0">
                    {SAMPLE_COLLABORATION_SCORE.formulaDisplay}
                  </p>
                </div>
              </Card>
            </section>
          )}
        </>
      )}
    </div>
  )
}
