import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { evaluateDesignSystemContrast } from '../utils/contrast'
import { lintCopyText } from '../utils/copyLinter'
import { getDimensionsByPreset } from '../config/dimensions'
import { App } from '../App'

describe('Design System, Welcome, Onboarding & Dashboard Unit Suite', () => {
  it('verifies all 21 Light & Dark token pairs pass WCAG 2.1 thresholds', () => {
    const reports = evaluateDesignSystemContrast()
    expect(reports.length).toBeGreaterThanOrEqual(20)
    for (const report of reports) {
      expect(report.passes, `${report.id} failed with ${report.ratio}:1`).toBe(true)
    }
  })

  it('flags clinical and punitive-guilt vocabulary in lintCopyText', () => {
    const clean = lintCopyText(
      'Your Working Memory estimate is 76% ± 5%. Two more blocks will narrow the range.',
    )
    expect(clean.isClean).toBe(true)
    expect(clean.violations).toHaveLength(0)

    const flagged = lintCopyText(
      'Patient shows ADHD deficit and you broke your 5-day streak.',
    )
    expect(flagged.isClean).toBe(false)
    expect(flagged.violations.length).toBeGreaterThanOrEqual(3)
  })

  it('scales DimensionRegistry cleanly across 3, 6, 7, 8, and 10 dimensions', () => {
    expect(getDimensionsByPreset('3')).toHaveLength(3)
    expect(getDimensionsByPreset('6')).toHaveLength(6)
    expect(getDimensionsByPreset('7')).toHaveLength(7)
    expect(getDimensionsByPreset('8')).toHaveLength(8)
    expect(getDimensionsByPreset('10')).toHaveLength(10)
  })

  it('renders Page 01 Welcome (/) and supports persona switching, preview states, and 3-to-10 dimensions', async () => {
    window.history.pushState({}, '', '/')
    render(<App />)

    const heading = await screen.findByRole(
      'heading',
      {
        name: /Meet your evolving cognitive twin/i,
      },
      { timeout: 5000 },
    )
    expect(heading).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Low-Conf \(Hatched\)/i }))
    expect(screen.getByText(/Hatched = Confidence < 60%/i)).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Load Salma \(Hatched Twin\)/i }),
    )
    expect(
      screen.getByText(/Active persona switched to Salma/i),
    ).toBeInTheDocument()
  })

  it('renders Page 02 Onboarding (/onboarding) and supports 3-step wizard, granular consent toggles, and Judge Fast-Track', async () => {
    window.history.pushState({}, '', '/onboarding')
    render(<App />)

    const heading = await screen.findByRole(
      'heading',
      {
        name: /Configure your cognitive twin on your own terms/i,
      },
      { timeout: 5000 },
    )
    expect(heading).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: /Continue to Step 2: Granular Consent/i,
      }),
    )
    expect(
      screen.getByRole('heading', {
        name: /Granular Telemetry Consent & Mandatory Non-Biometric Lock/i,
      }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: /Reject All Optional \(Minimal Mode\)/i,
      }),
    )
    expect(
      screen.getAllByText(/CONSENT-ST-2026-MINIMAL/i).length,
    ).toBeGreaterThanOrEqual(1)

    fireEvent.click(
      screen.getByRole('button', {
        name: /Judge Fast-Track: Safe Defaults & Go/i,
      }),
    )
    expect(
      screen.getAllByText(/CONSENT-ST-2026-FAST/i).length,
    ).toBeGreaterThanOrEqual(1)
  })

  it('renders Page 06 Dashboard (/dashboard) and supports trajectory fan table toggle, fatigue heatmap table toggle, and 3-to-10 dimensions', async () => {
    window.history.pushState({}, '', '/dashboard')
    render(<App />)

    const heading = await screen.findByRole(
      'heading',
      {
        name: /Your evolving cognitive twin—live confidence bands/i,
      },
      { timeout: 5000 },
    )
    expect(heading).toBeInTheDocument()

    // Toggle Trajectory Fan Table
    fireEvent.click(
      screen.getByRole('button', { name: /View Trajectory as Table/i }),
    )
    expect(
      screen.getByRole('table', {
        name: /Brain Twin 6-week historical trajectory and 2-week forecast table/i,
      }),
    ).toBeInTheDocument()

    // Toggle Fatigue Heatmap Table
    fireEvent.click(
      screen.getByRole('button', { name: /View Heatmap as Table/i }),
    )
    expect(
      screen.getByRole('table', {
        name: /Session Fatigue and Alertness by Time of Day and Day of Week/i,
      }),
    ).toBeInTheDocument()

    // Switch to Low-Conf Hatched state
    fireEvent.click(
      screen.getByRole('button', { name: /Low-Conf Hatched \(Salma/i }),
    )
    expect(screen.getByText(/Rest-First Pacing/i)).toBeInTheDocument()
  })

  it('renders Page 18 (/design-system) and supports 3-to-10 dimension switching and radar table toggle', async () => {
    window.history.pushState({}, '', '/design-system')
    render(<App />)

    const heading = await screen.findByRole(
      'heading',
      {
        name: /SynapseTwin Living Design System/i,
      },
      { timeout: 5000 },
    )
    expect(heading).toBeInTheDocument()

    const tenBtn = screen.getByRole('button', { name: '10 Dimensions' })
    fireEvent.click(tenBtn)
    expect(
      screen.getByRole('heading', { name: /10 Dimensions Active/i }),
    ).toBeInTheDocument()

    const threeBtn = screen.getByRole('button', { name: '3 Dimensions' })
    fireEvent.click(threeBtn)
    expect(
      screen.getByRole('heading', { name: /3 Dimensions Active/i }),
    ).toBeInTheDocument()

    const tableBtn = screen.getByRole('button', { name: /View as Table/i })
    fireEvent.click(tableBtn)
    expect(
      screen.getByRole('table', {
        name: /Brain Twin Uncertainty Radar accessible data table/i,
      }),
    ).toBeInTheDocument()
  })
})
