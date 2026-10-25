import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { evaluateDesignSystemContrast } from '../utils/contrast'
import { lintCopyText } from '../utils/copyLinter'
import { getDimensionsByPreset } from '../config/dimensions'
import { useAppStore } from '../store/useAppStore'
import { App } from '../App'

describe('Wave 1 & Wave 2 Pages & Design System Unit Suite', () => {
  beforeEach(() => {
    useAppStore.getState().resetDemoState()
  })
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

  it('renders Page 03 Assessment Hub (/assessment) and supports session modes, table toggle, and /v1/tasks/next payload inspector', async () => {
    window.history.pushState({}, '', '/assessment')
    render(<App />)

    const heading = await screen.findByRole(
      'heading',
      {
        name: /Calibrate your cognitive twin—2-minute adaptive micro-tasks/i,
      },
      { timeout: 5000 },
    )
    expect(heading).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /View Task Queue as Table/i }),
    )
    expect(
      screen.getByRole('table', {
        name: /Assessment Hub cognitive task queue table/i,
      }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Inspect Payload JSON/i }),
    )
    expect(
      screen.getByText(/low_confidence_hatched_band_narrowing/i),
    ).toBeInTheDocument()
  })

  it('renders Page 04 Task Runner (/task/:dimId) with Zero-Distraction Mascot Lock, Tab-Blur Auto-Pause, and live telemetry table toggle', async () => {
    window.history.pushState({}, '', '/task/episodic_pattern_separation')
    render(<App />)

    const heading = await screen.findByRole(
      'heading',
      {
        name: /Mnemonic Similarity Task/i,
      },
      { timeout: 5000 },
    )
    expect(heading).toBeInTheDocument()
    expect(
      screen.getByText(/Zero-Distraction Lock: Mascot Hidden/i),
    ).toBeInTheDocument()

    // Toggle Telemetry Table
    fireEvent.click(
      screen.getByRole('button', { name: /View Telemetry as Table/i }),
    )
    expect(
      screen.getByRole('table', {
        name: /Recorded trial telemetry events table/i,
      }),
    ).toBeInTheDocument()

    // Trigger Tab-Blur Auto-Pause
    fireEvent.click(
      screen.getByRole('button', { name: /Simulate Tab-Blur Pause/i }),
    )
    expect(
      screen.getByRole('heading', {
        name: /Trial Auto-Paused — Focus Left Window/i,
      }),
    ).toBeInTheDocument()

    // Resume and Fast-Forward to Summary (where Mascot Celebrate re-engages)
    fireEvent.click(
      screen.getByRole('button', { name: /Fast-Forward to Summary/i }),
    )
    expect(
      screen.getByRole('heading', {
        name: /Episodic Pattern Separation confidence interval narrowed!/i,
      }),
    ).toBeInTheDocument()
  })

  it('renders Page 05 Profile Reveal (/profile-reveal) and supports 5-state Mascot switcher, confidence filters, and snapshot JSON inspector', async () => {
    window.history.pushState({}, '', '/profile-reveal')
    render(<App />)

    const heading = await screen.findByRole(
      'heading',
      {
        name: /Meet your initial Cognitive Twin—calibrated strengths/i,
      },
      { timeout: 5000 },
    )
    expect(heading).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: /First-Session Hatched \(Salma/i,
      }),
    )
    expect(
      screen.getByText(/Exploratory Fast-Responder \(Preliminary Profile\)/i),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'thinking' }))
    expect(screen.getByText(/State: thinking/i)).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Inspect Snapshot JSON/i }),
    )
    expect(screen.getByText(/SNAP-2026-SALMA-01/i)).toBeInTheDocument()
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

    fireEvent.click(
      screen.getByRole('button', { name: /View Trajectory as Table/i }),
    )
    expect(
      screen.getByRole('table', {
        name: /Brain Twin 6-week historical trajectory and 2-week forecast table/i,
      }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /View Heatmap as Table/i }),
    )
    expect(
      screen.getByRole('table', {
        name: /Session Fatigue and Alertness by Time of Day and Day of Week/i,
      }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Low-Conf Hatched \(Salma/i }),
    )
    expect(screen.getByText(/Rest-First Pacing/i)).toBeInTheDocument()
  })

  it('renders Page 08 Brain Twin (/brain-twin) with Signature #2 BrainTwinTimeTravel scrubber, snapshot diff table toggle, and manifold trajectory', async () => {
    window.history.pushState({}, '', '/brain-twin')
    render(<App />)

    const heading = await screen.findByRole(
      'heading',
      {
        name: /Longitudinal Brain Twin & Time-Travel Studio/i,
      },
      { timeout: 5000 },
    )
    expect(heading).toBeInTheDocument()

    // Toggle Snapshot Diff Table
    fireEvent.click(
      screen.getByRole('button', { name: /View Snapshot Diff as Table/i }),
    )
    expect(
      screen.getByRole('table', {
        name: /Side-by-side historical snapshot comparison table/i,
      }),
    ).toBeInTheDocument()

    // Scrub to Early Snapshot (#1)
    fireEvent.click(
      screen.getByRole('button', { name: /2 · Scrub to Snap #1 \(Hatched\)/i }),
    )
    expect(
      screen.getAllByText(/Day 1 Cold Baseline/i).length,
    ).toBeGreaterThanOrEqual(1)
  })

  it('renders Page 09 AI Coach (/coach) with WhyThisPanel, Deterministic Fallback toggle, Coach Log Table, and Copy Guardrail Inspector', async () => {
    window.history.pushState({}, '', '/coach')
    render(<App />)

    const heading = await screen.findByRole(
      'heading',
      {
        name: /Explainable AI Coach & Cognitive Strategy Studio/i,
      },
      { timeout: 5000 },
    )
    expect(heading).toBeInTheDocument()

    // Toggle Deterministic Rule Fallback
    fireEvent.click(
      screen.getByRole('button', {
        name: /Simulate LLM Down \(Fallback\)/i,
      }),
    )
    expect(
      screen.getAllByText(/deterministic_fallback/i).length,
    ).toBeGreaterThanOrEqual(1)

    // Toggle Guardrail Interception Demo
    fireEvent.click(
      screen.getByRole('button', { name: /Test Guardrail Interception/i }),
    )
    expect(
      screen.getByText(/Intercepted \(3 Rules\)/i),
    ).toBeInTheDocument()

    // Toggle Coach Log Table
    fireEvent.click(
      screen.getByRole('button', { name: /View Coach Log as Table/i }),
    )
    expect(
      screen.getByRole('table', {
        name: /AI Coach recommendations and reasoning log table/i,
      }),
    ).toBeInTheDocument()

    // Reset simulateLlmDown so subsequent tests start clean
    fireEvent.click(
      screen.getByRole('button', {
        name: /Deterministic Fallback: ON/i,
      }),
    )
  })

  it('renders Page 07 Dimension Detail (/dimensions/:dimId) with ProjectionFanChart, Session Trial Log Table, Psychometric Formula, and Biases', async () => {
    window.history.pushState({}, '', '/dimensions/working_memory')
    render(<App />)

    const heading = await screen.findByRole(
      'heading',
      {
        name: /WM · Working Memory/i,
        level: 1,
      },
      { timeout: 5000 },
    )
    expect(heading).toBeInTheDocument()

    // Check Session Trial Log table
    expect(
      screen.getByRole('table', {
        name: /Recent calibration sessions for Working Memory/i,
      }),
    ).toBeInTheDocument()

    // Switch to Hatched (<60% CI) state (jumps to Episodic Pattern Separation)
    fireEvent.click(
      screen.getByRole('button', { name: /2 · ⚡ Hatched \(<60% CI\)/i }),
    )
    expect(
      await screen.findByRole('heading', {
        name: /EP · Episodic Pattern Separation/i,
        level: 1,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Diagonal SVG Hatching Active/i),
    ).toBeInTheDocument()

    // Toggle Raw Telemetry JSON inspector
    fireEvent.click(
      screen.getByRole('button', { name: /View Telemetry JSON/i }),
    )
    expect(
      screen.getByRole('region', {
        name: /Dimension telemetry summary JSON payload/i,
      }),
    ).toBeInTheDocument()
  })

  it('renders Page 10 Plan & Adaptive Exercises (/plan) with 7-day ribbon, prescribed exercise cards, delta-c table, and staircase simulator', async () => {
    window.history.pushState({}, '', '/plan')
    render(<App />)

    const heading = await screen.findByRole(
      'heading',
      {
        name: /Adaptive Training Plan & Staircase Curriculum/i,
        level: 1,
      },
      { timeout: 5000 },
    )
    expect(heading).toBeInTheDocument()

    // Verify 7-day ribbon exists
    expect(
      screen.getByRole('group', {
        name: /Weekly training schedule day selector/i,
      }),
    ).toBeInTheDocument()

    // Verify SAT-JEPA Delta-C table exists
    expect(
      screen.getByRole('table', {
        name: /SAT-JEPA delta-c weekly allocation breakdown/i,
      }),
    ).toBeInTheDocument()

    // Switch to Rest-First Pacing preview state
    fireEvent.click(
      screen.getByRole('button', { name: /2 · ☾ Rest-First Pacing/i }),
    )
    expect(
      screen.getByText(/Scheduled Recovery & Memory Consolidation Day/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Streak Protected \(Zero Penalty\)/i),
    ).toBeInTheDocument()

    // Test Staircase Simulator stepper
    fireEvent.click(screen.getByRole('button', { name: 'Lvl 5' }))
    expect(
      screen.getByText(/Level 5 · Peak Attentional Stretch/i),
    ).toBeInTheDocument()
  })

  it('renders Page 12 AI Collaboration Score (/collaboration) with Signature #5 CollaborationScoreCard, dynamic weights, action simulator, and longitudinal curve', async () => {
    window.history.pushState({}, '', '/collaboration')
    render(<App />)

    const heading = await screen.findByRole(
      'heading',
      {
        name: /AI Collaboration Score Deep-Dive/i,
        level: 1,
      },
      { timeout: 5000 },
    )
    expect(heading).toBeInTheDocument()

    // Verify mandatory non-validated badges
    const badges = screen.getAllByText(/Design proposal, not validated/i)
    expect(badges.length).toBeGreaterThanOrEqual(1)

    // Verify Signature #5 heading
    expect(
      screen.getByRole('heading', {
        name: /Signature #5: AI Collaboration Score/i,
        level: 2,
      }),
    ).toBeInTheDocument()

    // Verify baseline score exists
    expect(screen.getByText('82')).toBeInTheDocument()

    // Switch to Dynamic Archetype Weights
    const dynamicWeightsBtn = screen.getByRole('button', {
      name: /Dynamic Archetype Weights/i,
    })
    fireEvent.click(dynamicWeightsBtn)
    expect(dynamicWeightsBtn).toHaveAttribute('aria-pressed', 'true')

    // Test Action Simulator button
    const auditBtn = screen.getByRole('button', {
      name: /Audit "Why This\?" Trail/i,
    })
    fireEvent.click(auditBtn)
    expect(screen.getByText(/Simulated Action Active/i)).toBeInTheDocument()

    // Expand Accessible Score Table
    fireEvent.click(
      screen.getByRole('button', {
        name: /Show Accessible Score Table/i,
      }),
    )
    expect(
      screen.getByRole('table', {
        name: /Collaboration Score Sub-dimension Breakdown/i,
      }),
    ).toBeInTheDocument()

    // Expand Longitudinal Curve Table
    fireEvent.click(
      screen.getByRole('button', {
        name: /Inspect Longitudinal Table Region/i,
      }),
    )
    expect(
      screen.getByRole('table', {
        name: /Longitudinal Collaboration Score History/i,
      }),
    ).toBeInTheDocument()
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
