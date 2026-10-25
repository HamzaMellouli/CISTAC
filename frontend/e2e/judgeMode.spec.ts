import path from 'node:path'
import { fileURLToPath } from 'node:url'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const SCREENSHOT_DIR = path.resolve(__dirname, '../../docs/ui/screenshots')

test.describe('Page 16: Competition Demo & Judge Mode (/judge-mode) Visual QA & A11y', () => {
  test('passes axe-core accessibility, 375/768/1440px responsive layout, persona switcher, fault injection, and rubric matrix', async ({
    page,
  }) => {
    // 1. Desktop 1440px Light (Playful Lab) — Baseline State
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/judge-mode', { waitUntil: 'networkidle' })

    await expect(
      page.getByRole('heading', {
        name: /Demo & Judge Mode/i,
        level: 1,
      }),
    ).toBeVisible()

    // Verify Signature #7 JudgeModeDock is mounted and visible
    await expect(
      page.getByText(/Signature #7 · Judge Mode Dock/i),
    ).toBeVisible()

    // Verify all 6 competition persona options exist
    await expect(page.getByRole('button', { name: /Steady Improver/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /New Intake/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Noisy & Low-Confidence/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Partial Profile/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /10 Dimensions/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /LLM-Down Degraded/i })).toBeVisible()

    // Verify 8 Signature Components launcher cards are present
    await expect(
      page.getByRole('heading', { name: /Signature Components Fast-Launcher/i }),
    ).toBeVisible()

    // Verify Rubric-to-UI Proof Matrix table
    await expect(
      page.getByRole('table', {
        name: /AI4Brain CISTAC 1.0 Jury Evaluation Rubric to UI Proof Matrix/i,
      }),
    ).toBeVisible()

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
      path: path.join(SCREENSHOT_DIR, '16-judge-mode-1440.png'),
      fullPage: true,
    })

    // 2. Persona Switching Test (Switch to Salma Noisy Low-Confidence)
    await page
      .getByRole('button', {
        name: /Noisy & Low-Confidence/i,
      })
      .click()

    await expect(
      page.getByText(/hesitation jitter/i),
    ).toBeVisible()

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '16-judge-mode-persona.png'),
      fullPage: true,
    })

    // 3. Fault Injection & Dimension Generalisation (Offline + LLM Fallback + 10 Dims)
    const offlineSwitch = page.getByRole('switch', {
      name: /Offline Queue/i,
    })
    await offlineSwitch.click()
    await expect(offlineSwitch).toHaveAttribute('aria-checked', 'true')
    await expect(
      page.getByText(/Offline Mode Active: Trial telemetry is buffered locally/i),
    ).toBeVisible()

    const llmSwitch = page.getByRole('switch', {
      name: /LLM Fallback/i,
    })
    await llmSwitch.click()
    await expect(llmSwitch).toHaveAttribute('aria-checked', 'true')
    await expect(
      page.getByText(/Deterministic Fallback: Cognitive assessment/i),
    ).toBeVisible()

    // Switch to 10 Dimensions in the dock
    await page
      .getByRole('group', { name: /Dimension count preset switcher/i })
      .getByRole('button', { name: '10' })
      .click()

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '16-judge-mode-faults-10dims.png'),
      fullPage: true,
    })

    // 4. Dark Mode (Night Lab)
    await page
      .getByRole('button', {
        name: /Dark \(Night Lab\)/i,
      })
      .first()
      .click()

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    const axeDark = await new AxeBuilder({ page }).analyze()
    expect(axeDark.violations).toEqual([])

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '16-judge-mode-dark.png'),
      fullPage: true,
    })

    // 5. Tablet 768px Viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(300)

    const overflow768 = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      )
    })
    expect(overflow768).toBe(false)

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '16-judge-mode-768.png'),
      fullPage: true,
    })

    // 6. Mobile 375px Viewport
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(300)

    const overflow375 = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      )
    })
    expect(overflow375).toBe(false)

    const axeMobile = await new AxeBuilder({ page }).analyze()
    expect(axeMobile.violations).toEqual([])

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '16-judge-mode-375.png'),
      fullPage: true,
    })
  })
})
