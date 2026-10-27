import path from 'node:path'
import { fileURLToPath } from 'node:url'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const SCREENSHOT_DIR = path.resolve(__dirname, '../../docs/ui/screenshots')

test.describe('Page 19: Layer D Bonus: Voice Coaching & Scenario Projections (/layer-d) Visual QA & A11y', () => {
  test('passes axe-core accessibility, 375/768/1440px responsive layout, voice studio, what-if tuner, and impact table', async ({
    page,
  }) => {
    // 1. Desktop 1440px Light (Playful Lab) Baseline
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/layer-d', { waitUntil: 'networkidle' })

    await expect(
      page.getByRole('heading', {
        name: /Layer D: Voice Coaching & Scenario Projections/i,
        level: 1,
      }),
    ).toBeVisible()

    // Verify Voice Coaching Studio
    await expect(page.getByText(/Conversational Voice Coaching Studio/i)).toBeVisible()
    await expect(page.getByText(/Synchronized Accessible Transcript:/i)).toBeVisible()

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
      path: path.join(SCREENSHOT_DIR, '19-layer-d-desktop-overview.png'),
      fullPage: true,
    })

    // 2. Play Voice Coaching Brief (Waveform active)
    const playBtn = page.getByRole('button', { name: /Play Voice Brief/i })
    await playBtn.click()

    await expect(
      page.getByRole('button', { name: /Pause Voice Brief/i }),
    ).toBeVisible()

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '19-layer-d-voice-playing.png'),
      fullPage: true,
    })

    // 3. Counterfactual Scenario Simulation: Accelerated + 9.0 Hours
    const acceleratedBtn = page.getByRole('radio', { name: /Accelerated/i })
    await acceleratedBtn.click()

    const sleepBtn = page.getByRole('radio', { name: /9.0 Hours/i })
    await sleepBtn.click()

    await expect(acceleratedBtn).toHaveAttribute('aria-checked', 'true')
    await expect(sleepBtn).toHaveAttribute('aria-checked', 'true')

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '19-layer-d-scenario-simulation.png'),
      fullPage: true,
    })

    // 4. Focus & Screenshot Impact Matrix Table
    const tableRegion = page.getByRole('region', { name: /Counterfactual Impact Table/i })
    await expect(tableRegion).toBeVisible()
    await expect(tableRegion).toHaveAttribute('tabIndex', '0')

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '19-layer-d-impact-table.png'),
      fullPage: true,
    })

    // 5. Night Lab Dark Mode Switch
    const themeBtn = page.getByRole('button', { name: /Dark \(Night Lab\)/i }).first()
    await themeBtn.click()

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    // Run axe-core in Dark Mode
    const axeDark = await new AxeBuilder({ page }).analyze()
    expect(axeDark.violations).toEqual([])

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '19-layer-d-night-lab.png'),
      fullPage: true,
    })

    // Switch back to light
    const lightBtn = page.getByRole('button', { name: /Light \(Playful Lab\)/i }).first()
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
      path: path.join(SCREENSHOT_DIR, '19-layer-d-mobile.png'),
      fullPage: true,
    })
  })
})
