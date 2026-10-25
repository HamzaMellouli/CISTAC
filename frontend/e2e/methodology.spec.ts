import path from 'node:path'
import { fileURLToPath } from 'node:url'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const SCREENSHOT_DIR = path.resolve(__dirname, '../../docs/ui/screenshots')

test.describe('Page 15: Methodology, Limits & Ethics (/methodology) Visual QA & A11y', () => {
  test('passes axe-core accessibility, 375/768/1440px responsive layout, pipeline stepper, bias simulator, and copy guardrail', async ({
    page,
  }) => {
    // 1. Desktop 1440px Light (Playful Lab) Baseline
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/methodology', { waitUntil: 'networkidle' })

    await expect(
      page.getByRole('heading', {
        name: /Methodology, Limits & Ethical Charter/i,
        level: 1,
      }),
    ).toBeVisible()

    // Verify 4 pipeline stages exist
    await expect(page.getByRole('tab', { name: /Active Probe Stimuli/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Weighted Staircase IRT/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Bayesian Twin Updating/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /SAT-JEPA Plan Generation/i })).toBeVisible()

    // Verify zero horizontal overflow at 1440px
    const overflow1440 = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      )
    })
    expect(overflow1440).toBe(false)

    // Run axe-core on 1440px Light
    const axeLight = await new AxeBuilder({ page }).analyze()
    expect(axeLight.violations).toEqual([])

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '15-methodology-desktop-overview.png'),
      fullPage: true,
    })

    // 2. Interactive Pipeline Stepper: Click Stage 3 (Bayesian Twin Updating)
    const stage3Tab = page.getByRole('tab', { name: /Bayesian Twin Updating/i })
    await stage3Tab.click()

    await expect(
      page.getByRole('heading', { name: /Stage 3: Bayesian Twin Updating/i }),
    ).toBeVisible()

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '15-methodology-pipeline-step.png'),
      fullPage: true,
    })

    // 3. Interactive Bias & Confidence Simulator
    const slumpRadio = page.getByRole('radio', { name: /Afternoon Slump/i })
    await slumpRadio.click()
    await expect(slumpRadio).toHaveAttribute('aria-checked', 'true')

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '15-methodology-bias-simulator.png'),
      fullPage: true,
    })

    // 4. Live Copy Guardrail Sandbox: Click Clinical Test
    const clinicalTestBtn = page.getByRole('button', { name: /Clinical Test/i })
    await clinicalTestBtn.click()

    await expect(page.getByText(/Violation\(s\) Flagged/i)).toBeVisible()

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '15-methodology-guardrail-sandbox.png'),
      fullPage: true,
    })

    // 5. Night Lab Dark Mode Switch
    const themeBtn = page.getByRole('button', { name: /Dark \(Night Lab\)/i })
    await themeBtn.click()

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    // Run axe-core in Dark Mode
    const axeDark = await new AxeBuilder({ page }).analyze()
    expect(axeDark.violations).toEqual([])

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '15-methodology-night-lab.png'),
      fullPage: true,
    })

    // Switch back to light
    const lightBtn = page.getByRole('button', { name: /Light \(Playful Lab\)/i })
    await lightBtn.click()

    // 6. Tablet 768px Viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(300)

    const overflow768 = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      )
    })
    expect(overflow768).toBe(false)

    // 7. Mobile 375px Viewport
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(300)

    const overflow375 = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      )
    })
    expect(overflow375).toBe(false)

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '15-methodology-mobile.png'),
      fullPage: true,
    })
  })
})
