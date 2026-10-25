import React from 'react'

export type CardVariant = 'default' | 'raised' | 'low-confidence' | 'danger' | 'editorial' | 'hero'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  as?: 'div' | 'section' | 'article'
}

const CARD_VARIANTS: Record<CardVariant, string> = {
  default: 'tactile-card bg-surface text-ink',
  raised: 'tactile-card bg-surface-raised text-ink',
  editorial: 'editorial-card text-ink',
  hero: 'hero-card text-ink',
  'low-confidence':
    'rounded-2xl border-2 border-dashed border-border-strong bg-surface text-ink shadow-sm',
  danger: 'rounded-2xl border border-danger bg-danger-subtle text-ink shadow-sm',
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
      className={`p-6 ${CARD_VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  )
}
export default Card
