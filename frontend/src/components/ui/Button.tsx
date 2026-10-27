import React from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'reward' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'tactile-btn bg-brand text-brand-ink hover:bg-brand-hover font-bold',
  secondary:
    'tactile-btn bg-surface text-ink hover:bg-surface-raised font-bold',
  reward:
    'tactile-btn bg-reward text-reward-ink hover:opacity-95 font-bold',
  danger:
    'tactile-btn bg-danger text-surface hover:opacity-95 font-bold',
  ghost:
    'focus-ring min-h-11 min-w-11 rounded-sm border-2 border-transparent bg-transparent text-ink hover:bg-surface-raised hover:border-border font-medium',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm gap-2',
  md: 'px-4 py-2.5 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-3',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      className = '',
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const isDisabled = Boolean(disabled || isLoading)

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        className={`inline-flex items-center justify-center select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
        {...rest}
      >
        {isLoading ? (
          <span
            aria-hidden="true"
            className="inline-block w-4 h-4 rounded-pill border-2 border-current border-t-transparent animate-spin"
          />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    )
  },
)

Button.displayName = 'Button'
