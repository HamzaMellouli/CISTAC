import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  Target,
  Bot,
  TrendingUp,
  User,
  ShieldCheck,
  Settings,
  Moon,
  Sun,
  Scale,
  WifiOff,
  Cpu,
} from 'lucide-react'
import { BRAND_CONFIG } from '../../config/brand'
import { BrianLogo } from '../brand/BrianLogo'
import { DIMENSION_PRESETS } from '../../config/dimensions'
import { useAppStore } from '../../store/useAppStore'
import { telemetryQueue } from '../../services/telemetryQueue'
import { Badge } from '../ui/Badge'

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isTaskRoute = location.pathname.startsWith('/task')
  const {
    theme,
    toggleTheme,
    reducedMotion,
    setReducedMotion,
    dimensionPreset,
    setDimensionPreset,
    simulateOffline,
    simulateLlmDown,
    isJudgeDrawerOpen,
    setIsJudgeDrawerOpen,
    toggleJudgeDrawer,
  } = useAppStore()

  // Real offline queue status
  const [queueStatus, setQueueStatus] = useState(() => telemetryQueue.getStatus())

  useEffect(() => {
    return telemetryQueue.subscribe(() => {
      setQueueStatus(telemetryQueue.getStatus())
    })
  }, [])

  // Keyboard shortcut: Shift+J toggles Judge Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault()
        toggleJudgeDrawer()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 5 Primary Consumer Destinations
  const consumerNavItems = [
    { path: '/dashboard', label: 'Today', icon: Compass },
    { path: '/assessment', label: 'Practice', icon: Target },
    { path: '/coach', label: 'Coach', icon: Bot },
    { path: '/brain-twin', label: 'Progress', icon: TrendingUp },
    { path: '/settings', label: 'You', icon: User },
  ]

  // Deep-Links to All 19 Views for Judge Console
  const deepLinkCategories = [
    {
      group: 'Core Experience',
      links: [
        { path: '/', label: 'Welcome' },
        { path: '/onboarding', label: 'Onboarding' },
        { path: '/assessment', label: 'Assess Hub' },
        { path: '/task/episodic_pattern_separation', label: 'Task Runner' },
        { path: '/profile-reveal', label: 'Profile Reveal' },
        { path: '/dashboard', label: 'Today (Dashboard)' },
      ],
    },
    {
      group: 'Cognitive Intelligence',
      links: [
        { path: '/dimensions/working_memory', label: 'Dimension Detail' },
        { path: '/brain-twin', label: 'Brain Twin' },
        { path: '/coach', label: 'AI Coach' },
        { path: '/plan', label: 'Plan & Staircase' },
        { path: '/goals', label: 'Goals & Habit Contracts' },
        { path: '/collaboration', label: 'AI Collaboration Score' },
      ],
    },
    {
      group: 'Standards, Ethics & Defense',
      links: [
        { path: '/privacy', label: 'Privacy Center' },
        { path: '/judge-mode', label: 'Judge Console' },
        { path: '/settings', label: 'Settings & A11y' },
        { path: '/methodology', label: 'Science & Ethics' },
        { path: '/layer-d', label: 'Layer D Voice Studio' },
        { path: '/design-system', label: 'Style Guide' },
        { path: '/system', label: 'System States & 404' },
      ],
    },
  ]

  const isRealOffline = !queueStatus.isOnline
  const showOfflineBanner = simulateOffline || isRealOffline

  return (
    <div className={`min-h-screen flex flex-col bg-canvas text-ink ${location.pathname === '/' ? 'pb-0' : 'pb-16 md:pb-0'}`}>
      {/* Skip link for keyboard users (Tab stop 1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-sm focus:border-2 focus:border-border-strong focus:bg-brand focus:text-brand-ink focus:font-bold focus:shadow-doodle"
      >
        Skip to main content
      </a>

      {/* Global Robustness Banner (Truth in claims: Real queue status) */}
      {showOfflineBanner && (
        <div
          role="status"
          aria-live="polite"
          className="bg-warning-subtle border-b-2 border-border-strong px-4 py-2 text-xs md:text-sm font-bold text-ink flex flex-wrap items-center justify-between gap-2"
        >
          <span className="flex items-center gap-1.5">
            <WifiOff size={16} aria-hidden="true" className="text-warning" />
            {isRealOffline ? (
              <span>
                <strong>Connection dropped:</strong> Your answers are saved locally on this device ({queueStatus.queuedCount} in buffer).
              </span>
            ) : (
              <span>
                <strong>Offline Mode Active:</strong> Trial telemetry is buffered locally (up to 500 events) and will sync automatically when your connection returns ({queueStatus.queuedCount} queued).
              </span>
            )}
          </span>
          <Badge tone="warning" glyph="⚡">
            Queue Ready ({queueStatus.queuedCount} / {queueStatus.maxCapacity})
          </Badge>
        </div>
      )}

      {simulateLlmDown && (
        <div
          role="status"
          aria-live="polite"
          className="bg-info-subtle border-b-2 border-border-strong px-4 py-2 text-xs md:text-sm font-bold text-ink flex flex-wrap items-center justify-between gap-2"
        >
          <span className="flex items-center gap-1.5">
            <Cpu size={16} aria-hidden="true" className="text-brand" />
            <span>
              <strong>Deterministic Fallback:</strong> Cognitive assessment and coaching operating via verified rule templates.
            </span>
          </span>
          <Badge tone="info" glyph="◈">
            Deterministic Engine
          </Badge>
        </div>
      )}

      {/* Global Hand-Ink Wobble and Diagonal Hatch Filter Definitions */}
      <svg aria-hidden="true" className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id="hand-ink" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <pattern id="diagonalHatch" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2" stroke="var(--color-secondary)" strokeWidth="1.2" strokeOpacity="0.35" />
          </pattern>
        </defs>
      </svg>

      {/* Top Consumer Navigation Header with Doodle Sketch Border */}
      {!isTaskRoute && (
        <header
          role="banner"
          className="sticky top-0 z-40 h-16 bg-surface/95 backdrop-blur-md border-b-2 border-border-strong px-4 transition-colors flex items-center"
        >
          <div className="max-w-6xl w-full mx-auto flex items-center justify-between gap-4">
            {/* Product Brand Mark */}
            <Link
              to="/"
              title={`${BRAND_CONFIG.productName} Home`}
              className="focus-ring rounded-md flex items-center gap-2.5 text-ink no-underline group"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-brand text-brand-ink border-2 border-border-strong shadow-doodle-sm transition-transform group-hover:scale-105"
              >
                <BrianLogo size={22} className="text-brand-ink" />
              </span>
              <div>
                <span className="font-display text-base font-bold tracking-tight block leading-none">
                  {BRAND_CONFIG.productName}
                </span>
                <span className="text-xs text-ink-muted block mt-0.5">
                  {BRAND_CONFIG.challengeBadge}
                </span>
              </div>
            </Link>

            {/* 5 Primary Consumer Destinations Navbar (Desktop) or Skip intro on Welcome first run */}
            {location.pathname === '/' ? (
              <div className="flex-1 flex justify-end items-center mr-2">
                <Link
                  to="/dashboard"
                  className="focus-ring px-3.5 py-1.5 rounded-sm text-xs sm:text-sm font-bold text-ink hover:bg-brand-subtle transition-colors no-underline inline-flex items-center gap-1.5 border-2 border-border-strong shadow-doodle-sm"
                >
                  <span>Skip intro</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            ) : (
              <nav
                aria-label="Primary product navigation"
                className="hidden md:flex items-center gap-1 p-1 rounded-pill bg-surface-raised border-2 border-border-strong shadow-doodle-sm"
              >
                {consumerNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    item.path === '/dashboard'
                      ? location.pathname === '/dashboard'
                      : location.pathname.startsWith(item.path)

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-bold no-underline transition-all ${
                        isActive
                          ? 'bg-brand text-brand-ink border border-border-strong shadow-doodle-sm'
                          : 'text-ink-muted hover:text-ink hover:bg-canvas'
                      }`}
                    >
                      <Icon size={14} aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            )}

            {/* Protected Streak Pill matching Stitch */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-surface-raised border-2 border-border-strong rounded-pill shadow-doodle-sm">
              <span className="text-danger text-xs" aria-hidden="true">🔥</span>
              <span className="font-mono text-xs text-ink font-semibold">12d · Wed Rest</span>
            </div>

            {/* Utility Controls & Floating Judge Drawer Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={reducedMotion ? 'Motion: Off' : 'Motion: On'}
                title={reducedMotion ? 'Animations: Reduced' : 'Animations: Standard'}
                onClick={() => setReducedMotion(!reducedMotion)}
                className="focus-ring px-2.5 py-1 rounded-sm text-xs font-bold text-ink-muted hover:text-ink hover:bg-surface-raised border border-border-strong transition-colors cursor-pointer hidden lg:inline-flex"
              >
                {reducedMotion ? 'Motion: Off' : 'Motion: On'}
              </button>

              <button
                type="button"
                aria-label={theme === 'light' ? 'Switch to Dark (Night Lab)' : 'Switch to Light (Playful Lab)'}
                title={theme === 'light' ? 'Switch to Dark (Night Lab)' : 'Switch to Light (Playful Lab)'}
                onClick={toggleTheme}
                className="focus-ring p-2 rounded-sm border border-border-strong bg-surface text-ink hover:bg-surface-raised shadow-doodle-sm transition-colors cursor-pointer"
              >
                {theme === 'light' ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
              </button>

              <Link
                to="/privacy"
                title="Privacy Center & Non-Biometric Lock"
                aria-label="Privacy Center"
                className="focus-ring p-2 rounded-sm border border-border-strong bg-surface text-ink hover:bg-surface-raised shadow-doodle-sm transition-colors no-underline hidden sm:inline-flex items-center justify-center"
              >
                <ShieldCheck size={16} aria-hidden="true" />
              </Link>

              <Link
                to="/settings"
                title="Settings & Accessibility Controls"
                aria-label="Settings"
                className="focus-ring p-2 rounded-sm border border-border-strong bg-surface text-ink hover:bg-surface-raised shadow-doodle-sm transition-colors no-underline hidden sm:inline-flex items-center justify-center"
              >
                <Settings size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* Discreet Judge Mode Trigger for Practice Mode */}
      {isTaskRoute && (
        <aside
          aria-label="Competition evaluator drawer toggle"
          className="fixed bottom-2 right-2 z-50"
        >
          <button
            type="button"
            aria-expanded={isJudgeDrawerOpen}
            aria-controls="judge-devtools-drawer"
            onClick={() => toggleJudgeDrawer()}
            title="Evaluator Mode & Dimension Presets (Shift+J)"
            className="focus-ring inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-mono font-bold text-ink bg-surface border-2 border-border-strong shadow-doodle-sm hover:bg-surface-raised transition-colors cursor-pointer"
          >
            <Scale size={12} aria-hidden="true" className="text-ink" />
            <span>Judge Mode</span>
            <kbd className="text-xs font-mono text-ink font-bold">⇧J</kbd>
          </button>
        </aside>
      )}

      {/* Collapsible "Judge & Evaluator Console" Drawer (Closed by default) */}
      <AnimatePresence initial={false}>
        {isJudgeDrawerOpen && (
          <motion.aside
            id="judge-devtools-drawer"
            aria-label="Judge and Evaluator Console"
            initial={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            animate={reducedMotion ? undefined : { height: 'auto', opacity: 1 }}
            exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="border-b-2 border-border-strong bg-surface-raised/95 backdrop-blur-md px-4 py-3 shadow-doodle-lg"
          >
            <div className="max-w-6xl mx-auto space-y-3">
              {/* Drawer Header & Quick Jump */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b-2 border-border-strong">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-xs font-bold text-ink flex items-center gap-1">
                    <Scale size={14} aria-hidden="true" />
                    <span>Competition Evaluator Console</span>
                  </span>
                  <Badge tone="brand" glyph="◈">
                    Active Registry: {dimensionPreset} Dimensions
                  </Badge>
                  <span className="text-xs text-ink-muted">
                    Preset Switching, Personas &amp; Fault Injection
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={theme === 'light' ? 'Switch to Dark (Night Lab)' : 'Switch to Light (Playful Lab)'}
                    title={theme === 'light' ? 'Switch to Dark (Night Lab)' : 'Switch to Light (Playful Lab)'}
                    onClick={toggleTheme}
                    className="focus-ring px-2.5 py-1 rounded-sm text-xs font-bold text-ink hover:bg-surface border-2 border-border-strong transition-colors cursor-pointer inline-flex items-center gap-1 shadow-doodle-sm"
                  >
                    {theme === 'light' ? <Moon size={13} aria-hidden="true" /> : <Sun size={13} aria-hidden="true" />}
                    <span>{theme === 'light' ? 'Dark (Night Lab)' : 'Light (Playful Lab)'}</span>
                  </button>
                  <Link
                    to="/judge-mode"
                    className="text-xs font-bold text-ink hover:text-brand hover:underline inline-flex items-center gap-1"
                  >
                    Open Full Judge Console →
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsJudgeDrawerOpen(false)}
                    className="text-xs text-ink-muted hover:text-ink cursor-pointer px-2 py-0.5 rounded-sm hover:bg-canvas"
                  >
                    Close Dock ▲
                  </button>
                </div>
              </div>

              {/* Dimension Generalisation Switcher (3, 6, 7, 8, 10 Dimensions) */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-ink">
                  Dimension Preset:
                </span>
                <div
                  role="group"
                  aria-label="Cognitive dimension count preset"
                  className="inline-flex flex-wrap items-center gap-1 rounded-sm border-2 border-border-strong bg-canvas p-1"
                >
                  {DIMENSION_PRESETS.map((item) => {
                    const active = dimensionPreset === item.key
                    return (
                      <button
                        key={item.key}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setDimensionPreset(item.key)}
                        className={`focus-ring px-3 py-1 rounded-sm text-xs font-bold cursor-pointer transition-all ${
                          active
                            ? 'bg-brand text-brand-ink border border-border-strong shadow-xs'
                            : 'bg-transparent text-ink hover:bg-surface-raised'
                        }`}
                      >
                        {item.label}
                      </button>
                    )
                  })}
                </div>

                <span className="text-xs text-ink-muted ms-2">
                  (Default: 6 Calibrated Dimensions matching Assessment Engine)
                </span>
              </div>

              {/* Categorized Deep-Links to All 19 Views */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {deepLinkCategories.map((cat) => (
                  <div key={cat.group} className="space-y-1">
                    <span className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-ink-muted block">
                      {cat.group}
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      {cat.links.map((link) => {
                        const isCurrent = location.pathname === link.path
                        return (
                          <Link
                            key={link.path}
                            to={link.path}
                            className={`px-2.5 py-1 text-xs font-bold rounded-sm no-underline inline-flex items-center transition-all ${
                              isCurrent
                                ? 'bg-brand text-brand-ink border border-border-strong shadow-xs'
                                : 'bg-surface text-ink hover:bg-canvas border border-border'
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

      {/* Main Content Column */}
      <main
        id="main-content"
        className={`flex-1 w-full min-w-0 mx-auto px-4 ${
          isTaskRoute
            ? 'max-w-4xl py-2 sm:py-4 flex flex-col justify-between'
            : 'max-w-6xl py-8'
        }`}
      >
        {children}
      </main>

      {/* Product Footer with Quiet Demo Data Badge & Evaluator Link */}
      {!isTaskRoute && (
        <footer
          role="contentinfo"
          className="border-t-2 border-border-strong bg-surface px-4 py-4 text-xs text-ink-muted"
        >
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-bold bg-surface-raised border border-border-strong text-ink">
                Demo Data Mode
              </span>
              <p className="m-0">{BRAND_CONFIG.nonClinicalNotice}</p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsJudgeDrawerOpen(true)}
                className="text-xs font-bold text-ink hover:text-brand inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Scale size={13} aria-hidden="true" />
                <span>Judge Mode</span>
                <kbd className="hidden lg:inline text-xs font-mono text-ink font-bold">⇧J</kbd>
              </button>
              <span className="font-mono-tabular text-ink-muted">
                Registry: {dimensionPreset} dims · Theme: {theme}
              </span>
            </div>
          </div>
        </footer>
      )}

      {/* Mobile Bottom Tab Bar */}
      {location.pathname !== '/' && !isTaskRoute && (
        <nav
          aria-label="Mobile bottom navigation"
          className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t-2 border-border-strong flex items-center justify-around py-1.5 px-2"
        >
          {consumerNavItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.path === '/dashboard'
                ? location.pathname === '/dashboard'
                : location.pathname.startsWith(item.path)

            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-sm text-xs no-underline transition-all ${
                  isActive
                    ? 'text-brand font-bold'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      )}
    </div>
  )
}

export default AppShell
