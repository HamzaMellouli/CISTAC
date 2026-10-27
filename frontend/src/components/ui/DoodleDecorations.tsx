/**
 * DoodleSquiggle: Hand-drawn sketched underline for titles & highlights.
 */
export function DoodleSquiggle({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-2 text-brand overflow-visible ${className}`}
      aria-hidden="true"
    >
      <path
        d="M 2,5 Q 16,1 30,5 T 58,5 T 86,5 T 98,5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * DoodleStar: Hand-drawn sketch star icon.
 */
export function DoodleStar({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="var(--color-border-strong)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <polygon points="12,2 15,8.5 22,9.2 17,14 18.5,21 12,17.5 5.5,21 7,14 2,9.2 9,8.5" />
    </svg>
  )
}

/**
 * DoodleArrow: Hand-drawn curly sketch arrow pointing to an action.
 */
export function DoodleArrow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 32"
      fill="none"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-12 h-8 overflow-visible ${className}`}
      aria-hidden="true"
    >
      <path d="M 4,6 C 14,2 32,8 38,20" />
      <path d="M 32,22 L 39,21 L 41,14" />
    </svg>
  )
}

/**
 * DoodleBadgePin: Hand-drawn pin/clip icon.
 */
export function DoodleBadgePin({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block w-3 h-3 rounded-pill bg-brand border border-border-strong ${className}`}
      aria-hidden="true"
    />
  )
}
