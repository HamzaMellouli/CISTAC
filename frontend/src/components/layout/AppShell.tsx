import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BRAND_CONFIG } from '../../config/brand'
import type { DimensionPresetKey } from '../../config/dimensions'
import { useAppStore } from '../../store/useAppStore'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

const DIMENSION_PRESETS: readonly { key: DimensionPresetKey; label: string }[] = [
  { key: '3', label: '3 Dims' },
  { key: '6', label: '6 Dims' },
  { key: '7', label: '7 Dims (Default)' },
  { key: '10', label: '10 Dims (Stress)' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const {
    theme,
    toggleTheme,
    reducedMotion,
    setReducedMotion,
    dimensionPreset,
    setDimensionPreset,
    simulateOffline,
    simulateLlmDown,
  } = useAppStore()

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:bg-brand focus:text-brand-ink focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Global Robustness Banners (Offline & LLM-Down fallback) */}
      {simulateOffline && (
        <div
          role="status"
          aria-live="polite"
          className="bg-warning-subtle border-b-2 border-border-strong px-4 py-2.5 text-sm font-medium text-ink flex flex-wrap items-center justify-between gap-2"
        >
          <span>
            <strong>▲ Offline Mode Active:</strong> Trial telemetry is buffered
            locally (up to 500 events) and will sync automatically when your
            connection returns.
          </span>
          <Badge tone="warning" glyph="⚡">
            Local Queue Ready
          </Badge>
        </div>
      )}

      {simulateLlmDown && (
        <div
          role="status"
          aria-live="polite"
          className="bg-info-subtle border-b-2 border-border-strong px-4 py-2.5 text-sm font-medium text-ink flex flex-wrap items-center justify-between gap-2"
        >
          <span>
            <strong>◆ AI Coach LLM Unavailable:</strong> Deterministic
            SAT-JEPA rule engine is active so your explanations and adaptive
            plan continue uninterrupted.
          </span>
          <Badge tone="info" glyph="⚙">
            Deterministic Fallback
          </Badge>
        </div>
      )}

      {/* Primary Header & Judge Quick Controls */}
      <header
        role="banner"
        className="sticky top-0 z-40 bg-surface border-b-2 border-border-strong px-4 py-2.5"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/"
              className="focus-ring rounded-sm flex items-center gap-2 text-ink no-underline"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border-2 border-border-strong bg-reward text-reward-ink font-display text-lg font-bold"
              >
                ST
              </span>
              <div>
                <span className="font-display text-lg font-bold tracking-tight block leading-none">
                  {BRAND_CONFIG.productName}
                </span>
                <span className="text-xs text-ink-muted block mt-0.5">
                  {BRAND_CONFIG.challengeBadge}
                </span>
              </div>
            </Link>
            <Badge tone="neutral" glyph="◈">
              Simulated Data · Mock Adapter
            </Badge>
          </div>

          <nav
            aria-label="Global controls and dimension generalisation switcher"
            className="flex flex-wrap items-center gap-2"
          >
            <div
              role="group"
              aria-label="Cognitive dimension count preset"
              className="inline-flex flex-wrap items-center gap-1 rounded-md border-2 border-border-strong bg-canvas p-1"
            >
              {DIMENSION_PRESETS.map((item) => {
                const active = dimensionPreset === item.key
                return (
                  <button
                    key={item.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setDimensionPreset(item.key)}
                    className={`focus-ring min-h-11 px-2.5 py-1 rounded-sm text-xs font-semibold cursor-pointer ${
                      active
                        ? 'bg-brand text-brand-ink'
                        : 'bg-transparent text-ink hover:bg-surface-raised'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>

            <Button
              variant="secondary"
              size="sm"
              aria-pressed={theme === 'dark'}
              onClick={toggleTheme}
            >
              {theme === 'light' ? '☾ Dark (Night Lab)' : '☀ Light (Playful Lab)'}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              aria-pressed={reducedMotion}
              onClick={() => setReducedMotion(!reducedMotion)}
            >
              {reducedMotion ? 'Motion: Reduced' : 'Motion: Standard'}
            </Button>

            {location.pathname !== '/' && (
              <Link
                to="/"
                className="tactile-btn bg-surface text-ink px-3 py-2 text-sm font-semibold inline-flex items-center no-underline"
              >
                Welcome
              </Link>
            )}

            {location.pathname !== '/onboarding' && (
              <Link
                to="/onboarding"
                className="tactile-btn bg-surface text-ink px-3 py-2 text-sm font-semibold inline-flex items-center no-underline"
              >
                Onboarding
              </Link>
            )}

            {location.pathname !== '/dashboard' && (
              <Link
                to="/dashboard"
                className="tactile-btn bg-surface text-ink px-3 py-2 text-sm font-semibold inline-flex items-center no-underline"
              >
                Dashboard
              </Link>
            )}

            {location.pathname !== '/design-system' && (
              <Link
                to="/design-system"
                className="tactile-btn bg-surface text-ink px-3 py-2 text-sm font-semibold inline-flex items-center no-underline"
              >
                Style Guide
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main id="main-content" className="flex-1 max-w-7xl w-full min-w-0 mx-auto px-4 py-6">
        {children}
      </main>

      <footer
        role="contentinfo"
        className="border-t-2 border-border-strong bg-surface px-4 py-4 text-xs text-ink-muted"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <p>{BRAND_CONFIG.nonClinicalNotice}</p>
          <p className="font-mono-tabular">
            Active Registry: {dimensionPreset} dimensions · Theme: {theme}
          </p>
        </div>
      </footer>
    </div>
  )
}
