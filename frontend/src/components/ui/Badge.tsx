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
  brand: 'bg-brand text-brand-ink border-border-strong',
  reward: 'bg-reward text-reward-ink border-border-strong font-bold',
  neutral: 'bg-surface-raised text-ink border-border',
  success: 'bg-success text-brand-ink border-border-strong',
  warning: 'bg-warning text-brand-ink border-border-strong',
  danger: 'bg-danger text-brand-ink border-border-strong',
  info: 'bg-info text-brand-ink border-border-strong',
  'low-confidence':
    'bg-surface-raised text-ink border-dashed border-border-strong',
}

export function Badge({
  tone = 'neutral',
  glyph,
  children,
  className = '',
  ...rest
}: BadgeProps) {
  const allowWrap = className.includes('whitespace-normal')
  const wrapClass = allowWrap
    ? 'whitespace-normal max-w-full text-start leading-snug'
    : 'whitespace-nowrap shrink-0 leading-none'
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill border text-xs font-medium ${wrapClass} ${TONE_CLASSES[tone]} ${className}`}
      {...rest}
    >
      {glyph && <span aria-hidden="true">{glyph}</span>}
      <span>{children}</span>
    </span>
  )
}
