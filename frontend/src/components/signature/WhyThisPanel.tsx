import { useState } from 'react'
import type { WhyThisTrail } from '../../contracts'
import { Badge } from '../ui/Badge'

export interface WhyThisPanelProps {
  trail: WhyThisTrail
  defaultExpanded?: boolean
  title?: string
}

export function WhyThisPanel({
  trail,
  defaultExpanded = false,
  title = 'Why this advice?',
}: WhyThisPanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const confidencePct = Math.round(trail.confidence * 100)
  const isLowConf = trail.confidence < 0.6

  return (
    <div className="rounded-md border-2 border-border-strong bg-surface-raised p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-flex h-6 w-6 items-center justify-center rounded-pill bg-brand text-brand-ink text-xs font-bold"
          >
            ?
          </span>
          <span className="font-display text-base font-semibold text-ink">
            {title}
          </span>
          <Badge
            tone={isLowConf ? 'low-confidence' : 'brand'}
            glyph={isLowConf ? '◌' : '●'}
          >
            Confidence {confidencePct}%
          </Badge>
        </div>
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
          className="focus-ring min-h-11 px-3 py-1.5 rounded-sm border border-border-strong bg-surface text-xs font-semibold text-ink cursor-pointer hover:bg-canvas"
        >
          {expanded ? 'Hide reasoning trail ▲' : 'Inspect reasoning trail ▼'}
        </button>
      </div>

      {expanded && (
        <dl className="mt-3 grid grid-cols-1 gap-3 border-t border-border pt-3 text-sm">
          <div>
            <dt className="font-mono-tabular text-xs font-semibold uppercase tracking-wider text-ink-muted">
              1. Observed Telemetry Data
            </dt>
            <dd className="mt-1 text-ink">
              <ul className="list-disc ps-5 space-y-1">
                {trail.observedData.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>

          <div>
            <dt className="font-mono-tabular text-xs font-semibold uppercase tracking-wider text-ink-muted">
              2. Non-Clinical Inference (SAT-JEPA Δc)
            </dt>
            <dd className="mt-1 text-ink">{trail.inference}</dd>
          </div>

          <div>
            <dt className="font-mono-tabular text-xs font-semibold uppercase tracking-wider text-ink-muted">
              3. Adaptive Advice
            </dt>
            <dd className="mt-1 font-medium text-ink">{trail.recommendation}</dd>
          </div>

          <div>
            <dt className="font-mono-tabular text-xs font-semibold uppercase tracking-wider text-ink-muted">
              4. Epistemic Confidence ({confidencePct}%)
            </dt>
            <dd className="mt-1 flex items-center gap-3">
              <div
                className="h-3 w-full max-w-xs overflow-hidden rounded-pill border border-border-strong bg-surface"
                role="progressbar"
                aria-valuenow={confidencePct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Advice confidence percentage"
              >
                <div
                  className="h-full bg-brand"
                  style={{ width: `${confidencePct}%` }}
                />
              </div>
              <span className="font-mono-tabular text-xs text-ink-muted">
                Source: {trail.sourceModule}
              </span>
            </dd>
          </div>

          <div>
            <dt className="font-mono-tabular text-xs font-semibold uppercase tracking-wider text-ink-muted">
              5. Counterfactual — What would change this?
            </dt>
            <dd className="mt-1 text-ink">{trail.counterfactual}</dd>
          </div>
        </dl>
      )}
    </div>
  )
}
