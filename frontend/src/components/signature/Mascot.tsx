import { Badge } from '../ui/Badge'

export type MascotState = 'idle' | 'hello' | 'thinking' | 'celebrate' | 'rest'

export interface MascotProps {
  state?: MascotState
  size?: 'sm' | 'md' | 'lg'
  title?: string
  message?: string
  badgeLabel?: string
  className?: string
  ariaHidden?: boolean
}

const STATE_METADATA: Record<
  MascotState,
  {
    defaultTitle: string
    defaultBadge: string
    badgeTone: 'neutral' | 'brand' | 'info' | 'reward' | 'warning'
    badgeGlyph: string
    ariaDescription: string
  }
> = {
  idle: {
    defaultTitle: 'Synapse Companion · Ready',
    defaultBadge: 'State: Idle',
    badgeTone: 'neutral',
    badgeGlyph: '●',
    ariaDescription:
      'Friendly geometric synaptic companion in calm idle posture',
  },
  hello: {
    defaultTitle: 'Synapse Companion · Welcome Guide',
    defaultBadge: 'State: Hello',
    badgeTone: 'brand',
    badgeGlyph: '✦',
    ariaDescription:
      'Friendly geometric synaptic companion waving hello with warm welcome nodes',
  },
  thinking: {
    defaultTitle: 'Synapse Companion · Synthesizing Telemetry',
    defaultBadge: 'State: Thinking',
    badgeTone: 'info',
    badgeGlyph: '◈',
    ariaDescription:
      'Geometric synaptic companion with orbiting calibration nodes while computing confidence intervals',
  },
  celebrate: {
    defaultTitle: 'Synapse Companion · Milestone Unlocked',
    defaultBadge: 'State: Celebrate',
    badgeTone: 'reward',
    badgeGlyph: '★',
    ariaDescription:
      'Geometric synaptic companion radiating celebratory reward sparks',
  },
  rest: {
    defaultTitle: 'Synapse Companion · Rest & Recharge Pacing',
    defaultBadge: 'State: Rest',
    badgeTone: 'warning',
    badgeGlyph: '◐',
    ariaDescription:
      'Geometric synaptic companion in calm resting posture with crescent moon indicator',
  },
}

export function Mascot({
  state = 'idle',
  size = 'md',
  title,
  message,
  badgeLabel,
  className = '',
  ariaHidden = false,
}: MascotProps) {
  const meta = STATE_METADATA[state]
  const resolvedTitle = title ?? meta.defaultTitle
  const resolvedBadge = badgeLabel ?? meta.defaultBadge

  const sizeClass =
    size === 'sm' ? 'h-12 w-12' : size === 'lg' ? 'h-20 w-20' : 'h-16 w-16'

  const renderGlyphSvg = () => (
    <svg
      viewBox="0 0 80 80"
      className={`${sizeClass} shrink-0 overflow-visible`}
      role={ariaHidden || message ? undefined : 'img'}
      aria-label={ariaHidden || message ? undefined : meta.ariaDescription}
      aria-hidden={ariaHidden || Boolean(message)}
    >
      {/* Outer Soft Aura Ring */}
      <circle
        cx="40"
        cy="40"
        r="35"
        fill="var(--color-surface)"
        stroke="var(--color-border-strong)"
        strokeWidth="2.5"
        strokeDasharray={state === 'thinking' ? '5 4' : undefined}
      />

      {/* State-Specific Background Accent */}
      {state === 'celebrate' && (
        <g stroke="var(--color-reward)" strokeWidth="2.5" strokeLinecap="round">
          <line x1="40" y1="3" x2="40" y2="9" />
          <line x1="40" y1="71" x2="40" y2="77" />
          <line x1="3" y1="40" x2="9" y2="40" />
          <line x1="71" y1="40" x2="77" y2="40" />
          <line x1="13" y1="13" x2="18" y2="18" />
          <line x1="67" y1="13" x2="62" y2="18" />
          <polygon
            points="66,22 68,26 72,27 68,29 66,33 64,29 60,27 64,26"
            fill="var(--color-reward)"
            stroke="var(--color-ink)"
            strokeWidth="1.2"
          />
        </g>
      )}

      {state === 'thinking' && (
        <g>
          <circle
            cx="16"
            cy="20"
            r="4.5"
            fill="var(--color-info)"
            stroke="var(--color-ink)"
            strokeWidth="1.8"
          />
          <circle
            cx="65"
            cy="22"
            r="3.5"
            fill="var(--color-reward)"
            stroke="var(--color-ink)"
            strokeWidth="1.8"
          />
          <line
            x1="20"
            y1="23"
            x2="28"
            y2="30"
            stroke="var(--color-ink)"
            strokeWidth="1.8"
            strokeDasharray="2 2"
          />
        </g>
      )}

      {state === 'rest' && (
        <path
          d="M58 14 A9 9 0 1 0 68 24 A7 7 0 1 1 58 14 Z"
          fill="var(--color-reward)"
          stroke="var(--color-ink)"
          strokeWidth="1.8"
        />
      )}

      {/* Synaptic Companion Body (Rounded Hexagonal Prism) */}
      <rect
        x="18"
        y="22"
        width="44"
        height="38"
        rx="12"
        fill={
          state === 'celebrate'
            ? 'var(--color-reward)'
            : state === 'rest'
              ? 'var(--color-surface-raised)'
              : 'var(--color-brand-subtle)'
        }
        stroke="var(--color-ink)"
        strokeWidth="2.8"
      />

      {/* Top Synaptic Antenna Node */}
      <line
        x1="40"
        y1="12"
        x2="40"
        y2="22"
        stroke="var(--color-ink)"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <circle
        cx="40"
        cy="10"
        r="4.5"
        fill={
          state === 'rest' ? 'var(--color-info)' : 'var(--color-reward)'
        }
        stroke="var(--color-ink)"
        strokeWidth="2.2"
      />

      {/* Waving Arm in 'hello' or 'celebrate' */}
      {(state === 'hello' || state === 'celebrate') && (
        <path
          d="M62 38 Q72 28 70 20"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}

      {/* Left Stabilizer Node */}
      <circle
        cx="14"
        cy="42"
        r="3.5"
        fill="var(--color-brand)"
        stroke="var(--color-ink)"
        strokeWidth="2"
      />

      {/* Expressive Visor Panel */}
      <rect
        x="24"
        y="29"
        width="32"
        height="18"
        rx="6"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth="2"
      />

      {/* Eyes by State */}
      {state === 'rest' ? (
        <g
          stroke="var(--color-ink)"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        >
          <path d="M29 38 Q33 42 37 38" />
          <path d="M43 38 Q47 42 51 38" />
        </g>
      ) : state === 'celebrate' ? (
        <g
          stroke="var(--color-ink)"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        >
          <path d="M29 40 Q33 34 37 40" />
          <path d="M43 40 Q47 34 51 40" />
        </g>
      ) : (
        <g fill="var(--color-ink)">
          <circle cx="33" cy="38" r="2.8" />
          <circle cx="47" cy="38" r="2.8" />
        </g>
      )}

      {/* Friendly Mouth / Telemetry Wave */}
      {state === 'thinking' ? (
        <line
          x1="34"
          y1="52"
          x2="46"
          y2="52"
          stroke="var(--color-ink)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
      ) : (
        <path
          d={
            state === 'celebrate'
              ? 'M33 50 Q40 57 47 50'
              : 'M34 51 Q40 55 46 51'
          }
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      )}
    </svg>
  )

  if (!message) {
    return renderGlyphSvg()
  }

  return (
    <div
      data-mascot-state={state}
      className={`rounded-md border-2 border-border-strong bg-surface-raised p-4 flex items-start gap-3.5 min-w-0 ${className}`}
    >
      {renderGlyphSvg()}
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <strong className="font-display text-sm font-bold text-ink">
            {resolvedTitle}
          </strong>
          <Badge tone={meta.badgeTone} glyph={meta.badgeGlyph}>
            {resolvedBadge}
          </Badge>
        </div>
        <p className="text-xs text-ink-muted leading-relaxed">{message}</p>
      </div>
    </div>
  )
}
