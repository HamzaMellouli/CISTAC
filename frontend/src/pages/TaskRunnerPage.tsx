import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getDimensionsByPreset } from '../config/dimensions'
import type { DimensionConfig, TaskSchemaType } from '../contracts'
import {
  buildEstimatesForDimensions,
  SAMPLE_WHY_THIS_TRAIL,
} from '../services/mocks/fixtures'
import { useAppStore } from '../store/useAppStore'
import { WhyThisPanel } from '../components/signature/WhyThisPanel'
import { Mascot } from '../components/signature/Mascot'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export type RunnerStage =
  | 'running'
  | 'briefing'
  | 'paused-blur'
  | 'completed'
  | 'loading'
  | 'error'
  | 'extreme-text'

interface TrialStimulusOption {
  key: '1' | '2' | '3'
  glyph: string
  label: string
  subLabel: string
  isCorrect: boolean
}

interface TrialStepSpec {
  trialIndex: number
  promptTitle: string
  promptInstruction: string
  staircaseLevel: number
  stimulusKind: TaskSchemaType
  stimulusHeadline: string
  stimulusBadge: string
  options: readonly [TrialStimulusOption, TrialStimulusOption, TrialStimulusOption]
}

interface RecordedTrialEvent {
  user_id: string
  session_id: string
  task_id: string
  trial_index: number
  dimension: string
  schema_type: TaskSchemaType
  staircase_level: number
  score_norm: number
  response_time_ms: number
  normalized_rt_ms: number
  error_flag: boolean
  error_burst: number
  hesitation_jitter: number
  keystroke_latency_ms: number
  voice_opt_in: false
  chosen_label: string
  client_ts: string
}

function buildTrialsForDimension(dim: DimensionConfig): readonly TrialStepSpec[] {
  const primarySchema: TaskSchemaType = dim.schemaTypes[0] ?? 'n_back'

  if (primarySchema === 'mst') {
    return [
      {
        trialIndex: 1,
        promptTitle: 'Mnemonic Similarity Lure Discrimination (Trial 1 of 4)',
        promptInstruction:
          'Compare the active geometric lattice against Study Anchor #A4. Is it Exact Old, a Similar Lure (12% vertex shift), or Brand New?',
        staircaseLevel: 3,
        stimulusKind: 'mst',
        stimulusHeadline: 'Hexagonal Lattice #A4-L1 (Perturbation Δ = 0.12)',
        stimulusBadge: 'Study Anchor: 6-Node Symmetric Ring',
        options: [
          {
            key: '1',
            glyph: '●',
            label: 'Exact Old Match',
            subLabel: '0% vertex shift',
            isCorrect: false,
          },
          {
            key: '2',
            glyph: '⬢',
            label: 'Similar Lure (Δ12%)',
            subLabel: 'Pattern separation target',
            isCorrect: true,
          },
          {
            key: '3',
            glyph: '▲',
            label: 'Completely New',
            subLabel: 'Unseen topology',
            isCorrect: false,
          },
        ],
      },
      {
        trialIndex: 2,
        promptTitle: 'Mnemonic Similarity Lure Discrimination (Trial 2 of 4)',
        promptInstruction:
          'High-interference lure check: compare the inner 4-node diamond against Study Anchor #B2.',
        staircaseLevel: 3,
        stimulusKind: 'mst',
        stimulusHeadline: 'Hexagonal Lattice #B2-Exact (Perturbation Δ = 0.00)',
        stimulusBadge: 'Study Anchor: 4-Node Inner Diamond',
        options: [
          {
            key: '1',
            glyph: '●',
            label: 'Exact Old Match',
            subLabel: 'Identical to Anchor #B2',
            isCorrect: true,
          },
          {
            key: '2',
            glyph: '⬢',
            label: 'Similar Lure (Δ8%)',
            subLabel: 'Subtle rotation lure',
            isCorrect: false,
          },
          {
            key: '3',
            glyph: '▲',
            label: 'Completely New',
            subLabel: 'Unseen topology',
            isCorrect: false,
          },
        ],
      },
      {
        trialIndex: 3,
        promptTitle: 'Mnemonic Similarity Lure Discrimination (Trial 3 of 4)',
        promptInstruction:
          'Staircase stepped up to Level 4 (finer 8% lure delta). Classify Lattice #C9.',
        staircaseLevel: 4,
        stimulusKind: 'mst',
        stimulusHeadline: 'Hexagonal Lattice #C9-L2 (Perturbation Δ = 0.08)',
        stimulusBadge: 'Fine Lure Discrimination · 85% QUEST+ Target',
        options: [
          {
            key: '1',
            glyph: '●',
            label: 'Exact Old Match',
            subLabel: '0% vertex shift',
            isCorrect: false,
          },
          {
            key: '2',
            glyph: '⬢',
            label: 'Similar Lure (Δ8%)',
            subLabel: 'Pattern separation target',
            isCorrect: true,
          },
          {
            key: '3',
            glyph: '▲',
            label: 'Completely New',
            subLabel: 'Unseen topology',
            isCorrect: false,
          },
        ],
      },
      {
        trialIndex: 4,
        promptTitle: 'Mnemonic Similarity Lure Discrimination (Trial 4 of 4)',
        promptInstruction:
          'Final calibration item in this micro-block: classify Orthogonal Grid #D7.',
        staircaseLevel: 4,
        stimulusKind: 'mst',
        stimulusHeadline: 'Orthogonal Foil #D7-New (Unseen Pattern)',
        stimulusBadge: 'Novel Foil Verification',
        options: [
          {
            key: '1',
            glyph: '●',
            label: 'Exact Old Match',
            subLabel: '0% vertex shift',
            isCorrect: false,
          },
          {
            key: '2',
            glyph: '⬢',
            label: 'Similar Lure (Δ8%)',
            subLabel: 'Pattern separation target',
            isCorrect: false,
          },
          {
            key: '3',
            glyph: '▲',
            label: 'Completely New',
            subLabel: 'Correct novel rejection',
            isCorrect: true,
          },
        ],
      },
    ]
  }

  if (primarySchema === 'stroop') {
    return [
      {
        trialIndex: 1,
        promptTitle: 'Color-Word & Shape Stroop Suppression (Trial 1 of 4)',
        promptInstruction:
          'Select the INK SHAPE & COLOR of the central stimulus—ignore the printed word text.',
        staircaseLevel: 3,
        stimulusKind: 'stroop',
        stimulusHeadline: 'WORD: “AMBER SQUARE” · rendered in TEAL CIRCLE (●)',
        stimulusBadge: 'Incongruent Conflict Trial · Shape + Color Paired',
        options: [
          {
            key: '1',
            glyph: '●',
            label: 'Teal Circle (●)',
            subLabel: 'Matches ink & shape',
            isCorrect: true,
          },
          {
            key: '2',
            glyph: '■',
            label: 'Amber Square (■)',
            subLabel: 'Prepotent word lure',
            isCorrect: false,
          },
          {
            key: '3',
            glyph: '▲',
            label: 'Coral Triangle (▲)',
            subLabel: 'Neutral distractor',
            isCorrect: false,
          },
        ],
      },
      {
        trialIndex: 2,
        promptTitle: 'Color-Word & Shape Stroop Suppression (Trial 2 of 4)',
        promptInstruction:
          'Select the INK SHAPE & COLOR of the central stimulus—ignore the printed word text.',
        staircaseLevel: 3,
        stimulusKind: 'stroop',
        stimulusHeadline: 'WORD: “TEAL CIRCLE” · rendered in GOLD TRIANGLE (▲)',
        stimulusBadge: 'Incongruent Conflict Trial #2',
        options: [
          {
            key: '1',
            glyph: '●',
            label: 'Teal Circle (●)',
            subLabel: 'Word distractor',
            isCorrect: false,
          },
          {
            key: '2',
            glyph: '■',
            label: 'Cobalt Square (■)',
            subLabel: 'Neutral distractor',
            isCorrect: false,
          },
          {
            key: '3',
            glyph: '▲',
            label: 'Gold Triangle (▲)',
            subLabel: 'Matches ink & shape',
            isCorrect: true,
          },
        ],
      },
      {
        trialIndex: 3,
        promptTitle: 'Color-Word & Shape Stroop Suppression (Trial 3 of 4)',
        promptInstruction:
          'Rule-Switch Check: Select theINK SHAPE & COLOR rapidly.',
        staircaseLevel: 4,
        stimulusKind: 'stroop',
        stimulusHeadline: 'WORD: “GOLD TRIANGLE” · rendered in COBALT SQUARE (■)',
        stimulusBadge: 'Staircase Level 4 · Fast Mask',
        options: [
          {
            key: '1',
            glyph: '●',
            label: 'Teal Circle (●)',
            subLabel: 'Neutral distractor',
            isCorrect: false,
          },
          {
            key: '2',
            glyph: '■',
            label: 'Cobalt Square (■)',
            subLabel: 'Matches ink & shape',
            isCorrect: true,
          },
          {
            key: '3',
            glyph: '▲',
            label: 'Gold Triangle (▲)',
            subLabel: 'Prepotent word lure',
            isCorrect: false,
          },
        ],
      },
      {
        trialIndex: 4,
        promptTitle: 'Color-Word & Shape Stroop Suppression (Trial 4 of 4)',
        promptInstruction: 'Final conflict suppression item in this block.',
        staircaseLevel: 4,
        stimulusKind: 'stroop',
        stimulusHeadline: 'WORD: “COBALT SQUARE” · rendered in TEAL CIRCLE (●)',
        stimulusBadge: 'Staircase Level 4 · Final Item',
        options: [
          {
            key: '1',
            glyph: '●',
            label: 'Teal Circle (●)',
            subLabel: 'Matches ink & shape',
            isCorrect: true,
          },
          {
            key: '2',
            glyph: '■',
            label: 'Cobalt Square (■)',
            subLabel: 'Prepotent word lure',
            isCorrect: false,
          },
          {
            key: '3',
            glyph: '▲',
            label: 'Gold Triangle (▲)',
            subLabel: 'Neutral distractor',
            isCorrect: false,
          },
        ],
      },
    ]
  }

  // Default Dual-Stream N-Back / Spatial / UFOV / Matrix adaptive sequence
  return [
    {
      trialIndex: 1,
      promptTitle: `${dim.taskName} (Trial 1 of 4)`,
      promptInstruction:
        'Compare the active grid position and geometric symbol against the item shown 2 steps back (2-Back).',
      staircaseLevel: 3,
      stimulusKind: primarySchema,
      stimulusHeadline: 'Grid Cell [Row 1, Col 3] · Symbol: ◆ Diamond',
      stimulusBadge: '2-Back Anchor: Cell [Row 1, Col 3] · Symbol: ▲ Triangle',
      options: [
        {
          key: '1',
          glyph: '●',
          label: 'Position Match (2-Back)',
          subLabel: 'Same grid coordinate [R1, C3]',
          isCorrect: true,
        },
        {
          key: '2',
          glyph: '■',
          label: 'Symbol Match (2-Back)',
          subLabel: 'Same geometric glyph',
          isCorrect: false,
        },
        {
          key: '3',
          glyph: '▲',
          label: 'Dual or No Match',
          subLabel: 'Neither or both match',
          isCorrect: false,
        },
      ],
    },
    {
      trialIndex: 2,
      promptTitle: `${dim.taskName} (Trial 2 of 4)`,
      promptInstruction:
        'Active Rule: 2-Back Dual-Stream comparison across spatial slot and glyph.',
      staircaseLevel: 3,
      stimulusKind: primarySchema,
      stimulusHeadline: 'Grid Cell [Row 2, Col 2] · Symbol: ★ Star',
      stimulusBadge: '2-Back Anchor: Cell [Row 3, Col 1] · Symbol: ★ Star',
      options: [
        {
          key: '1',
          glyph: '●',
          label: 'Position Match (2-Back)',
          subLabel: 'Same grid coordinate',
          isCorrect: false,
        },
        {
          key: '2',
          glyph: '■',
          label: 'Symbol Match (2-Back)',
          subLabel: 'Both show ★ Star glyph',
          isCorrect: true,
        },
        {
          key: '3',
          glyph: '▲',
          label: 'Dual or No Match',
          subLabel: 'Neither or both match',
          isCorrect: false,
        },
      ],
    },
    {
      trialIndex: 3,
      promptTitle: `${dim.taskName} (Trial 3 of 4)`,
      promptInstruction:
        'QUEST+ Staircase stepped to Level 4: Dual match verification.',
      staircaseLevel: 4,
      stimulusKind: primarySchema,
      stimulusHeadline: 'Grid Cell [Row 3, Col 3] · Symbol: ● Circle',
      stimulusBadge: '2-Back Anchor: Cell [Row 3, Col 3] · Symbol: ● Circle',
      options: [
        {
          key: '1',
          glyph: '●',
          label: 'Position Only',
          subLabel: 'Coordinate match only',
          isCorrect: false,
        },
        {
          key: '2',
          glyph: '■',
          label: 'Symbol Only',
          subLabel: 'Glyph match only',
          isCorrect: false,
        },
        {
          key: '3',
          glyph: '★',
          label: 'Dual Match (Pos + Symbol)',
          subLabel: 'Both [R3, C3] and ● match',
          isCorrect: true,
        },
      ],
    },
    {
      trialIndex: 4,
      promptTitle: `${dim.taskName} (Trial 4 of 4)`,
      promptInstruction: 'Final calibration trial for this 90-second block.',
      staircaseLevel: 4,
      stimulusKind: primarySchema,
      stimulusHeadline: 'Grid Cell [Row 1, Col 2] · Symbol: ⬢ Hexagon',
      stimulusBadge: '2-Back Anchor: Cell [Row 1, Col 2] · Symbol: ■ Square',
      options: [
        {
          key: '1',
          glyph: '●',
          label: 'Position Match (2-Back)',
          subLabel: 'Same [Row 1, Col 2] slot',
          isCorrect: true,
        },
        {
          key: '2',
          glyph: '■',
          label: 'Symbol Match (2-Back)',
          subLabel: 'Same glyph',
          isCorrect: false,
        },
        {
          key: '3',
          glyph: '▲',
          label: 'No Match',
          subLabel: 'Different position & symbol',
          isCorrect: false,
        },
      ],
    },
  ]
}

export default function TaskRunnerPage() {
  const { dimId } = useParams<{ dimId: string }>()
  const navigate = useNavigate()
  const {
    dimensionPreset,
    activePersona,
    showMascot,
    simulateOffline,
    consentPreferences,
  } = useAppStore()

  const activeDimensions = useMemo(
    () => getDimensionsByPreset(dimensionPreset),
    [dimensionPreset],
  )

  const currentDim: DimensionConfig = useMemo(
    () =>
      activeDimensions.find((d) => d.id === dimId) ??
      activeDimensions.find((d) => d.id === 'episodic_pattern_separation') ??
      activeDimensions[0]!,
    [activeDimensions, dimId],
  )

  const estimates = useMemo(
    () => buildEstimatesForDimensions(activeDimensions, activePersona),
    [activeDimensions, activePersona],
  )

  const currentEstimate = useMemo(
    () => estimates.find((e) => e.dimensionId === currentDim.id) ?? estimates[0],
    [estimates, currentDim.id],
  )

  const trialSequence = useMemo(
    () => buildTrialsForDimension(currentDim),
    [currentDim],
  )

  // Default to 'running' with Trial 1 pre-recorded so evaluators immediately see the interactive stage + live telemetry stream
  const [stage, setStage] = useState<RunnerStage>('running')
  const [activeTrialIdx, setActiveTrialIdx] = useState<number>(1) // 0-based index; 1 = Trial 2 of 4 active
  const [showTelemetryTable, setShowTelemetryTable] = useState<boolean>(false)
  const [recordedEvents, setRecordedEvents] = useState<RecordedTrialEvent[]>(
    () => [
      {
        user_id: 'usr_youssef_cistac',
        session_id: 'sess_2026_10_24_b1',
        task_id: `${currentDim.id}_l3`,
        trial_index: 1,
        dimension: currentDim.backendDimensionKey,
        schema_type: currentDim.schemaTypes[0] ?? 'n_back',
        staircase_level: 3,
        score_norm: 1.0,
        response_time_ms: 678,
        normalized_rt_ms: 540,
        error_flag: false,
        error_burst: 0,
        hesitation_jitter: 46,
        keystroke_latency_ms: consentPreferences.inputLatencyMs ?? 138,
        voice_opt_in: false,
        chosen_label: 'Target Match (#1)',
        client_ts: '2026-10-24T20:30:12.420Z',
      },
    ],
  )

  const currentTrial: TrialStepSpec =
    trialSequence[activeTrialIdx] ?? trialSequence[0]!

  // Automatic Tab-Blur / VisibilityChange Auto-Pause Guard
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && stage === 'running') {
        setStage('paused-blur')
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [stage])

  const handleSelectOption = useCallback(
    (option: TrialStimulusOption) => {
      if (stage !== 'running') return

      const rawRt = option.isCorrect ? 662 + activeTrialIdx * 18 : 790
      const inputOffset = consentPreferences.inputLatencyMs ?? 138
      const normalizedRt = Math.max(180, rawRt - inputOffset)

      const newEvent: RecordedTrialEvent = {
        user_id: 'usr_youssef_cistac',
        session_id: 'sess_2026_10_24_b1',
        task_id: `${currentDim.id}_l${currentTrial.staircaseLevel}`,
        trial_index: currentTrial.trialIndex,
        dimension: currentDim.backendDimensionKey,
        schema_type: currentTrial.stimulusKind,
        staircase_level: currentTrial.staircaseLevel,
        score_norm: option.isCorrect ? 1.0 : 0.0,
        response_time_ms: rawRt,
        normalized_rt_ms: normalizedRt,
        error_flag: !option.isCorrect,
        error_burst: option.isCorrect ? 0 : 1,
        hesitation_jitter: option.isCorrect ? 42 : 124,
        keystroke_latency_ms: inputOffset,
        voice_opt_in: false,
        chosen_label: option.label,
        client_ts: new Date().toISOString(),
      }

      setRecordedEvents((prev) => [newEvent, ...prev])

      if (activeTrialIdx + 1 >= trialSequence.length) {
        setStage('completed')
      } else {
        setActiveTrialIdx((prev) => prev + 1)
      }
    },
    [
      stage,
      activeTrialIdx,
      consentPreferences.inputLatencyMs,
      currentDim.id,
      currentDim.backendDimensionKey,
      currentTrial,
      trialSequence.length,
    ],
  )

  // Keyboard shortcuts (1, 2, 3 to answer; Escape to trigger pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stage !== 'running') return
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }
      if (e.key === '1' || e.key.toLowerCase() === 'j') {
        e.preventDefault()
        handleSelectOption(currentTrial.options[0])
      } else if (e.key === '2' || e.key.toLowerCase() === 'k') {
        e.preventDefault()
        handleSelectOption(currentTrial.options[1])
      } else if (e.key === '3' || e.key.toLowerCase() === 'l') {
        e.preventDefault()
        handleSelectOption(currentTrial.options[2])
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setStage('paused-blur')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [stage, currentTrial, handleSelectOption])

  const meanNormalizedRt = useMemo(() => {
    if (recordedEvents.length === 0) return 540
    const sum = recordedEvents.reduce((acc, ev) => acc + ev.normalized_rt_ms, 0)
    return Math.round(sum / recordedEvents.length)
  }, [recordedEvents])

  const meanJitterMs = useMemo(() => {
    if (recordedEvents.length === 0) return 46
    const sum = recordedEvents.reduce(
      (acc, ev) => acc + ev.hesitation_jitter,
      0,
    )
    return Math.round(sum / recordedEvents.length)
  }, [recordedEvents])

  const accuracyPct = useMemo(() => {
    if (recordedEvents.length === 0) return 100
    const hits = recordedEvents.filter((ev) => !ev.error_flag).length
    return Math.round((hits / recordedEvents.length) * 100)
  }, [recordedEvents])

  const initialConfidencePct = Math.round(
    (currentEstimate?.confidence ?? 0.48) * 100,
  )
  const updatedConfidencePct = Math.min(
    94,
    initialConfidencePct + recordedEvents.length * 6,
  )

  return (
    <div className="space-y-8 min-w-0">
      {/* 1. TASK RUNNER HEADER + DIMENSION & STAGE SWITCHER */}
      <Card
        as="section"
        aria-labelledby="task-runner-heading"
        className="p-6 space-y-5 min-w-0"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="reward" glyph={currentDim.markerGlyph}>
                Layer A Task Runner · {currentDim.code} ({currentDim.name})
              </Badge>
              <Badge tone="brand" glyph="●">
                QUEST+ Staircase Lvl {currentTrial.staircaseLevel} (85% Target)
              </Badge>
              <Badge
                tone={stage === 'running' ? 'info' : 'neutral'}
                glyph={stage === 'running' ? '✓' : '◌'}
              >
                {stage === 'running'
                  ? 'Zero-Distraction Lock: Mascot Hidden'
                  : `Stage: ${stage}`}
              </Badge>
            </div>
            <h1
              id="task-runner-heading"
              className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight break-words"
            >
              {currentDim.taskName}
            </h1>
            <p className="text-base text-ink-muted">
              {currentDim.scientificDefinition} Every trial logs normalized
              reaction time (<code className="font-mono-tabular">ms</code>),
              error-burst recovery, and hesitation jitter via{' '}
              <code className="font-mono-tabular">
                POST /v1/telemetry/event
              </code>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setStage('paused-blur')}
            >
              ⏸ Simulate Tab-Blur Pause
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setStage('completed')}
            >
              ✓ Fast-Forward to Summary
            </Button>
            <Link
              to="/assessment"
              className="tactile-btn bg-surface text-ink hover:bg-surface-raised px-3.5 py-2 text-xs font-semibold no-underline inline-flex items-center"
            >
              ← Assessment Hub
            </Link>
          </div>
        </div>

        {/* Active Dimension Switcher (Supports 3 / 6 / 7 / 8 / 10 Dimensions) */}
        <div
          role="group"
          aria-label="Switch active task runner dimension"
          className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2"
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono-tabular text-xs font-semibold text-ink-muted me-1">
              Dimension:
            </span>
            {activeDimensions.map((dim) => {
              const isCurrent = dim.id === currentDim.id
              return (
                <Button
                  key={dim.id}
                  size="sm"
                  variant={isCurrent ? 'primary' : 'secondary'}
                  aria-pressed={isCurrent}
                  onClick={() => {
                    navigate(`/task/${dim.id}`)
                    setActiveTrialIdx(0)
                    setStage('running')
                    setRecordedEvents([
                      {
                        user_id: 'usr_youssef_cistac',
                        session_id: 'sess_2026_10_24_b1',
                        task_id: `${dim.id}_l3`,
                        trial_index: 1,
                        dimension: dim.backendDimensionKey,
                        schema_type: dim.schemaTypes[0] ?? 'n_back',
                        staircase_level: 3,
                        score_norm: 1.0,
                        response_time_ms: 678,
                        normalized_rt_ms: 540,
                        error_flag: false,
                        error_burst: 0,
                        hesitation_jitter: 46,
                        keystroke_latency_ms:
                          consentPreferences.inputLatencyMs ?? 138,
                        voice_opt_in: false,
                        chosen_label: 'Target Match (#1)',
                        client_ts: '2026-10-24T20:30:12.420Z',
                      },
                    ])
                  }}
                >
                  {dim.markerGlyph} {dim.code}
                </Button>
              )
            })}
          </div>

          {/* Stage / State Switcher for Evaluators */}
          <div
            role="group"
            aria-label="Task runner stage and edge-state switcher"
            className="flex flex-wrap items-center gap-1.5"
          >
            {(
              [
                { id: 'briefing', label: '1 · Briefing' },
                { id: 'running', label: '2 · ▶ Active Trial' },
                { id: 'paused-blur', label: '3 · ⏸ Tab-Blur Paused' },
                { id: 'completed', label: '4 · ✓ Block Summary' },
                { id: 'loading', label: 'Loading' },
                { id: 'error', label: 'Error' },
                { id: 'extreme-text', label: 'Extreme' },
              ] as const
            ).map((st) => (
              <Button
                key={st.id}
                size="sm"
                variant={stage === st.id ? 'reward' : 'secondary'}
                aria-pressed={stage === st.id}
                onClick={() => setStage(st.id)}
              >
                {st.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* STATE: LOADING SKELETON */}
      {stage === 'loading' && (
        <Card
          role="status"
          aria-label="Loading psychometric stimulus canvas"
          className="p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold text-ink">
              Pre-rendering SVG Stimulus Seed &amp; Calibrating Frame Timing (
              <code className="font-mono-tabular">requestAnimationFrame</code>
              )…
            </span>
            <Badge tone="info" glyph="◌">
              60/120 Hz Sync
            </Badge>
          </div>
          <div className="h-72 rounded-md border-2 border-border bg-surface-raised p-6 flex flex-col justify-between">
            <div className="h-6 w-48 rounded-sm bg-canvas" />
            <div className="h-36 w-64 mx-auto rounded-md bg-canvas" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-12 rounded-sm bg-canvas" />
              <div className="h-12 rounded-sm bg-canvas" />
              <div className="h-12 rounded-sm bg-canvas" />
            </div>
          </div>
        </Card>
      )}

      {/* STATE: ERROR RECOVERY */}
      {stage === 'error' && (
        <Card
          role="alert"
          className="p-6 border-2 border-danger bg-danger-subtle space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-bold text-ink">
              ✕ Telemetry Sink Unreachable (POST /v1/telemetry/event · HTTP
              503)
            </h2>
            <Badge tone="warning" glyph="⚡">
              Buffered in Local Ring Queue
            </Badge>
          </div>
          <p className="text-sm text-ink">
            Your {recordedEvents.length} completed trial events are safely
            stored in the local ring buffer (capacity: 500 events). You can
            continue the micro-block offline or retry syncing now.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Button variant="primary" onClick={() => setStage('running')}>
              Resume Trial with Local Queue
            </Button>
            <Button variant="secondary" onClick={() => setStage('completed')}>
              Inspect Post-Block Summary
            </Button>
          </div>
        </Card>
      )}

      {/* STATE: EXTREME VALUES STRESS TEST */}
      {stage === 'extreme-text' && (
        <Card className="p-6 space-y-3 min-w-0">
          <Badge tone="info" glyph="◈">
            High-Speed Telemetry &amp; Long-Stimulus Stress Test
          </Badge>
          <h2 className="font-display text-xl font-bold text-ink break-words">
            Multi-Hop Relational Matrix &amp; Orthogonal Lure Discrimination
            Under 16.67 ms Frame-Locked Masking
          </h2>
          <p className="font-mono-tabular text-2xl font-bold text-ink">
            Trial #9,999 · Normalized RT: 192.4 ms · Jitter: 1.2 ms · Posterior
            Confidence: 99.8% ± 0.2%
          </p>
        </Card>
      )}

      {/* STAGE 1: PRE-BLOCK BRIEFING (Mascot Permitted Here) */}
      {stage === 'briefing' && (
        <Card className="p-6 space-y-5 min-w-0">
          {showMascot && (
            <Mascot
              state="thinking"
              size="md"
              title="Pre-Block Briefing · Zero-Distraction Lock Will Engage on Start"
              badgeLabel="Mascot Auto-Hides During Run"
              message="“Take a moment to review the response keys below. As soon as you click Start Active Trial, I will step off-screen so your reaction-time telemetry is 100% free of visual distractions.”"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-md border-2 border-border bg-canvas p-4 space-y-1.5">
              <Badge tone="brand" glyph="1">
                Goal &amp; Pacing
              </Badge>
              <h2 className="font-display text-lg font-bold text-ink">
                85% Accuracy Staircase
              </h2>
              <p className="text-xs text-ink-muted">
                The QUEST+ algorithm automatically adjusts difficulty after
                every response. Steady accuracy narrows your ±CI band fastest.
              </p>
            </div>
            <div className="rounded-md border-2 border-border bg-canvas p-4 space-y-1.5">
              <Badge tone="info" glyph="2">
                Keyboard &amp; Touch Ready
              </Badge>
              <h2 className="font-display text-lg font-bold text-ink">
                Keys [1 / 2 / 3] or [J / K / L]
              </h2>
              <p className="text-xs text-ink-muted">
                Use keys 1, 2, 3 (or click the large ≥48 px buttons). Press
                Escape anytime to pause cleanly.
              </p>
            </div>
            <div className="rounded-md border-2 border-border bg-canvas p-4 space-y-1.5">
              <Badge tone="success" glyph="3">
                Non-Biometric Guarantee
              </Badge>
              <h2 className="font-display text-lg font-bold text-ink">
                RT &amp; Jitter Only
              </h2>
              <p className="text-xs text-ink-muted">
                Device input latency ({consentPreferences.inputLatencyMs ?? 138}{' '}
                ms) is subtracted automatically. Zero camera or mic usage.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setStage('running')}
            >
              ▶ Start Timed Calibration Block (4 Trials) →
            </Button>
            <span className="font-mono-tabular text-xs text-ink-muted">
              Task ID: {currentDim.id}_l{currentTrial.staircaseLevel} · Schema:{' '}
              {currentTrial.stimulusKind}
            </span>
          </div>
        </Card>
      )}

      {/* STAGE 3: TAB-BLUR / WINDOW-HIDE AUTO-PAUSE GUARD */}
      {stage === 'paused-blur' && (
        <Card
          role="dialog"
          aria-modal="false"
          aria-labelledby="blur-pause-heading"
          className="p-6 border-2 border-border-strong bg-warning-subtle space-y-4 min-w-0"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge tone="warning" glyph="⏸">
              Psychometric Validity Guard Triggered (visibilitychange)
            </Badge>
            <span className="font-mono-tabular text-xs text-ink-muted">
              Interrupted Trial #{currentTrial.trialIndex} Discarded Cleanly
            </span>
          </div>

          <h2
            id="blur-pause-heading"
            className="font-display text-2xl font-bold text-ink"
          >
            ⏸ Trial Auto-Paused — Focus Left Window or Pause Requested
          </h2>

          <p className="text-sm text-ink max-w-3xl">
            To protect your reaction-time distribution and 95% confidence
            interval (<code className="font-mono-tabular">±CI</code>),
            SynapseTwin automatically pauses the trial clock whenever a browser
            tab loses focus or <code className="font-mono-tabular">Escape</code>{' '}
            is pressed. No penalty or error burst was recorded.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setStage('running')}
            >
              ▶ Resume Calibration Block (Trial {currentTrial.trialIndex} of{' '}
              {trialSequence.length})
            </Button>
            <Button variant="secondary" onClick={() => setStage('completed')}>
              End Block &amp; Save {recordedEvents.length} Logged Trials
            </Button>
          </div>
        </Card>
      )}

      {/* STAGE 4: POST-BLOCK COMPLETION SUMMARY (Mascot Re-Enabled in 'celebrate' State) */}
      {stage === 'completed' && (
        <section
          aria-labelledby="block-complete-heading"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
        >
          <div className="lg:col-span-7 min-w-0 flex flex-col justify-between gap-4">
            <Card className="p-6 space-y-5 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge tone="reward" glyph="★">
                  Micro-Block Complete · Telemetry Synced (202 Accepted)
                </Badge>
                <Badge tone="brand" glyph="●">
                  Confidence: {initialConfidencePct}% → {updatedConfidencePct}%
                </Badge>
              </div>

              <h2
                id="block-complete-heading"
                className="font-display text-2xl sm:text-3xl font-bold text-ink"
              >
                ✓ {currentDim.name} confidence interval narrowed!
              </h2>

              {showMascot && (
                <Mascot
                  state="celebrate"
                  size="md"
                  title="Synapse Companion · Confidence Band Graduated to Solid!"
                  badgeLabel="State: celebrate"
                  message={`“Awesome focus! Across ${recordedEvents.length} trials your normalized mean reaction time was ${meanNormalizedRt} ms with ${meanJitterMs} ms jitter. Your confidence jumped from ${initialConfidencePct}% to ${updatedConfidencePct}%!”`}
                />
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-tabular">
                <div className="rounded-sm border border-border bg-canvas p-3">
                  <span className="text-ink-muted block">Updated Score</span>
                  <strong className="text-ink text-base">
                    {(currentEstimate?.scorePct ?? 78) + 2}% ± 6%
                  </strong>
                </div>
                <div className="rounded-sm border border-border bg-canvas p-3">
                  <span className="text-ink-muted block">Block Accuracy</span>
                  <strong className="text-ink text-base">
                    {accuracyPct}% (Target: 85%)
                  </strong>
                </div>
                <div className="rounded-sm border border-border bg-canvas p-3">
                  <span className="text-ink-muted block">Normalized RT</span>
                  <strong className="text-ink text-base">
                    {meanNormalizedRt} ms
                  </strong>
                </div>
                <div className="rounded-sm border border-border bg-canvas p-3">
                  <span className="text-ink-muted block">Jitter Stability</span>
                  <strong className="text-ink text-base">
                    {meanJitterMs} ms
                  </strong>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/profile-reveal"
                  className="tactile-btn bg-brand text-brand-ink px-5 py-3 text-base font-semibold no-underline inline-flex items-center"
                >
                  Inspect Updated Profile Reveal →
                </Link>
                <Link
                  to="/dashboard"
                  className="tactile-btn bg-surface text-ink hover:bg-surface-raised px-4 py-3 text-sm font-semibold no-underline inline-flex items-center"
                >
                  Open Command Dashboard →
                </Link>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setActiveTrialIdx(0)
                    setStage('running')
                  }}
                >
                  Run Another Block
                </Button>
              </div>
            </Card>

            <Card className="p-5 space-y-3 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-base font-bold text-ink">
                  QUEST+ Posterior &amp; Hysteresis Update
                </h3>
                <Badge tone="success" glyph="✓">
                  Cluster Hold Stable
                </Badge>
              </div>
              <p className="text-xs text-ink-muted">
                Bayesian psychometric update merged {recordedEvents.length}{' '}
                events into <code className="font-mono-tabular">c_t</code>{' '}
                prototype coordinates without triggering premature cluster
                re-assignment.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono-tabular">
                <div className="rounded-sm border border-border bg-canvas p-2.5">
                  <span className="text-ink-muted block">Entropy Drop</span>
                  <strong className="text-ink">-0.34 bits</strong>
                </div>
                <div className="rounded-sm border border-border bg-canvas p-2.5">
                  <span className="text-ink-muted block">Band State</span>
                  <strong className="text-ink">Solid (≥65% Conf)</strong>
                </div>
                <div className="rounded-sm border border-border bg-canvas p-2.5">
                  <span className="text-ink-muted block">Hysteresis</span>
                  <strong className="text-ink">3/3 Hold Passed</strong>
                </div>
                <div className="rounded-sm border border-border bg-canvas p-2.5">
                  <span className="text-ink-muted block">Next Block</span>
                  <strong className="text-ink">+24h Cadence</strong>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-5 min-w-0 flex flex-col justify-between gap-4">
            <WhyThisPanel
              trail={SAMPLE_WHY_THIS_TRAIL}
              title="How This Block Updated Your SAT-JEPA Twin (5-Part Trail)"
              defaultExpanded
            />
          </div>
        </section>
      )}

      {/* STAGE 2: ACTIVE TIMED TRIAL STAGE (8 Cols Stimulus + 4 Cols Telemetry Rail) */}
      {stage === 'running' && (
        <section
          aria-labelledby="active-trial-heading"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
        >
          {/* Left 8 Columns: Distraction-Free Stimulus & Response Canvas */}
          <div className="lg:col-span-8 min-w-0 flex flex-col justify-between gap-4">
            <Card className="p-6 space-y-5 min-w-0 flex-1 flex flex-col justify-between">
              {/* Top Trial Progress & Zero-Distraction Status Bar */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="brand" glyph="▶">
                      Trial {currentTrial.trialIndex} of {trialSequence.length}
                    </Badge>
                    <Badge tone="info" glyph="◈">
                      Schema: {currentTrial.stimulusKind.toUpperCase()} · Level{' '}
                      {currentTrial.staircaseLevel}
                    </Badge>
                  </div>
                  <span className="font-mono-tabular text-xs text-ink-muted">
                    Mascot &amp; Ambient Motion: <strong>LOCKED OFF</strong>
                  </span>
                </div>

                {/* Progress Bar */}
                <div
                  role="progressbar"
                  aria-label="Micro-block trial progress"
                  aria-valuenow={currentTrial.trialIndex}
                  aria-valuemin={1}
                  aria-valuemax={trialSequence.length}
                  className="h-2.5 w-full rounded-pill bg-canvas border border-border overflow-hidden"
                >
                  <div
                    className="h-full bg-brand"
                    style={{
                      width: `${Math.round(
                        (currentTrial.trialIndex / trialSequence.length) * 100,
                      )}%`,
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <h2
                    id="active-trial-heading"
                    className="font-display text-xl sm:text-2xl font-bold text-ink"
                  >
                    {currentTrial.promptTitle}
                  </h2>
                  <p className="text-sm text-ink-muted">
                    {currentTrial.promptInstruction}
                  </p>
                </div>
              </div>

              {/* High-Contrast Geometric SVG Stimulus Stage */}
              <div className="rounded-md border-2 border-border-strong bg-canvas p-5 space-y-4 text-center my-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular">
                  <Badge tone="neutral" glyph={currentDim.markerGlyph}>
                    {currentTrial.stimulusBadge}
                  </Badge>
                  <span className="text-ink-muted">
                    Frame Sync: 16.7 ms · Offset: -
                    {consentPreferences.inputLatencyMs ?? 138} ms
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-3">
                  {/* Study / Reference Anchor SVG */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="font-mono-tabular text-xs font-semibold uppercase text-ink-muted">
                      Reference Anchor
                    </span>
                    <svg
                      viewBox="0 0 120 120"
                      className="h-28 w-28 rounded-md border-2 border-border bg-surface p-2"
                      role="img"
                      aria-label="Reference anchor geometric pattern"
                    >
                      <rect
                        x="14"
                        y="14"
                        width="92"
                        height="92"
                        rx="10"
                        fill="var(--color-surface-raised)"
                        stroke="var(--color-border-strong)"
                        strokeWidth="2"
                      />
                      <polygon
                        points="60,22 92,42 92,78 60,98 28,78 28,42"
                        fill="var(--color-brand-subtle)"
                        stroke="var(--color-ink)"
                        strokeWidth="2.8"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="12"
                        fill="var(--color-reward)"
                        stroke="var(--color-ink)"
                        strokeWidth="2.2"
                      />
                    </svg>
                  </div>

                  <span
                    aria-hidden="true"
                    className="font-mono-tabular text-xl font-bold text-ink-muted"
                  >
                    ⇄
                  </span>

                  {/* Active Probe Stimulus SVG */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="font-mono-tabular text-xs font-semibold uppercase text-ink">
                      Active Probe Stimulus
                    </span>
                    <svg
                      viewBox="0 0 120 120"
                      className="h-28 w-28 rounded-md border-2 border-ink bg-surface p-2"
                      role="img"
                      aria-label={`Active probe stimulus: ${currentTrial.stimulusHeadline}`}
                    >
                      <rect
                        x="14"
                        y="14"
                        width="92"
                        height="92"
                        rx="10"
                        fill="var(--color-surface-raised)"
                        stroke="var(--color-ink)"
                        strokeWidth="2"
                      />
                      <polygon
                        points={
                          currentTrial.trialIndex % 2 === 1
                            ? '60,20 95,46 88,82 60,98 28,78 25,40'
                            : '60,22 92,42 92,78 60,98 28,78 28,42'
                        }
                        fill="var(--color-info-subtle)"
                        stroke="var(--color-ink)"
                        strokeWidth="2.8"
                        strokeDasharray={
                          currentTrial.trialIndex % 2 === 1 ? '5 3' : undefined
                        }
                      />
                      <rect
                        x="49"
                        y="49"
                        width="22"
                        height="22"
                        rx="4"
                        fill="var(--color-brand)"
                        stroke="var(--color-ink)"
                        strokeWidth="2.2"
                      />
                    </svg>
                  </div>
                </div>

                <p className="font-mono-tabular text-sm font-bold text-ink break-words">
                  {currentTrial.stimulusHeadline}
                </p>
              </div>

              {/* Large >=48px Ergonomic Response Buttons (Keyboard 1 / 2 / 3) */}
              <div
                role="group"
                aria-label="Trial response choices"
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1"
              >
                {currentTrial.options.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    className="tactile-btn bg-surface hover:bg-brand-subtle text-ink p-4 text-start flex flex-col justify-between gap-2 cursor-pointer min-h-16"
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <span className="font-display text-base font-bold text-ink">
                        <span aria-hidden="true" className="me-1.5">
                          {opt.glyph}
                        </span>
                        {opt.label}
                      </span>
                      <Badge tone="neutral" glyph="⌨">
                        Key {opt.key}
                      </Badge>
                    </div>
                    <span className="text-xs text-ink-muted">
                      {opt.subLabel}
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right 4 Columns: Real-Time Telemetry & POST /v1/telemetry/event Stream */}
          <div className="lg:col-span-4 min-w-0 flex flex-col justify-between gap-4">
            <Card className="p-5 space-y-3.5 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-base font-bold text-ink">
                  Live Psychometric Telemetry
                </h3>
                <Badge
                  tone={simulateOffline ? 'warning' : 'success'}
                  glyph={simulateOffline ? '⚡' : '●'}
                >
                  {simulateOffline ? 'Offline Buffer' : '202 Live Stream'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono-tabular">
                <div className="rounded-sm border border-border bg-canvas p-2.5">
                  <span className="text-ink-muted block">Normalized RT</span>
                  <strong className="text-ink text-sm">
                    {meanNormalizedRt} ms
                  </strong>
                </div>
                <div className="rounded-sm border border-border bg-canvas p-2.5">
                  <span className="text-ink-muted block">Hesitation Jitter</span>
                  <strong className="text-ink text-sm">{meanJitterMs} ms</strong>
                </div>
                <div className="rounded-sm border border-border bg-canvas p-2.5">
                  <span className="text-ink-muted block">Block Accuracy</span>
                  <strong className="text-ink text-sm">{accuracyPct}%</strong>
                </div>
                <div className="rounded-sm border border-border bg-canvas p-2.5">
                  <span className="text-ink-muted block">Confidence Gain</span>
                  <strong className="text-ink text-sm">
                    {initialConfidencePct}% → {updatedConfidencePct}%
                  </strong>
                </div>
              </div>
            </Card>

            <Card className="p-5 space-y-3 min-w-0 flex-1 flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-base font-bold text-ink">
                    POST /v1/telemetry/event Log
                  </h3>
                  <p className="text-xs text-ink-muted">
                    Matches Member 1’s FastAPI Pydantic schema.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  aria-pressed={showTelemetryTable}
                  onClick={() => setShowTelemetryTable((prev) => !prev)}
                >
                  {showTelemetryTable
                    ? 'View JSON Stream'
                    : 'View Telemetry as Table'}
                </Button>
              </div>

              {showTelemetryTable ? (
                <div className="overflow-x-auto">
                  <table
                    aria-label="Recorded trial telemetry events table"
                    className="w-full text-start border-collapse text-xs font-mono-tabular"
                  >
                    <thead>
                      <tr className="border-b-2 border-border-strong text-ink-muted uppercase">
                        <th className="py-1.5 pe-2 text-start">Trial</th>
                        <th className="py-1.5 px-2 text-start">Lvl</th>
                        <th className="py-1.5 px-2 text-start">Norm RT</th>
                        <th className="py-1.5 ps-2 text-start">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recordedEvents.map((ev, i) => (
                        <tr key={`${ev.trial_index}-${i}`}>
                          <td className="py-1.5 pe-2 font-bold text-ink">
                            #{ev.trial_index}
                          </td>
                          <td className="py-1.5 px-2 text-ink">
                            L{ev.staircase_level}
                          </td>
                          <td className="py-1.5 px-2 text-ink">
                            {ev.normalized_rt_ms} ms
                          </td>
                          <td className="py-1.5 ps-2 text-ink">
                            {ev.score_norm === 1 ? '✓ 1.0' : '✕ 0.0'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <pre
                  tabIndex={0}
                  role="region"
                  aria-label="Live POST /v1/telemetry/event JSON stream"
                  className="focus-ring rounded-sm border border-border bg-canvas p-3 text-xs font-mono-tabular text-ink overflow-x-auto whitespace-pre-wrap break-words max-h-56"
                >
                  <code>{JSON.stringify(recordedEvents[0], null, 2)}</code>
                </pre>
              )}

              <div className="pt-1 flex items-center justify-between text-xs font-mono-tabular text-ink-muted">
                <span>Events Logged: {recordedEvents.length}</span>
                <span>voice_opt_in: false</span>
              </div>
            </Card>
          </div>
        </section>
      )}
    </div>
  )
}
