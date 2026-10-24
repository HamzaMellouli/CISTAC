import type {
  BrainTwinSnapshot,
  CollaborationScorePayload,
  DimensionConfig,
  DimensionEstimate,
  FatigueHeatmapCell,
  TrajectoryPoint,
  WhyThisTrail,
} from '../../contracts'
import type { PersonaId } from '../../store/useAppStore'

/**
 * Generates deterministic, uncertainty-aware dimension estimates for any 3..10 dimension preset
 * and any of the 6 personas/edge fixtures.
 */
export function buildEstimatesForDimensions(
  dimensions: readonly DimensionConfig[],
  persona: PersonaId,
): DimensionEstimate[] {
  return dimensions.map((dim, idx) => {
    // Edge fixture: first dimension unassessed (null) to verify partial state
    if (persona === 'edge-missing-dim' && idx === 0) {
      return {
        dimensionId: dim.id,
        backendDimensionKey: dim.backendDimensionKey,
        scorePct: null,
        ciLowerPct: 0,
        ciUpperPct: 0,
        uncertaintySigma: 0,
        confidence: 0,
        isLowConfidence: true,
        sampleSize: 0,
        meanRtMs: 0,
        errorRatePct: 0,
        hesitationJitterMs: 0,
        speedAccuracyProfile: 'deliberate',
        trendDeltaPct: 0,
        lastUpdatedIso: '2026-10-24T12:00:00Z',
      }
    }

    if (persona === 'new-user') {
      return {
        dimensionId: dim.id,
        backendDimensionKey: dim.backendDimensionKey,
        scorePct: null,
        ciLowerPct: 0,
        ciUpperPct: 0,
        uncertaintySigma: 0,
        confidence: 0,
        isLowConfidence: true,
        sampleSize: 0,
        meanRtMs: 0,
        errorRatePct: 0,
        hesitationJitterMs: 0,
        speedAccuracyProfile: 'deliberate',
        trendDeltaPct: 0,
        lastUpdatedIso: '2026-10-24T12:00:00Z',
      }
    }

    const isNoisyPersona = persona === 'noisy-low-confidence'
    const baseScore = isNoisyPersona
      ? 54 + ((idx * 9) % 24)
      : 68 + ((idx * 7) % 22)
    const isLowConf = isNoisyPersona ? idx % 2 === 0 : idx === 5
    const halfBand = isLowConf ? 16 : 5 + (idx % 3)
    const confidence = isLowConf ? 0.48 : 0.84 - (idx % 3) * 0.04

    return {
      dimensionId: dim.id,
      backendDimensionKey: dim.backendDimensionKey,
      scorePct: Math.min(96, Math.max(20, baseScore)),
      ciLowerPct: Math.max(0, baseScore - halfBand),
      ciUpperPct: Math.min(100, baseScore + halfBand),
      uncertaintySigma: Math.round((halfBand / 1.96) * 10) / 10,
      confidence: Math.round(confidence * 100) / 100,
      isLowConfidence: isLowConf,
      sampleSize: isLowConf ? 4 : 18 + idx * 3,
      meanRtMs: 540 + idx * 45 + (isNoisyPersona ? 160 : 0),
      errorRatePct: isLowConf ? 24 : 12,
      hesitationJitterMs: isLowConf ? 195 : 64,
      speedAccuracyProfile: isLowConf
        ? 'impulsive_error'
        : idx % 2 === 0
          ? 'fast_accurate'
          : 'deliberate',
      trendDeltaPct: isNoisyPersona ? -2 + idx : 4 + (idx % 5),
      lastUpdatedIso: '2026-10-24T12:00:00Z',
    }
  })
}

export const SAMPLE_WHY_THIS_TRAIL: WhyThisTrail = {
  id: 'why-wm-dual-stream',
  observedData: [
    'Working Memory 2-back accuracy reached 88% across 18 trials (mean RT: 585 ms).',
    'Rule-switch trials showed only a +62 ms latency cost with zero error bursts.',
    'Episodic Pattern Separation confidence remains preliminary (48%, ±16% band) due to only 4 completed lure trials.',
  ],
  inference:
    'SAT-JEPA prototype differential vector (Δc) indicates strong working-memory stability ready for dual-stream progression, while Episodic Separation needs 6 additional lure-discrimination trials to narrow uncertainty.',
  recommendation:
    'Run a 2-minute Mnemonic Similarity calibration block next, followed by Level 3 Dual-Stream N-Back.',
  confidence: 0.86,
  counterfactual:
    'If 2+ consecutive error bursts occur or response-time jitter exceeds 180 ms, the staircase will step back to single-stream 2-back automatically.',
  sourceModule: 'sat_jepa_delta_c',
}

export const SAMPLE_COLLABORATION_SCORE: CollaborationScorePayload = {
  totalScore: 82,
  ciRange: [78, 86],
  statusBadge: 'Design proposal, not validated',
  formulaDisplay:
    'S_collab = 0.20·Clarification + 0.25·Verification + 0.20·Iteration + 0.20·Autonomy + 0.15·ResponsibleUse',
  subScores: [
    {
      key: 'clarification',
      label: 'Clarification',
      defaultWeightPct: 20,
      activeDynamicWeightPct: 20,
      score: 85,
      evidenceCount: 6,
      recentEvents: ['Asked why UFOV duration changed after block 2'],
      howToImprove: 'Ask a targeted question whenever a confidence band widens.',
    },
    {
      key: 'verification',
      label: 'Critical Verification',
      defaultWeightPct: 25,
      activeDynamicWeightPct: 25,
      score: 88,
      evidenceCount: 8,
      recentEvents: ['Inspected "Why this?" trail on 4 coach recommendations'],
      howToImprove: 'Continue comparing AI suggestions against your raw trial telemetry.',
    },
    {
      key: 'iteration',
      label: 'Iteration',
      defaultWeightPct: 20,
      activeDynamicWeightPct: 20,
      score: 79,
      evidenceCount: 5,
      recentEvents: ['Refined weekly goal target after reviewing fatigue heatmap'],
      howToImprove: 'Adjust exercise pacing after reviewing post-block feedback.',
    },
    {
      key: 'autonomy',
      label: 'Autonomy',
      defaultWeightPct: 20,
      activeDynamicWeightPct: 20,
      score: 76,
      evidenceCount: 4,
      recentEvents: ['Selected self-paced practice before scored block'],
      howToImprove: 'Initiate one self-chosen dimension exercise before asking the coach.',
    },
    {
      key: 'responsible_use',
      label: 'Responsible Use',
      defaultWeightPct: 15,
      activeDynamicWeightPct: 15,
      score: 92,
      evidenceCount: 7,
      recentEvents: ['Reviewed Privacy Center & non-biometric telemetry settings'],
      howToImprove: 'Keep non-biometric defaults active and respect rest breaks.',
    },
  ],
  whyThis: SAMPLE_WHY_THIS_TRAIL,
}

export function buildSnapshotsForDimensions(
  dimensions: readonly DimensionConfig[],
  persona: PersonaId,
): BrainTwinSnapshot[] {
  const currentEstimates = buildEstimatesForDimensions(dimensions, persona)
  const earlierEstimates = currentEstimates.map((est) => ({
    ...est,
    scorePct: est.scorePct !== null ? Math.max(20, est.scorePct - 7) : null,
    ciLowerPct: Math.max(0, est.ciLowerPct - 11),
    ciUpperPct: Math.min(100, est.ciUpperPct - 3),
    confidence: Math.max(0.42, Math.round((est.confidence - 0.14) * 100) / 100),
    isLowConfidence: est.confidence - 0.14 < 0.6,
  }))

  return [
    {
      snapshotId: 'snap-week-1',
      timestampIso: '2026-09-15T10:00:00Z',
      label: 'Week 1 Baseline',
      triggerEvent: 'Initial 2-minute Quick Baseline completed',
      archetypeName: 'Exploratory Calibrator (Cluster C2)',
      clusterId: 2,
      overallConfidence: 0.56,
      estimates: earlierEstimates,
    },
    {
      snapshotId: 'snap-current',
      timestampIso: '2026-10-24T12:00:00Z',
      label: 'Current Brain Twin (Week 6)',
      triggerEvent: 'Post-session SAT-JEPA update (Hysteresis stable)',
      archetypeName: 'Steady Analytical Builder (Cluster C5)',
      clusterId: 5,
      overallConfidence: persona === 'noisy-low-confidence' ? 0.54 : 0.84,
      estimates: currentEstimates,
    },
  ]
}

/**
 * Generates 6 weeks of observed trajectory points (W1..W6) plus 2 weeks of projected fan
 * (+1 Wk, +2 Wk) with widening epistemic uncertainty intervals for Signature #4 <ProjectionFanChart />.
 */
export function buildTrajectoryForTarget(
  targetId: string, // 'composite' or dimensionId
  persona: PersonaId,
  slotSeed = 1,
): TrajectoryPoint[] {
  const isNoisy = persona === 'noisy-low-confidence'
  const baseStart = isNoisy ? 52 + (slotSeed % 8) : 62 + (slotSeed % 10)
  const weeklyGain = isNoisy ? 1.5 : 2.6

  const weeks: { key: string; label: string; isProj: boolean }[] = [
    { key: 'W1', label: 'Week 1 (Baseline)', isProj: false },
    { key: 'W2', label: 'Week 2', isProj: false },
    { key: 'W3', label: 'Week 3', isProj: false },
    { key: 'W4', label: 'Week 4', isProj: false },
    { key: 'W5', label: 'Week 5', isProj: false },
    { key: 'W6', label: 'Week 6 (Current)', isProj: false },
    { key: '+1 Wk', label: '+1 Week Forecast', isProj: true },
    { key: '+2 Wk', label: '+2 Weeks Forecast', isProj: true },
  ]

  return weeks.map((w, idx) => {
    const jitter = isNoisy && idx % 2 === 1 ? -3 : 0
    const rawScore = Math.round(
      Math.min(95, Math.max(30, baseStart + idx * weeklyGain + jitter)),
    )
    // Observed CI narrows from W1 (±14%) to W6 (±5%); Projected fan widens (+1 Wk: ±9%, +2 Wk: ±13%)
    const halfBand = w.isProj
      ? isNoisy
        ? 16 + (idx - 5) * 4
        : 8 + (idx - 5) * 4
      : isNoisy
        ? Math.max(11, 18 - idx)
        : Math.max(5, 13 - idx * 1.5)

    const roundedHalf = Math.round(halfBand)
    const confidence = w.isProj
      ? isNoisy
        ? 0.44
        : 0.68 - (idx - 6) * 0.08
      : isNoisy
        ? 0.52 + idx * 0.01
        : Math.min(0.88, 0.58 + idx * 0.05)

    return {
      weekKey: w.key,
      weekLabel: `${w.label} (${targetId})`,
      scorePct: rawScore,
      ciLowerPct: Math.max(10, rawScore - roundedHalf),
      ciUpperPct: Math.min(99, rawScore + roundedHalf),
      confidence: Math.round(confidence * 100) / 100,
      isProjected: w.isProj,
      sessionCount: w.isProj ? 0 : isNoisy ? 1 + (idx % 2) : 3 + (idx % 2),
    }
  })
}

/**
 * Generates the 3 (Time Windows) x 7 (Days) Session Fatigue & Alertness Heatmap matrix.
 */
export function buildFatigueHeatmap(persona: PersonaId): FatigueHeatmapCell[] {
  const days: readonly FatigueHeatmapCell['dayKey'][] = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ]
  const windows: readonly {
    id: FatigueHeatmapCell['windowId']
    label: string
  }[] = [
    { id: 'morning', label: 'Morning (08:00–12:00)' },
    { id: 'afternoon', label: 'Afternoon (13:00–17:00)' },
    { id: 'evening', label: 'Evening (18:00–22:00)' },
  ]

  const isNoisy = persona === 'noisy-low-confidence'
  const cells: FatigueHeatmapCell[] = []

  windows.forEach((win, wIdx) => {
    days.forEach((day, dIdx) => {
      // Leave a couple of weekend slots unlogged for realism
      if ((wIdx === 1 && dIdx >= 5) || (wIdx === 0 && dIdx === 6)) {
        cells.push({
          windowId: win.id,
          windowLabel: win.label,
          dayKey: day,
          readinessPct: null,
          meanRtMs: null,
          status: 'unlogged',
          glyph: '—',
        })
        return
      }

      const baseReadiness =
        wIdx === 0
          ? isNoisy
            ? 74
            : 89
          : wIdx === 1
            ? isNoisy
              ? 66
              : 78
            : isNoisy
              ? 51
              : 63

      const score = Math.min(
        96,
        Math.max(42, baseReadiness + ((dIdx * 3) % 7) - 3),
      )
      const rt =
        wIdx === 0
          ? 545 + dIdx * 8
          : wIdx === 1
            ? 610 + dIdx * 10
            : 695 + dIdx * 14 + (isNoisy ? 85 : 0)

      const status: FatigueHeatmapCell['status'] =
        score >= 80 ? 'optimal' : score >= 65 ? 'moderate' : 'fatigued'
      const glyph: FatigueHeatmapCell['glyph'] =
        status === 'optimal' ? '●' : status === 'moderate' ? '◐' : '▲'

      cells.push({
        windowId: win.id,
        windowLabel: win.label,
        dayKey: day,
        readinessPct: score,
        meanRtMs: rt,
        status,
        glyph,
      })
    })
  })

  return cells
}
