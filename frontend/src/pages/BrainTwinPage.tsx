import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BrainTwinTimeTravel,
  buildHistoricalSnapshots,
} from '../components/signature/BrainTwinTimeTravel'
import { Mascot } from '../components/signature/Mascot'
import { UncertaintyRadar } from '../components/signature/UncertaintyRadar'
import { WhyThisPanel } from '../components/signature/WhyThisPanel'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { getDimensionsByPreset } from '../config/dimensions'
import {
  buildEstimatesForDimensions,
  SAMPLE_WHY_THIS_TRAIL,
} from '../services/mocks/fixtures'
import { useAppStore, type PersonaId } from '../store/useAppStore'

type PreviewState =
  | 'live'
  | 'early-snapshot'
  | 'loading'
  | 'empty'
  | 'error'
  | 'extreme-text'

const PERSONA_OPTIONS: { id: PersonaId; label: string; tag: string }[] = [
  { id: 'steady-improver', label: 'Youssef (Steady Improver)', tag: '86% Conf' },
  { id: 'new-user', label: 'Salma (First Session)', tag: '48% Conf' },
  {
    id: 'noisy-low-confidence',
    label: 'Rami (Noisy / High Fatigue)',
    tag: '54% Conf',
  },
  { id: 'edge-missing-dim', label: 'Partial (Missing Dim)', tag: 'Partial' },
  { id: 'edge-10-dimensions', label: '10-Dim Stress', tag: '10 Axes' },
  { id: 'edge-llm-offline', label: 'Offline / Rule Engine', tag: 'Fallback' },
]

export default function BrainTwinPage() {
  const {
    dimensionPreset,
    setDimensionPreset,
    activePersona,
    setActivePersona,
    showMascot,
  } = useAppStore()

  const [previewState, setPreviewState] = useState<PreviewState>('live')
  const [selectedSnapIndex, setSelectedSnapIndex] = useState<number>(14)
  const [compareAnchorIndex, setCompareAnchorIndex] = useState<number>(1)

  const activeDimensions = useMemo(
    () => getDimensionsByPreset(dimensionPreset),
    [dimensionPreset],
  )

  const baseEstimates = useMemo(
    () => buildEstimatesForDimensions(activeDimensions, activePersona),
    [activeDimensions, activePersona],
  )

  const snapshots = useMemo(
    () => buildHistoricalSnapshots(activeDimensions, baseEstimates),
    [activeDimensions, baseEstimates],
  )

  const selectedSnap = useMemo(
    () =>
      snapshots.find((s) => s.snapshotIndex === selectedSnapIndex) ??
      snapshots[snapshots.length - 1]!,
    [snapshots, selectedSnapIndex],
  )

  const anchorSnap = useMemo(
    () =>
      snapshots.find((s) => s.snapshotIndex === compareAnchorIndex) ??
      snapshots[0]!,
    [snapshots, compareAnchorIndex],
  )

  const meanConfPct = useMemo(() => {
    const sum = selectedSnap.estimates.reduce((acc, e) => acc + e.confidence, 0)
    return Math.round((sum / Math.max(1, selectedSnap.estimates.length)) * 100)
  }, [selectedSnap])

  const hatchedCount = useMemo(
    () => selectedSnap.estimates.filter((e) => e.confidence < 0.6).length,
    [selectedSnap],
  )

  const snapshotProvenanceJson = useMemo(
    () => ({
      endpoint: 'GET /v1/dashboard/profile?include_history=true',
      snapshot_id: selectedSnap.snapshotId,
      snapshot_index: selectedSnap.snapshotIndex,
      total_snapshots: snapshots.length,
      recorded_at: selectedSnap.recordedAt,
      model_version: 'sat-jepa-v1.4-quest',
      archetype_cluster: selectedSnap.archetypeLabel,
      cosine_similarity: selectedSnap.cosineSimilarity,
      hysteresis_hold_sessions: `${selectedSnap.hysteresisHoldCount}/3`,
      mean_confidence_pct: meanConfPct,
      hatched_dimensions_count: hatchedCount,
      prev_hash: 'sha256:4a9c8e12b03d...7f19',
      state_hash: `sha256:9f2b7d0${selectedSnap.snapshotIndex}e84...c301`,
    }),
    [selectedSnap, snapshots.length, meanConfPct, hatchedCount],
  )

  return (
    <div className="space-y-8 min-w-0">
      {/* 1. HERO HEADER & PERSONA / STATE SWITCHER */}
      <Card
        as="section"
        aria-labelledby="brain-twin-heading"
        className="p-6 space-y-5 min-w-0"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="reward" glyph="★">
                Layer A→B Longitudinal Brain Twin · 14 Snapshots
              </Badge>
              <Badge tone="brand" glyph="●">
                Active: Snap #{selectedSnap.snapshotIndex} ({selectedSnap.label})
              </Badge>
              <Badge
                tone={hatchedCount === 0 ? 'success' : 'warning'}
                glyph={hatchedCount === 0 ? '✓' : '⚡'}
              >
                {hatchedCount === 0
                  ? 'All Dimensions ≥60% Conf (Solid)'
                  : `${hatchedCount} Hatched (<60% Conf)`}
              </Badge>
            </div>
            <h1
              id="brain-twin-heading"
              className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight break-words"
            >
              Longitudinal Brain Twin &amp; Time-Travel Studio
            </h1>
            <p className="text-base text-ink-muted">
              Scrub across 14 historical SAT-JEPA snapshots (
              <code className="font-mono-tabular">s_t → c_t</code>), compare any
              two checkpoints side-by-side, and inspect how your 95% confidence
              intervals narrow as trial evidence accumulates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/dimensions/${activeDimensions[0]?.id ?? 'working_memory'}`}
              className="tactile-btn bg-brand text-brand-ink px-4 py-2.5 text-sm font-semibold no-underline inline-flex items-center"
            >
              Inspect {activeDimensions[0]?.code ?? 'WM'} Detail →
            </Link>
            <Link
              to="/coach"
              className="tactile-btn bg-surface text-ink hover:bg-surface-raised px-3.5 py-2.5 text-sm font-semibold no-underline inline-flex items-center"
            >
              Open AI Coach →
            </Link>
          </div>
        </div>

        {/* Persona + Preview State Controls */}
        <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <div
            role="group"
            aria-label="Select seeded Brain Twin persona"
            className="flex flex-wrap items-center gap-1.5"
          >
            <span className="font-mono-tabular text-xs font-semibold text-ink-muted me-1">
              Persona:
            </span>
            {PERSONA_OPTIONS.map((p) => {
              const isSelected = activePersona === p.id
              return (
                <Button
                  key={p.id}
                  size="sm"
                  variant={isSelected ? 'primary' : 'secondary'}
                  aria-pressed={isSelected}
                  onClick={() => {
                    setActivePersona(p.id)
                    if (p.id === 'edge-10-dimensions') {
                      setDimensionPreset('10')
                    }
                  }}
                >
                  {p.label}
                </Button>
              )
            })}
          </div>

          <div
            role="group"
            aria-label="Brain Twin preview state switcher"
            className="flex flex-wrap items-center gap-1.5"
          >
            {(
              [
                { id: 'live', label: '1 · Snap #14 vs #1 (Live)' },
                { id: 'early-snapshot', label: '2 · Scrub to Snap #1 (Hatched)' },
                { id: 'loading', label: 'Loading' },
                { id: 'empty', label: 'Empty' },
                { id: 'error', label: 'Error' },
                { id: 'extreme-text', label: 'Extreme' },
              ] as const
            ).map((st) => (
              <Button
                key={st.id}
                size="sm"
                variant={previewState === st.id ? 'reward' : 'secondary'}
                aria-pressed={previewState === st.id}
                onClick={() => {
                  setPreviewState(st.id)
                  if (st.id === 'early-snapshot') {
                    setSelectedSnapIndex(1)
                    setCompareAnchorIndex(14)
                  } else if (st.id === 'live') {
                    setSelectedSnapIndex(14)
                    setCompareAnchorIndex(1)
                  }
                }}
              >
                {st.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* STATE: LOADING SKELETON */}
      {previewState === 'loading' && (
        <Card
          role="status"
          aria-label="Loading historical Brain Twin snapshot chain"
          className="p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold text-ink">
              Reconstructing 14-Snapshot SAT-JEPA Trajectory (
              <code className="font-mono-tabular">s_1 … s_14</code>)…
            </span>
            <Badge tone="info" glyph="◌">
              Loading Chain
            </Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 h-72 rounded-md border-2 border-border bg-surface-raised" />
            <div className="lg:col-span-5 h-72 rounded-md border-2 border-border bg-surface-raised" />
          </div>
        </Card>
      )}

      {/* STATE: EMPTY (COLD-START 0 SNAPSHOTS) */}
      {previewState === 'empty' && (
        <Card className="p-6 space-y-4">
          <Badge tone="warning" glyph="◌">
            Cold-Start · 0 Snapshots Recorded Yet
          </Badge>
          <h2 className="font-display text-2xl font-bold text-ink">
            Your Longitudinal Brain Twin Timeline Starts After Block #1
          </h2>
          <p className="text-sm text-ink-muted max-w-2xl">
            Complete a 2-minute non-biometric baseline block in the Assessment
            Hub to mint Snapshot #1 and unlock historical time-travel scrubbing.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/assessment"
              className="tactile-btn bg-brand text-brand-ink px-4 py-2.5 text-sm font-semibold no-underline inline-flex items-center"
            >
              Launch First 90s Calibration Block →
            </Link>
            <Button variant="secondary" onClick={() => setPreviewState('live')}>
              Restore 14-Snapshot Demo Chain
            </Button>
          </div>
        </Card>
      )}

      {/* STATE: ERROR BOUNDARY */}
      {previewState === 'error' && (
        <Card
          role="alert"
          className="p-6 border-2 border-danger bg-danger-subtle space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-bold text-ink">
              ✕ Historical Snapshot Chain Sync Timeout (HTTP 504)
            </h2>
            <Badge tone="warning" glyph="⚡">
              Local Snapshot Cache Active
            </Badge>
          </div>
          <p className="text-sm text-ink">
            Could not fetch remote snapshot history from{' '}
            <code className="font-mono-tabular">
              GET /v1/dashboard/profile?include_history=true
            </code>
            . Showing the 14-snapshot sample history.
          </p>
          <Button variant="primary" onClick={() => setPreviewState('live')}>
            Retry &amp; Restore Live Scrubber
          </Button>
        </Card>
      )}

      {/* STATE: EXTREME-TEXT STRESS TEST */}
      {previewState === 'extreme-text' && (
        <Card className="p-6 space-y-3 min-w-0">
          <Badge tone="info" glyph="◈">
            365-Day Longitudinal &amp; 10-Dimension Stress Test
          </Badge>
          <h2 className="font-display text-xl font-bold text-ink break-words">
            Snapshot No. 365 (2026-10-24T23:59:59Z) · Multi-Hop Relational &amp;
            Orthogonal Pattern Separation Convergence
          </h2>
          <p className="font-mono-tabular text-lg font-bold text-ink break-words">
            Δc = +18.4% ± 1.2% · Cosine Similarity: 0.942 · Hysteresis Lock:
            14/14 Consecutive Sessions Verified
          </p>
        </Card>
      )}

      {/* ROW 1: SIGNATURE #2 <BrainTwinTimeTravel /> (7 Cols) + TIME-SCRUBBED RADAR & PROVENANCE (5 Cols) */}
      {(previewState === 'live' ||
        previewState === 'early-snapshot' ||
        previewState === 'extreme-text') && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 7 Columns: Signature #2 <BrainTwinTimeTravel /> + 2D Manifold */}
            <div className="lg:col-span-7 min-w-0 flex flex-col justify-between gap-6">
              <BrainTwinTimeTravel
                snapshots={snapshots}
                dimensions={activeDimensions}
                selectedSnapIndex={selectedSnap.snapshotIndex}
                onSelectSnapIndex={setSelectedSnapIndex}
                compareAnchorIndex={anchorSnap.snapshotIndex}
                onSelectCompareAnchorIndex={setCompareAnchorIndex}
              />
            </div>

            {/* Right 5 Columns: Time-Scrubbed <UncertaintyRadar /> + Milestone Cadence + Cryptographic Provenance Card */}
            <div className="lg:col-span-5 min-w-0 flex flex-col justify-between gap-6">
              <UncertaintyRadar
                dimensions={activeDimensions}
                estimates={selectedSnap.estimates}
                title={`Time-Scrubbed Radar · Snap #${selectedSnap.snapshotIndex} (${selectedSnap.shortDate})`}
              />

              <Card
                as="section"
                aria-labelledby="milestone-cadence-heading"
                className="p-5 space-y-3 min-w-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2
                    id="milestone-cadence-heading"
                    className="font-display text-base font-bold text-ink"
                  >
                    Snapshot Milestone &amp; QUEST+ Cadence
                  </h2>
                  <Badge tone="reward" glyph="★">
                    {selectedSnap.milestoneTag}
                  </Badge>
                </div>
                <p className="text-xs text-ink-muted">
                  Each snapshot records a non-biometric 90-second calibration
                  checkpoint and updates the posterior confidence intervals (
                  <code className="font-mono-tabular">±CI</code>) across all{' '}
                  {activeDimensions.length} active dimensions.
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono-tabular">
                  <div className="rounded-sm border border-border bg-canvas p-2.5">
                    <span className="text-ink-muted block">Checkpoint</span>
                    <strong className="text-ink">
                      #{selectedSnap.snapshotIndex} / {snapshots.length}
                    </strong>
                  </div>
                  <div className="rounded-sm border border-border bg-canvas p-2.5">
                    <span className="text-ink-muted block">Mean Conf</span>
                    <strong className="text-ink">{meanConfPct}%</strong>
                  </div>
                  <div className="rounded-sm border border-border bg-canvas p-2.5">
                    <span className="text-ink-muted block">Hysteresis</span>
                    <strong className="text-ink">
                      {selectedSnap.hysteresisHoldCount}/3 Sessions
                    </strong>
                  </div>
                </div>
              </Card>

              <Card
                as="section"
                aria-labelledby="snapshot-provenance-heading"
                className="p-5 space-y-3.5 min-w-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2
                      id="snapshot-provenance-heading"
                      className="font-display text-base font-bold text-ink"
                    >
                      Cryptographic Snapshot Provenance &amp; Audit
                    </h2>
                    <p className="text-xs text-ink-muted">
                      Immutable hash chain for Snapshot #
                      {selectedSnap.snapshotIndex} ({selectedSnap.snapshotId}).
                    </p>
                  </div>
                  <Badge tone="info" glyph="✓">
                    SHA-256 Verified
                  </Badge>
                </div>

                <pre
                  tabIndex={0}
                  role="region"
                  aria-label="Snapshot cryptographic provenance JSON payload"
                  className="focus-ring rounded-sm border border-border bg-canvas p-3 text-xs font-mono-tabular text-ink overflow-x-auto whitespace-pre-wrap break-words max-h-48"
                >
                  <code>{JSON.stringify(snapshotProvenanceJson, null, 2)}</code>
                </pre>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <Link
                    to="/privacy"
                    className="font-semibold text-brand hover:underline"
                  >
                    Manage Retention &amp; Export in Privacy Center →
                  </Link>
                  <span className="font-mono-tabular text-ink-muted">
                    Model: sat-jepa-v1.4
                  </span>
                </div>
              </Card>
            </div>
          </div>

          {/* ROW 2: LONGITUDINAL EXPLAINABILITY (<WhyThisPanel /> 7 Cols + Companion & Convergence Summary 5 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 min-w-0 flex flex-col justify-between gap-4">
              <WhyThisPanel
                trail={SAMPLE_WHY_THIS_TRAIL}
                title={`Why Your Twin Shifted Between Snap #${anchorSnap.snapshotIndex} and Snap #${selectedSnap.snapshotIndex} (5-Part Trail)`}
                defaultExpanded
              />
            </div>

            <div className="lg:col-span-5 min-w-0 flex flex-col justify-between gap-4">
              {showMascot && (
                <Mascot
                  state={selectedSnap.snapshotIndex >= 11 ? 'celebrate' : 'thinking'}
                  size="md"
                  title={`Synapse Companion · Snapshot #${selectedSnap.snapshotIndex} Insight`}
                  badgeLabel={`Conf: ${meanConfPct}%`}
                  message={`“Between Snapshot #${anchorSnap.snapshotIndex} (${anchorSnap.shortDate}) and Snapshot #${selectedSnap.snapshotIndex} (${selectedSnap.shortDate}), your mean epistemic confidence reached ${meanConfPct}% across ${activeDimensions.length} dimensions. Scrub back to Snap #1 anytime to see how wide your initial uncertainty bands were!”`}
                />
              )}

              <Card className="p-5 space-y-3 min-w-0 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-base font-bold text-ink">
                      Longitudinal Uncertainty Convergence
                    </h3>
                    <Badge tone="brand" glyph="●">
                      Mean Conf: {meanConfPct}%
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-muted">
                    Dimensions graduate from diagonal SVG hatching (
                    <code className="font-mono-tabular">&lt;60%</code>{' '}
                    provisional confidence) to solid fills once QUEST+ posterior
                    entropy drops below the stability threshold.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono-tabular">
                  <div className="rounded-sm border border-border bg-canvas p-2.5">
                    <span className="text-ink-muted block">Solid Axes</span>
                    <strong className="text-ink">
                      {activeDimensions.length - hatchedCount} /{' '}
                      {activeDimensions.length} Dimensions
                    </strong>
                  </div>
                  <div className="rounded-sm border border-border bg-canvas p-2.5">
                    <span className="text-ink-muted block">Hatched Axes</span>
                    <strong className="text-ink">
                      {hatchedCount} Provisional
                    </strong>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
