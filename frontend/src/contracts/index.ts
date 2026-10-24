// Core domain contracts mirroring docs/ui/contracts.md and assessment_engine/api/routes/telemetry.py

export type BackendDimensionKey =
  | 'working_memory'
  | 'pattern_induction'
  | 'executive_function'
  | 'spatial_orientation'
  | 'processing_speed'
  | 'episodic_memory'

export type TaskSchemaType =
  | 'n_back'
  | 'stroop'
  | 'matrix'
  | 'mental_rotation'
  | 'relational'
  | 'tower'
  | 'ufov'
  | 'mst'

export type MarkerShape =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'diamond'
  | 'pentagon'
  | 'hexagon'
  | 'star'
  | 'cross'
  | 'ring'
  | 'hourglass'

export interface DimensionConfig {
  id: string
  code: string
  slotIndex: number // 1..10
  name: string
  shortDescription: string
  scientificDefinition: string
  taskName: string
  scoringMethod: string
  uncertaintyNote: string
  knownBiases: string[]
  backendDimensionKey: BackendDimensionKey
  schemaTypes: TaskSchemaType[]
  colorCssVar: string // e.g. 'var(--dim-1)'
  markerShape: MarkerShape
  markerGlyph: string // e.g. '●', '■', '▲'
  strokeDasharray?: string
}

export interface DimensionEstimate {
  dimensionId: string
  backendDimensionKey: BackendDimensionKey
  scorePct: number | null // null when unassessed (partial profile state)
  ciLowerPct: number
  ciUpperPct: number
  uncertaintySigma: number
  confidence: number // 0..1 (<0.60 triggers hatched band & low-confidence UI)
  isLowConfidence: boolean
  sampleSize: number
  meanRtMs: number
  errorRatePct: number
  hesitationJitterMs: number
  speedAccuracyProfile: 'fast_accurate' | 'deliberate' | 'impulsive_error' | 'fatigued_slow'
  trendDeltaPct: number
  lastUpdatedIso: string
}

export interface WhyThisTrail {
  id: string
  observedData: string[]
  inference: string
  recommendation: string
  confidence: number
  counterfactual: string
  sourceModule: 'sat_jepa_delta_c' | 'quest_staircase' | 'collab_scorer' | 'deterministic_fallback'
}

export interface CollaborationSubScore {
  key: 'clarification' | 'verification' | 'iteration' | 'autonomy' | 'responsible_use'
  label: string
  defaultWeightPct: 20 | 25 | 20 | 20 | 15
  activeDynamicWeightPct: number
  score: number
  evidenceCount: number
  recentEvents: string[]
  howToImprove: string
}

export interface CollaborationScorePayload {
  totalScore: number
  ciRange: [number, number]
  statusBadge: 'Design proposal, not validated'
  formulaDisplay: string
  subScores: CollaborationSubScore[]
  whyThis: WhyThisTrail
}

export interface BrainTwinSnapshot {
  snapshotId: string
  timestampIso: string
  label: string
  triggerEvent: string
  archetypeName: string
  clusterId: number
  overallConfidence: number
  estimates: DimensionEstimate[]
}

export interface TrajectoryPoint {
  weekKey: string // e.g. 'W1', 'W2', ..., 'W6', '+1 Wk', '+2 Wk'
  weekLabel: string
  scorePct: number
  ciLowerPct: number
  ciUpperPct: number
  confidence: number
  isProjected: boolean
  sessionCount: number
}

export interface FatigueHeatmapCell {
  windowId: 'morning' | 'afternoon' | 'evening'
  windowLabel: string
  dayKey: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
  readinessPct: number | null // null when no session logged in that slot
  meanRtMs: number | null
  status: 'optimal' | 'moderate' | 'fatigued' | 'unlogged'
  glyph: '●' | '◐' | '▲' | '—'
}

export interface TelemetryEvent {
  user_id: string
  session_id: string
  task_id: string
  trial_index: number
  dimension: BackendDimensionKey
  score_norm: number
  response_time_ms: number
  error_flag: boolean
  error_burst: number
  hesitation_jitter: number
  keystroke_latency_ms?: number | null
  trial_meta?: Record<string, string | number | boolean>
  voice_opt_in?: boolean
  voice_latency_ms?: number | null
  vocal_pace_hz?: number | null
  client_ts: string
}

export interface ContrastPairReport {
  id: string
  role: string
  theme: 'light' | 'dark'
  fgName: string
  fgHex: string
  bgName: string
  bgHex: string
  ratio: number
  minRequired: number
  level: 'AAA' | 'AA' | 'AA-UI' | 'FAIL'
  passes: boolean
}

export interface CopyLintViolation {
  term: string
  category: 'clinical_diagnostic' | 'punitive_guilt'
  replacementSuggestion: string
}

export interface CopyLintResult {
  input: string
  isClean: boolean
  violations: CopyLintViolation[]
  sanitizedPreview: string
}
