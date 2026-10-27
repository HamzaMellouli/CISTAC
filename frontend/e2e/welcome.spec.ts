import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import path from 'node:path'

const SCREENSHOT_DIR = path.resolve(process.cwd(), '../docs/ui/screenshots')

test.describe('Page 01: Welcome (/) Hero Visual QA & A11y', () => {
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
      await page.goto('/', { waitUntil: 'networkidle' })
      await expect(
        page.getByRole('heading', {
          name: /Meet your evolving cognitive twin/i,
        }),
      ).toBeVisible()

      // Check zero horizontal scroll
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth
      })
      expect(hasOverflow, `Horizontal overflow detected at ${vp.width}px`).toBe(
        false,
      )

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `01-welcome-${vp.label}.png`),
        fullPage: true,
      })
    }

    // Run axe-core WCAG AA audit at 1440px
    await page.setViewportSize({ width: 1440, height: 900 })
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])

    // Verify 10-dimension stress state + Low-Conf Hatched state screenshot
    await page.getByRole('button', { name: /Judge Mode/i }).click()
    await page.getByRole('button', { name: '10 Dims (Stress)' }).click()
    await page.getByRole('button', { name: 'Low-Conf (Hatched)' }).click()
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '01-welcome-10dims-hatched-1440.png'),
      fullPage: true,
    })

    // Verify Dark theme (Night Lab) screenshot & zero axe violations
    await page.getByRole('button', { name: /Dark \(Night Lab\)/i }).click()
    const darkAxeResults = await new AxeBuilder({ page }).analyze()
    expect(darkAxeResults.violations).toEqual([])
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '01-welcome-dark-1440.png'),
      fullPage: true,
    })
  })
})
