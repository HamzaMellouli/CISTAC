import React from 'react'

export type CardVariant = 'default' | 'raised' | 'low-confidence' | 'danger'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  as?: 'div' | 'section' | 'article'
}

const CARD_VARIANTS: Record<CardVariant, string> = {
  default: 'tactile-card bg-surface text-ink',
  raised: 'tactile-card bg-surface-raised text-ink',
  'low-confidence':
    'rounded-md border-2 border-dashed border-border-strong bg-surface text-ink',
  danger: 'rounded-md border-2 border-danger bg-danger-subtle text-ink',
}

export function Card({
  variant = 'default',
  as: Component = 'div',
  className = '',
  children,
  ...rest
}: CardProps) {
  return (
    <Component
      className={`p-5 ${CARD_VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  )
}
