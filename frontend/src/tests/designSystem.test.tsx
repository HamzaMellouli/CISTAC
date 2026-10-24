import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { evaluateDesignSystemContrast } from '../utils/contrast'
import { lintCopyText } from '../utils/copyLinter'
import { getDimensionsByPreset } from '../config/dimensions'
import { App } from '../App'

describe('Design System & Epistemic Rigor Unit Suite', () => {
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

  it('renders /design-system and supports 3-to-10 dimension switching and radar table toggle', async () => {
    render(<App />)

    const heading = await screen.findByRole(
      'heading',
      {
        name: /SynapseTwin Living Design System/i,
      },
      { timeout: 5000 },
    )
    expect(heading).toBeInTheDocument()

    // Switch to 10 dimensions
    const tenBtn = screen.getByRole('button', { name: '10 Dimensions' })
    fireEvent.click(tenBtn)
    expect(
      screen.getByRole('heading', { name: /10 Dimensions Active/i }),
    ).toBeInTheDocument()

    // Switch to 3 dimensions
    const threeBtn = screen.getByRole('button', { name: '3 Dimensions' })
    fireEvent.click(threeBtn)
    expect(
      screen.getByRole('heading', { name: /3 Dimensions Active/i }),
    ).toBeInTheDocument()

    // Toggle Accessible Table on Uncertainty Radar
    const tableBtn = screen.getByRole('button', { name: /View as Table/i })
    fireEvent.click(tableBtn)
    expect(
      screen.getByRole('table', {
        name: /Brain Twin Uncertainty Radar accessible data table/i,
      }),
    ).toBeInTheDocument()
  })
})
