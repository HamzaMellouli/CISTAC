import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'
import { Badge } from '../ui/Badge'

export type NodiState =
  | 'idle'
  | 'hello'
  | 'curious'
  | 'thinking'
  | 'celebrate'
  | 'rest'
  | 'calm-shrug'
  | 'hidden'

export interface NodiCompanionProps {
  state?: NodiState
  size?: 'sm' | 'md' | 'lg' | 'docked' | 'hero'
  title?: string
  message?: string
  badgeLabel?: string
  calibratedCount?: number
  lowConfCount?: number
  totalDimensions?: number
  className?: string
  ariaHidden?: boolean
  showSpeechBubble?: boolean
}

interface StateSpec {
  defaultTitle: string
  defaultBadge: string
  badgeTone: 'neutral' | 'brand' | 'info' | 'reward' | 'warning'
  badgeGlyph: string
  defaultLine: string
  ariaDescription: string
}

const NODI_STATE_MAP: Record<NodiState, StateSpec> = {
  idle: {
    defaultTitle: 'Nodi · Seedling Guide',
    defaultBadge: 'State: Idle',
    badgeTone: 'neutral',
    badgeGlyph: '●',
    defaultLine: 'Every 2-minute block helps your cognitive twin grow with honest calibration.',
    ariaDescription: 'Nodi the friendly seedling neuron breathing calmly in idle posture',
  },
  hello: {
    defaultTitle: 'Nodi · Welcome Guide',
    defaultBadge: 'State: Hello',
    badgeTone: 'brand',
    badgeGlyph: '✦',
    defaultLine: 'Welcome back! Pick up wherever you like—zero streak pressure, just honest insights.',
    ariaDescription: 'Nodi waving a warm hello with swaying dendrite sprout',
  },
  curious: {
    defaultTitle: 'Nodi · Calibration Notice',
    defaultBadge: 'State: Curious',
    badgeTone: 'info',
    badgeGlyph: '◈',
    defaultLine: 'I need two more mini-blocks to be sure about your recall confidence band.',
    ariaDescription: 'Nodi tilting head curiously with pulsing embryonic dendrite bud',
  },
  thinking: {
    defaultTitle: 'Nodi · Synthesizing Telemetry',
    defaultBadge: 'State: Thinking',
    badgeTone: 'info',
    badgeGlyph: '◈',
    defaultLine: 'Putting your map together... computing ±95% confidence intervals across all dimensions.',
    ariaDescription: 'Nodi looking upward thoughtfully while synthesizing cognitive profile',
  },
  celebrate: {
    defaultTitle: 'Nodi · Block Completed',
    defaultBadge: 'State: Celebrate',
    badgeTone: 'reward',
    badgeGlyph: '★',
    defaultLine: 'Nice work! That trial counted toward narrowing your uncertainty bands.',
    ariaDescription: 'Nodi celebrating joyfully with raised arms and unfurled dendrite leaves',
  },
  rest: {
    defaultTitle: 'Nodi · Rest & Recharge',
    defaultBadge: 'State: Rest',
    badgeTone: 'warning',
    badgeGlyph: '◐',
    defaultLine: 'Rest is an essential part of cognitive training. Take a mindful pause today.',
    ariaDescription: 'Nodi resting peacefully with closed eyes and crescent moon indicator',
  },
  'calm-shrug': {
    defaultTitle: 'Nodi · Local Buffer Active',
    defaultBadge: 'State: Offline Buffer',
    badgeTone: 'warning',
    badgeGlyph: '⚡',
    defaultLine: 'Connection dropped. Your answers are saved safely on this device and will sync automatically.',
    ariaDescription: 'Nodi giving a gentle calm shrug with reassurance that data is preserved locally',
  },
  hidden: {
    defaultTitle: '',
    defaultBadge: '',
    badgeTone: 'neutral',
    badgeGlyph: '',
    defaultLine: '',
    ariaDescription: 'Nodi hidden during timed assessment block to prevent visual distraction',
  },
}

// 10 Anatomical Leaf & Bud Positions along the Central Dendrite Sprout
const LEAF_SLOTS = [
  { side: 'left', cx: 62, cy: 38, rot: -38 },
  { side: 'right', cx: 98, cy: 38, rot: 38 },
  { side: 'left', cx: 54, cy: 26, rot: -46 },
  { side: 'right', cx: 106, cy: 26, rot: 46 },
  { side: 'left', cx: 66, cy: 16, rot: -28 },
  { side: 'right', cx: 94, cy: 16, rot: 28 },
  { side: 'left', cx: 72, cy: 8, rot: -18 },
  { side: 'right', cx: 88, cy: 8, rot: 18 },
  { side: 'left', cx: 44, cy: 46, rot: -55 },
  { side: 'right', cx: 116, cy: 46, rot: 55 },
]

export function NodiCompanion({
  state = 'idle',
  size = 'md',
  title,
  message,
  badgeLabel,
  calibratedCount,
  lowConfCount,
  totalDimensions,
  className = '',
  ariaHidden = false,
  showSpeechBubble = true,
}: NodiCompanionProps) {
  const { reducedMotion, dimensionPreset } = useAppStore()
  const [blink, setBlink] = useState(false)

  // Periodic gentle blinking (Moment 5: Ambient companion loop)
  useEffect(() => {
    if (reducedMotion || state === 'rest' || state === 'hidden') return
    const blinkInterval = setInterval(() => {
      setBlink(true)
      const timeout = setTimeout(() => setBlink(false), 160)
      return () => clearTimeout(timeout)
    }, 4500)
    return () => clearInterval(blinkInterval)
  }, [reducedMotion, state])

  if (state === 'hidden') {
    return null
  }

  const spec = NODI_STATE_MAP[state]
  const resolvedTitle = title ?? spec.defaultTitle
  const resolvedBadge = badgeLabel ?? spec.defaultBadge
  const resolvedMessage = message ?? spec.defaultLine

  // Calculate leaves and buds based on dimension preset
  const presetNumber = totalDimensions ?? (parseInt(dimensionPreset, 10) || 6)
  const activeLeaves = calibratedCount ?? Math.min(presetNumber, state === 'celebrate' ? presetNumber : Math.max(1, presetNumber - 1))
  const activeBuds = lowConfCount ?? (state === 'curious' ? 1 : Math.max(0, presetNumber - activeLeaves))

  // Sizing scale: sm=48px, md=72px, lg=96px, docked=110px, hero=240px
  const sizeSvgClass =
    size === 'sm'
      ? 'h-12 w-12'
      : size === 'md'
        ? 'h-18 w-18'
        : size === 'lg'
          ? 'h-24 w-24'
          : size === 'docked'
            ? 'h-28 w-28'
            : 'h-48 w-48 sm:h-64 sm:w-64'

  const isHero = size === 'hero'
  const isDocked = size === 'docked'

  return (
    <div
      className={`inline-flex ${
        isHero
          ? 'flex-col items-center text-center gap-4'
          : isDocked
            ? 'flex-row items-center gap-4'
            : message
              ? 'flex-col sm:flex-row items-center sm:items-start gap-3.5'
              : 'items-center justify-center'
      } ${className}`}
    >
      {/* Nodi Animated Layered SVG */}
      <motion.div
        animate={
          reducedMotion || state === 'rest'
            ? undefined
            : {
                y: [0, -3, 0],
                rotate: state === 'curious' ? [0, 4, 0] : 0,
              }
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`${sizeSvgClass} shrink-0 select-none relative`}
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full overflow-visible"
          role={ariaHidden ? undefined : 'img'}
          aria-label={ariaHidden ? undefined : spec.ariaDescription}
          aria-hidden={ariaHidden}
        >
          {/* Group 1: Background Aura / Shadows */}
          <ellipse
            cx="80"
            cy="150"
            rx="46"
            ry="7"
            fill="var(--color-border)"
            opacity="0.25"
          />

          {/* Group 2: Central Dendrite Sprout Stem */}
          <path
            d="M 80 54 C 80 36, 76 24, 80 14"
            fill="none"
            stroke="var(--color-border-strong)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Group 3: Dendrite Leaves (Calibrated Dimensions) & Buds (Low-Confidence Dimensions) */}
          <g id="nodi-leaves">
            {LEAF_SLOTS.slice(0, presetNumber).map((slot, idx) => {
              const isCalibrated = idx < activeLeaves
              const isBud = !isCalibrated && idx < activeLeaves + activeBuds

              if (isCalibrated) {
                return (
                  <g
                    key={`leaf-${idx}`}
                    transform={`translate(${slot.cx}, ${slot.cy}) rotate(${slot.rot})`}
                  >
                    <path
                      d="M 0 0 C -6 -6, -6 -16, 0 -20 C 6 -16, 6 -6, 0 0 Z"
                      fill="var(--color-brand)"
                      stroke="var(--color-border-strong)"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="0"
                      y1="-2"
                      x2="0"
                      y2="-17"
                      stroke="var(--color-brand-subtle)"
                      strokeWidth="1"
                    />
                  </g>
                )
              }

              if (isBud) {
                return (
                  <g
                    key={`bud-${idx}`}
                    transform={`translate(${slot.cx}, ${slot.cy}) rotate(${slot.rot})`}
                  >
                    <circle
                      cx="0"
                      cy="-6"
                      r="4.5"
                      fill="var(--color-surface)"
                      stroke="var(--color-accent)"
                      strokeWidth="2"
                      strokeDasharray="2.5 1.5"
                    />
                  </g>
                )
              }

              return null
            })}
          </g>

          {/* Group 4: Top Apical Synapse Bulb */}
          <circle
            cx="80"
            cy="12"
            r="5"
            fill={state === 'celebrate' ? 'var(--color-reward)' : 'var(--color-brand)'}
            stroke="var(--color-border-strong)"
            strokeWidth="2.5"
          />

          {/* Group 5: Seedling Neuron Body (Soft Organic Teardrop Form) */}
          <path
            d="M 80 48 C 116 48, 134 74, 128 114 C 124 140, 106 148, 80 148 C 54 148, 36 140, 32 114 C 26 74, 44 48, 80 48 Z"
            fill={
              state === 'celebrate'
                ? 'var(--color-reward)'
                : state === 'rest'
                  ? 'var(--color-surface-raised)'
                  : 'var(--color-brand-subtle)'
            }
            stroke="var(--color-border-strong)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Group 6: Coral Blush Cheeks */}
          <ellipse
            cx="50"
            cy="104"
            rx="7"
            ry="4.5"
            fill="var(--color-accent)"
            opacity="0.45"
          />
          <ellipse
            cx="110"
            cy="104"
            rx="7"
            ry="4.5"
            fill="var(--color-accent)"
            opacity="0.45"
          />

          {/* Group 7: Eyes & Gaze Expression */}
          {state === 'rest' || blink ? (
            // Closed Sleeping / Blinking Eyelid Curves
            <g stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M 50 90 Q 60 98 70 90" />
              <path d="M 90 90 Q 100 98 110 90" />
            </g>
          ) : (
            // Big Expressive Open Anime Seedling Eyes
            <g id="nodi-eyes">
              {/* Left Eye */}
              <circle
                cx="60"
                cy={state === 'thinking' ? 83 : 88}
                r="9.5"
                fill="var(--color-ink)"
              />
              <circle
                cx={state === 'thinking' ? 58 : 57}
                cy={state === 'thinking' ? 80 : 85}
                r="3.5"
                fill="var(--color-surface)"
              />
              <circle
                cx={state === 'thinking' ? 62 : 63}
                cy={state === 'thinking' ? 86 : 91}
                r="1.8"
                fill="var(--color-surface)"
              />

              {/* Right Eye */}
              <circle
                cx="100"
                cy={state === 'thinking' ? 83 : 88}
                r="9.5"
                fill="var(--color-ink)"
              />
              <circle
                cx={state === 'thinking' ? 98 : 97}
                cy={state === 'thinking' ? 80 : 85}
                r="3.5"
                fill="var(--color-surface)"
              />
              <circle
                cx={state === 'thinking' ? 102 : 103}
                cy={state === 'thinking' ? 86 : 91}
                r="1.8"
                fill="var(--color-surface)"
              />
            </g>
          )}

          {/* Group 8: Mouth Expressions */}
          {state === 'hello' || state === 'celebrate' ? (
            // Big Joyous Smile
            <path
              d="M 72 108 Q 80 124 88 108 Z"
              fill="var(--color-ink)"
              stroke="var(--color-border-strong)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          ) : state === 'curious' || state === 'thinking' ? (
            // Curious O-Mouth
            <ellipse
              cx="80"
              cy="111"
              rx="4"
              ry="5"
              fill="var(--color-ink)"
            />
          ) : state === 'rest' ? (
            // Sleeping Peaceful Curve
            <path
              d="M 75 110 Q 80 114 85 110"
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          ) : (
            // Gentle Gentle Smile (Idle & Calm-shrug)
            <path
              d="M 73 108 Q 80 116 87 108"
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Group 9: Seedling Arms & Gestures */}
          {state === 'hello' ? (
            // Waving Right Arm
            <g stroke="var(--color-border-strong)" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M 40 102 Q 28 112 36 120" />
              <path d="M 120 100 Q 140 82 136 68" />
            </g>
          ) : state === 'celebrate' ? (
            // Victory Arms Raised High (\o/)
            <g stroke="var(--color-border-strong)" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M 40 98 Q 24 76 26 60" />
              <path d="M 120 98 Q 136 76 134 60" />
            </g>
          ) : state === 'calm-shrug' ? (
            // Reassuring Gentle Shrug
            <g stroke="var(--color-border-strong)" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M 40 102 Q 22 106 24 94" />
              <path d="M 120 102 Q 138 106 136 94" />
            </g>
          ) : (
            // Hands Resting on Belly
            <g stroke="var(--color-border-strong)" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M 40 102 Q 54 116 66 112" />
              <path d="M 120 102 Q 106 116 94 112" />
            </g>
          )}

          {/* Group 10: State Specific Accessories */}
          {state === 'celebrate' && (
            <g fill="var(--color-reward)" stroke="var(--color-border-strong)" strokeWidth="1">
              <polygon points="26,38 29,44 36,46 29,48 26,54 23,48 16,46 23,44" />
              <polygon points="134,38 137,44 144,46 137,48 134,54 131,48 124,46 131,44" />
            </g>
          )}

          {state === 'rest' && (
            // Crescent Moon
            <path
              d="M 122 24 A 10 10 0 1 0 132 34 A 7.5 7.5 0 1 1 122 24 Z"
              fill="var(--color-reward)"
              stroke="var(--color-border-strong)"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </motion.div>

      {/* Speech Bubble / Text Container */}
      {showSpeechBubble && (resolvedTitle || resolvedMessage) && (
        <div
          role={state === 'calm-shrug' || state === 'celebrate' ? 'status' : undefined}
          className={`${
            isHero
              ? 'max-w-md space-y-2'
              : 'space-y-1 rounded-2xl border border-border bg-surface-raised p-3.5 shadow-sm min-w-0'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            {resolvedTitle && (
              <span className="font-display text-sm font-bold text-ink">
                {resolvedTitle}
              </span>
            )}
            {resolvedBadge && (
              <Badge tone={spec.badgeTone} glyph={spec.badgeGlyph}>
                {resolvedBadge}
              </Badge>
            )}
          </div>
          {resolvedMessage && (
            <p className="text-xs text-ink-muted leading-relaxed">
              {resolvedMessage}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
