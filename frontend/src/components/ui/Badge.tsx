import React from 'react'

export type BadgeTone =
  | 'brand'
  | 'reward'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'low-confidence'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  glyph?: string
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  brand: 'bg-brand text-brand-ink border-border-strong font-bold',
  reward: 'bg-reward text-reward-ink border-border-strong font-bold',
  neutral: 'bg-surface-raised text-ink border-border-strong font-semibold',
  success: 'bg-success text-brand-ink border-border-strong font-bold',
  warning: 'bg-warning text-brand-ink border-border-strong font-bold',
  danger: 'bg-danger text-surface border-border-strong font-bold',
  info: 'bg-info text-brand-ink border-border-strong font-bold',
  'low-confidence':
    'bg-surface-raised text-ink border-dashed border-border-strong font-medium',
}

export function Badge({
  tone = 'neutral',
  glyph,
  children,
  className = '',
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border-2 text-xs font-medium max-w-full whitespace-normal sm:whitespace-nowrap text-start leading-snug sm:leading-none ${TONE_CLASSES[tone]} ${className}`}
      {...rest}
    >
      {glyph && <span aria-hidden="true" className="shrink-0">{glyph}</span>}
      <span className="min-w-0 break-words">{children}</span>
    </span>
  )
}
