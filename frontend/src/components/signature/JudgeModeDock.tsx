import { useMemo } from 'react'
import {
  DIMENSION_PRESETS,
  getDimensionsByPreset,
} from '../../config/dimensions'
import { useAppStore, type PersonaId } from '../../store/useAppStore'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export interface JudgePersonaMeta {
  id: PersonaId
  name: string
  subtitle: string
  confidenceLabel: string
  rubricProof: string
  characteristics: string
}

export const JUDGE_PERSONAS: readonly JudgePersonaMeta[] = [
  {
    id: 'steady-improver',
    name: 'Youssef · Steady Improver',
    subtitle: '6 Weeks History · 14 Snapshots',
    confidenceLabel: '86% Conf · Stable',
    rubricProof: 'Profile Quality (8%), Innovation (12%), Plan Relevance (6%)',
    characteristics:
      'Narrowing Bayesian confidence intervals across 14 snapshots, 82±4 Collaboration Score, active SAT-JEPA archetype transition.',
  },
  {
    id: 'new-user',
    name: 'Nour · New Intake Student',
    subtitle: '0 Prior Sessions · Fresh Consent',
    confidenceLabel: 'Uncalibrated Baseline',
    rubricProof: 'UX (9%), Safety (6%), Relevance (12%)',
    characteristics:
      'Uncalibrated twin, non-biometric mode locked on, ready for 2-minute quick baseline or 5-minute calibration.',
  },
  {
    id: 'noisy-low-confidence',
    name: 'Salma · Noisy & Low-Confidence',
    subtitle: 'High RT Jitter · Low Confidence',
    confidenceLabel: '48% Conf · Hatched',
    rubricProof: 'Profile Quality (8%), Explainability (9%)',
    characteristics:
      'High response-time variance and hesitation jitter; 4 dimensions below 55% confidence triggering diagonal SVG hatching.',
  },
  {
    id: 'edge-missing-dim',
    name: 'Fixture A · Partial Profile',
    subtitle: '1 Dimension Unassessed (Null)',
    confidenceLabel: 'Partial Evaluation',
    rubricProof: 'Robustness (10%), Quality (12%)',
    characteristics:
      'Reasoning dimension unassessed (null estimate) to verify graceful partial-state rendering on radar and card grids.',
  },
  {
    id: 'edge-10-dimensions',
    name: 'Fixture B · 10 Dimensions',
    subtitle: 'Generalisation Stress Test',
    confidenceLabel: 'Full 10 Dims Active',
    rubricProof: 'Generalisation (10%), Quality (12%)',
    characteristics:
      'Tests full 10-dimension pool (WM, IC, CF, AN, PS, EP, VP, SR, MD, SV) with unique Okabe-Ito geometric markers.',
  },
  {
    id: 'edge-llm-offline',
    name: 'Fixture C · LLM-Down Degraded',
    subtitle: 'Simulated 503 Service Timeout',
    confidenceLabel: 'Deterministic Fallback',
    rubricProof: 'Robustness (10%), Defense (6%)',
    characteristics:
      'Simulates AI Coach LLM timeout; activates deterministic SAT-JEPA heuristic rules with zero explanation downtime.',
  },
]

export interface JudgeModeDockProps {
  onPersonaChange?: (id: PersonaId) => void
  onResetFeedback?: () => void
  className?: string
}

export function JudgeModeDock({
  onPersonaChange,
  onResetFeedback,
  className = '',
}: JudgeModeDockProps) {
  const {
    activePersona,
    setActivePersona,
    dimensionPreset,
    setDimensionPreset,
    simulateOffline,
    setSimulateOffline,
    simulateLlmDown,
    setSimulateLlmDown,
    theme,
    setTheme,
    reducedMotion,
    setReducedMotion,
    resetDemoState,
  } = useAppStore()

  const currentPersona = useMemo(
    () =>
      JUDGE_PERSONAS.find((p) => p.id === activePersona) ?? JUDGE_PERSONAS[0]!,
    [activePersona],
  )

  const activeDimensions = useMemo(
    () => getDimensionsByPreset(dimensionPreset),
    [dimensionPreset],
  )

  const handleSelectPersona = (id: PersonaId) => {
    setActivePersona(id)
    if (id === 'edge-10-dimensions') {
      setDimensionPreset('10')
    } else if (id === 'edge-llm-offline') {
      setSimulateLlmDown(true)
    }
    onPersonaChange?.(id)
  }

  const handleReset = () => {
    resetDemoState()
    onResetFeedback?.()
  }

  return (
    <Card
      className={`p-5 border-2 border-border-strong bg-surface shadow-doodle space-y-5 ${className}`}
      aria-label="Judge Mode Quick Dock"
    >
      {/* Header Badge & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b-2 border-border-strong">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border-strong bg-reward text-reward-ink font-display font-bold text-sm shadow-doodle-sm"
          >
            ⚖
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-base text-ink leading-tight">
                Signature #7 · Judge Mode Dock
              </h2>
              <Badge tone="reward" glyph="★">
                Defense Console
              </Badge>
            </div>
            <p className="text-xs text-ink-muted">
              Peer-review control center for jury evaluation and stress testing.
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleReset}
          className="shrink-0"
        >
          Reset Demo State
        </Button>
      </div>

      {/* 1. Active Persona & Quick Switcher Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-ink">
            Active Seeded Persona ({JUDGE_PERSONAS.length} Scenarios):
          </span>
          <span className="font-mono text-ink-muted text-xs">
            Rubric: {currentPersona.rubricProof.split(',')[0]}
          </span>
        </div>

        <div
          role="group"
          aria-label="Seeded persona selector"
          className="grid grid-cols-2 sm:grid-cols-3 gap-2"
        >
          {JUDGE_PERSONAS.map((p) => {
            const isSelected = p.id === activePersona
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleSelectPersona(p.id)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  isSelected
                    ? 'border-brand bg-brand/10 text-ink shadow-sm ring-1 ring-brand'
                    : 'border-border bg-canvas/40 text-ink hover:bg-surface-raised'
                }`}
              >
                <div className="font-semibold truncate">{p.name}</div>
                <div className="text-xs text-ink-muted truncate mt-0.5">
                  {p.confidenceLabel}
                </div>
              </button>
            )
          })}
        </div>

        {/* Active Persona Details Card */}
        <div className="p-3 rounded-xl border border-border bg-canvas/30 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink">
              {currentPersona.name}
            </span>
            <Badge tone="brand">
              {currentPersona.confidenceLabel}
            </Badge>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">
            {currentPersona.characteristics}
          </p>
        </div>
      </div>

      {/* 2. Dimension Generalisation & System Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
        {/* Dimension Count Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-ink">Dimension Generalisation:</span>
            <span className="font-mono text-brand text-xs font-bold">
              {activeDimensions.length} Dims
            </span>
          </div>
          <div
            role="group"
            aria-label="Dimension count preset switcher"
            className="flex flex-wrap gap-1"
          >
            {DIMENSION_PRESETS.map((preset) => {
              const isActive = dimensionPreset === preset.key
              return (
                <button
                  key={preset.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setDimensionPreset(preset.key)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors ${
                    isActive
                      ? 'bg-brand text-brand-ink border-brand'
                      : 'bg-surface text-ink border-border hover:bg-surface-raised'
                  }`}
                >
                  {preset.label.split(' ')[0]}
                </button>
              )
            })}
          </div>
        </div>

        {/* Robustness Fault Injections */}
        <div className="space-y-1.5">
          <span className="font-semibold text-ink text-xs block">
            Fault Injections (Robustness):
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={simulateOffline}
              onClick={() => setSimulateOffline(!simulateOffline)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                simulateOffline
                  ? 'bg-warning text-brand-ink border-warning'
                  : 'bg-surface text-ink border-border hover:bg-surface-raised'
              }`}
            >
              <span>{simulateOffline ? '●' : '○'}</span>
              <span>Offline Queue</span>
            </button>

            <button
              type="button"
              role="switch"
              aria-checked={simulateLlmDown}
              onClick={() => setSimulateLlmDown(!simulateLlmDown)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                simulateLlmDown
                  ? 'bg-danger text-brand-ink border-danger'
                  : 'bg-surface text-ink border-border hover:bg-surface-raised'
              }`}
            >
              <span>{simulateLlmDown ? '●' : '○'}</span>
              <span>LLM Fallback</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Appearance & Accessibility Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border text-xs">
        <div className="flex items-center gap-2">
          <span className="text-ink-muted">Theme:</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? '☀ Light (Playful)' : '☾ Dark (Night Lab)'}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-ink-muted">Motion:</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setReducedMotion(!reducedMotion)}
          >
            {reducedMotion ? '⚡ Reduced' : '✦ Standard'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
