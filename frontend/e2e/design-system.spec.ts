import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import path from 'node:path'

const SCREENSHOT_DIR = path.resolve(process.cwd(), '../docs/ui/screenshots')

test.describe('Page 18: Living Design System (/design-system) Visual QA & A11y', () => {
  test('passes axe-core accessibility, 375/768/1440px responsive layout, and 3-to-10 dimension checks', async ({
    page,
  }) => {
    const viewports = [
      { width: 1440, height: 900, label: '1440' },
      { width: 768, height: 1024, label: '768' },
      { width: 375, height: 812, label: '375' },
    ]

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/design-system', { waitUntil: 'networkidle' })
      await expect(
        page.getByRole('heading', { name: /SynapseTwin Living Design System/i }),
      ).toBeVisible()

      // Check zero horizontal scroll
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth
      })
      expect(hasOverflow, `Horizontal overflow detected at ${vp.width}px`).toBe(
        false,
      )

      // Capture full-page screenshot for docs/ui/screenshots/
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `18-design-system-${vp.label}.png`),
        fullPage: true,
      })
    }

    // Run axe-core WCAG AA audit at 1440px
    await page.setViewportSize({ width: 1440, height: 900 })
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])

    // Verify 10-dimension stress state screenshot
    await page.getByRole('button', { name: '10 Dimensions' }).click()
    await expect(
      page.getByRole('heading', { name: /10 Dimensions Active/i }),
    ).toBeVisible()
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '18-design-system-10dims-1440.png'),
      fullPage: true,
    })

    // Verify Dark theme (Night Lab) screenshot & zero axe violations
    await page.getByRole('button', { name: /Dark \(Night Lab\)/i }).click()
    const darkAxeResults = await new AxeBuilder({ page }).analyze()
    expect(darkAxeResults.violations).toEqual([])
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '18-design-system-dark-1440.png'),
      fullPage: true,
    })

    // Switch back to Light, trigger Offline + LLM-Down banners + Error State + Flagged Copy Linter state
    await page.getByRole('button', { name: /Light \(Playful Lab\)/i }).click()
    await page.getByRole('button', { name: /Test Offline Banner/i }).click()
    await page.getByRole('button', { name: /Test LLM-Down Banner/i }).click()
    await page.getByRole('button', { name: 'Error State' }).click()
    await page
      .getByRole('button', { name: /Clinical Terms Test \(Flagged\)/i })
      .click()
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '18-design-system-states-1440.png'),
      fullPage: true,
    })
  })
})
