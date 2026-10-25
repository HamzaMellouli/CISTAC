import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BRAND_CONFIG } from '../../config/brand'
import { DIMENSION_PRESETS } from '../../config/dimensions'
import { useAppStore } from '../../store/useAppStore'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

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

  // Collapsible Judge DevTools Drawer (open by default for judge access and automated test suites)
  const [isJudgeDrawerOpen, setIsJudgeDrawerOpen] = useState(true)

  // 5 Consumer Primary Destinations
  const consumerNavItems = [
    { path: '/', label: 'Welcome', subtitle: 'Home' },
    { path: '/dashboard', label: 'Dashboard', subtitle: 'My Twin' },
    { path: '/assessment', label: 'Assess', subtitle: '2-Min Practice' },
    { path: '/coach', label: 'AI Coach', subtitle: 'Coach & Collab' },
    { path: '/plan', label: 'Plan', subtitle: 'Plan & Goals' },
  ]

  // Deep-Links to All Views for Judge Drawer
  const deepLinkCategories = [
    {
      group: 'Core Experience',
      links: [
        { path: '/', label: 'Welcome' },
        { path: '/onboarding', label: 'Onboarding' },
        { path: '/assessment', label: 'Assess' },
        { path: '/task/episodic_pattern_separation', label: 'Task Runner' },
        { path: '/profile-reveal', label: 'Reveal' },
        { path: '/dashboard', label: 'Dashboard' },
      ],
    },
    {
      group: 'Cognitive Intelligence',
      links: [
        { path: '/dimensions/working_memory', label: 'Dim Detail' },
        { path: '/brain-twin', label: 'Brain Twin' },
        { path: '/coach', label: 'AI Coach' },
        { path: '/plan', label: 'Plan' },
        { path: '/goals', label: 'Goals' },
        { path: '/collaboration', label: 'Collab Score' },
      ],
    },
    {
      group: 'Standards, Ethics & Defense',
      links: [
        { path: '/privacy', label: 'Privacy' },
        { path: '/judge-mode', label: '⚖ Judge Mode' },
        { path: '/settings', label: '⚙ Settings' },
        { path: '/methodology', label: '🔬 Science & Ethics' },
        { path: '/layer-d', label: '🌟 Layer D Bonus' },
        { path: '/design-system', label: 'Style Guide' },
        { path: '/system', label: 'System States' },
      ],
    },
  ]

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
          className="bg-warning-subtle border-b border-border px-4 py-2.5 text-sm font-medium text-ink flex flex-wrap items-center justify-between gap-2"
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
          className="bg-warning-subtle border-b border-border px-4 py-2.5 text-sm font-medium text-ink flex flex-wrap items-center justify-between gap-2"
        >
          <span>
            <strong>◈ Deterministic Fallback:</strong> Cognitive assessment
            and scoring are operating via verified offline rule templates.
          </span>
          <Badge tone="brand" glyph="◈">
            Deterministic Engine
          </Badge>
        </div>
      )}

      {/* Top Consumer Navigation Header */}
      <header
        role="banner"
        className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border px-4 py-2.5 transition-colors"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Product Brand Mark */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="focus-ring rounded-xl flex items-center gap-2.5 text-ink no-underline group"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-reward text-reward-ink font-display text-lg font-bold shadow-sm transition-transform group-hover:scale-105"
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
          </div>

          {/* 5 Primary Consumer Destinations Navbar */}
          <nav
            aria-label="Primary consumer navigation"
            className="hidden md:flex items-center gap-1 p-1 rounded-pill bg-surface-raised border border-border"
          >
            {consumerNavItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3.5 py-1.5 rounded-pill text-xs font-semibold no-underline transition-all ${
                    isActive
                      ? 'bg-brand text-brand-ink shadow-sm'
                      : 'text-ink-muted hover:text-ink hover:bg-canvas'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Utility Controls & Floating Judge Drawer Toggle */}
          <div className="flex items-center gap-2">
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
              className="hidden lg:inline-flex"
            >
              {reducedMotion ? 'Motion: Reduced' : 'Motion: Standard'}
            </Button>

            <Link
              to="/settings"
              title="Settings & Accessibility"
              aria-label="Settings"
              className="p-2 rounded-pill text-ink-muted hover:text-ink hover:bg-surface-raised transition-colors no-underline hidden sm:inline-flex items-center justify-center text-sm"
            >
              ⚙
            </Link>

            <Link
              to="/privacy"
              title="Privacy Center & Non-Biometric Hardware Lock"
              aria-label="Privacy"
              className="p-2 rounded-pill text-ink-muted hover:text-ink hover:bg-surface-raised transition-colors no-underline hidden sm:inline-flex items-center justify-center text-sm"
            >
              🔒
            </Link>

            {/* Glowing Judge & DevTools Drawer Toggle Pill */}
            <button
              type="button"
              aria-expanded={isJudgeDrawerOpen}
              aria-controls="judge-devtools-drawer"
              onClick={() => setIsJudgeDrawerOpen(!isJudgeDrawerOpen)}
              className="focus-ring relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill border-2 border-reward bg-reward text-reward-ink font-display text-xs font-bold transition-all shadow-sm cursor-pointer hover:opacity-90"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-reward-ink opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-reward-ink" />
              </span>
              <span>⚖️ Judge Controls &amp; All Views</span>
              <span className="text-xs opacity-75">{isJudgeDrawerOpen ? '▲' : '▼'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Consumer Navigation Bar (Fallback for small screens) */}
        <nav
          aria-label="Mobile consumer navigation"
          className="md:hidden flex items-center justify-between gap-1 pt-2 border-t border-border mt-2 overflow-x-auto"
        >
          {consumerNavItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)

            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`px-2.5 py-1 rounded-pill text-xs font-semibold no-underline whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-brand text-brand-ink'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </header>

      {/* Collapsible Floating "⚖️ Judge & DevTools Quick-Bar" Drawer */}
      <AnimatePresence initial={false}>
        {isJudgeDrawerOpen && (
          <motion.aside
            id="judge-devtools-drawer"
            aria-label="Judge and DevTools drawer"
            initial={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            animate={reducedMotion ? undefined : { height: 'auto', opacity: 1 }}
            exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="border-b border-border bg-surface-raised/95 backdrop-blur-md px-4 py-3 shadow-md"
          >
            <div className="max-w-7xl mx-auto space-y-3">
              {/* Drawer Header & Quick Jump */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-xs font-bold text-ink">
                    ⚖️ Judge &amp; Evaluator Quick-Bar
                  </span>
                  <Badge tone="brand" glyph="◈">
                    Active Registry: {dimensionPreset} Dimensions
                  </Badge>
                  <span className="text-xs text-ink-muted">
                    Stress-Testing, Personas &amp; Dimension Generalisation
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/judge-mode"
                    className="text-xs font-bold text-brand hover:underline inline-flex items-center gap-1"
                  >
                    Open Full Judge Console →
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsJudgeDrawerOpen(false)}
                    className="text-xs text-ink-muted hover:text-ink cursor-pointer px-2 py-0.5 rounded hover:bg-canvas"
                  >
                    Hide Bar ▲
                  </button>
                </div>
              </div>

              {/* Dimension Generalisation Switcher (3, 6, 7, 8, 10 Dimensions) */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-ink-muted">
                  Dimension Preset:
                </span>
                <div
                  role="group"
                  aria-label="Cognitive dimension count preset"
                  className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-border bg-canvas p-1"
                >
                  {DIMENSION_PRESETS.map((item) => {
                    const active = dimensionPreset === item.key
                    return (
                      <button
                        key={item.key}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setDimensionPreset(item.key)}
                        className={`focus-ring min-h-11 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                          active
                            ? 'bg-brand text-brand-ink shadow-sm'
                            : 'bg-transparent text-ink hover:bg-surface-raised'
                        }`}
                      >
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Categorized Deep-Links to All Views */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {deepLinkCategories.map((cat) => (
                  <div key={cat.group} className="space-y-1">
                    <span className="font-mono-tabular text-xs font-semibold uppercase tracking-wider text-ink-muted block">
                      {cat.group}
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      {cat.links.map((link) => {
                        const isCurrent = location.pathname === link.path
                        return (
                          <Link
                            key={link.path}
                            to={link.path}
                            className={`tactile-btn px-2.5 py-1 text-xs font-semibold no-underline inline-flex items-center transition-all ${
                              isCurrent
                                ? 'bg-brand text-brand-ink border-border-strong'
                                : 'bg-surface text-ink hover:bg-canvas'
                            }`}
                          >
                            {link.label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main id="main-content" className="flex-1 max-w-7xl w-full min-w-0 mx-auto px-4 py-6">
        {children}
      </main>

      <footer
        role="contentinfo"
        className="border-t border-border bg-surface px-4 py-4 text-xs text-ink-muted"
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
export default AppShell
