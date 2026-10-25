import path from 'node:path'
import { fileURLToPath } from 'node:url'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const SCREENSHOT_DIR = path.resolve(__dirname, '../../docs/ui/screenshots')

test.describe('Page 14: Settings & Accessibility Controls (/settings) Visual QA & A11y', () => {
  test('passes axe-core accessibility, 375/768/1440px responsive layout, calm sensory mode, and preference controls', async ({
    page,
  }) => {
    // 1. Desktop 1440px Light (Playful Lab) Baseline
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/settings', { waitUntil: 'networkidle' })

    await expect(
      page.getByRole('heading', {
        name: /Settings & Accessibility Controls/i,
        level: 1,
      }),
    ).toBeVisible()

    // Verify 5 settings categories exist
    await expect(page.getByText(/1. Visual & Sensory Ergonomics/i)).toBeVisible()
    await expect(page.getByText(/2. Motion & Vestibular Comfort/i)).toBeVisible()
    await expect(page.getByText(/3. Auditory Feedback & Task Pacing/i)).toBeVisible()
    await expect(page.getByText(/4. Non-Punitive Habit & Study Boundaries/i)).toBeVisible()
    await expect(page.getByText(/5. Cognitive Dimension Pool Preset/i)).toBeVisible()

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
      path: path.join(SCREENSHOT_DIR, '14-settings-desktop-overview.png'),
      fullPage: true,
    })

    // 2. Calm Sensory Mode
    const calmBtn = page.getByRole('button', { name: /Calm Sensory Mode/i })
    await calmBtn.click()

    await expect(page.getByRole('status')).toBeVisible()
    await expect(
      page.getByText(/Calm Sensory Mode engaged/i),
    ).toBeVisible()

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '14-settings-calm-sensory-mode.png'),
      fullPage: true,
    })

    // 3. Night Lab Dark Mode Switch
    const darkRadio = page.getByRole('radio', { name: /Night Lab \(Dark\)/i })
    await darkRadio.click()

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    // Run axe-core in Dark Mode
    const axeDark = await new AxeBuilder({ page }).analyze()
    expect(axeDark.violations).toEqual([])

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '14-settings-night-lab.png'),
      fullPage: true,
    })

    // 4. High Zoom 130% Mode
    const highZoomBtn = page.getByRole('radio', { name: /130% \(High Zoom\)/i })
    await highZoomBtn.click()
    await expect(highZoomBtn).toHaveAttribute('aria-checked', 'true')

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '14-settings-high-zoom-130.png'),
      fullPage: true,
    })

    // 5. Accessible Shortcuts Reference Table
    const tableRegion = page.getByRole('region', { name: /Keyboard Shortcuts Table/i })
    await expect(tableRegion).toBeVisible()
    await expect(tableRegion).toHaveAttribute('tabIndex', '0')
    await expect(page.getByText(/Select Probe Option 1/i)).toBeVisible()

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '14-settings-shortcuts-table.png'),
      fullPage: true,
    })

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
      path: path.join(SCREENSHOT_DIR, '14-settings-mobile.png'),
      fullPage: true,
    })

    // 8. Test Factory Reset
    const resetBtn = page.getByRole('button', { name: /Reset All Preferences to Factory Defaults/i })
    await resetBtn.click()

    await expect(page.getByRole('status')).toBeVisible()
    await expect(
      page.getByText(/All settings and accessibility preferences restored to factory defaults/i),
    ).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  })
})
