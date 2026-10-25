import path from 'node:path'
import { fileURLToPath } from 'node:url'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const SCREENSHOT_DIR = path.resolve(__dirname, '../../docs/ui/screenshots')

test.describe('Page 17: System States & Error Boundaries (/system/*) Visual QA & A11y', () => {
  test('passes axe-core accessibility, 375/768/1440px responsive layout, 404 wayfinder, offline buffer, and error boundary self-healing', async ({
    page,
  }) => {
    // 1. Desktop 1440px Light (Playful Lab) — Baseline State (404 View)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/system', { waitUntil: 'networkidle' })

    await expect(
      page.getByRole('heading', {
        name: /System States & Fault Resilience Console/i,
        level: 1,
      }),
    ).toBeVisible()

    // Verify 404 Wayfinder view
    await expect(
      page.getByRole('heading', { name: /Synaptic Pathway Not Mapped/i }),
    ).toBeVisible()

    await expect(page.getByText(/Recommended Return Destinations:/i)).toBeVisible()
    await expect(page.getByText(/Welcome & Baseline/i)).toBeVisible()
    await expect(page.getByText(/Cognitive Dashboard/i).first()).toBeVisible()

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
      path: path.join(SCREENSHOT_DIR, '17-system-1440.png'),
      fullPage: true,
    })

    // 2. Offline Resilience Hub & Telemetry Queue
    const offlineTab = page.getByRole('tab', { name: /Offline Resilience Hub/i })
    await offlineTab.click()

    await expect(
      page.getByRole('heading', { name: /Offline Telemetry Buffer & Sync Engine/i }),
    ).toBeVisible()

    // Add mock event
    await page
      .getByRole('button', { name: /\+ Add Mock Telemetry Event/i })
      .click()

    await expect(page.getByText(/15 \/ 500 Events/i)).toBeVisible()

    // Flush queue
    await page
      .getByRole('button', { name: /Flush Queue & Sync Now/i })
      .click()

    await expect(page.getByText(/0 \/ 500 Events/i)).toBeVisible()

    // Toggle offline mode simulation
    const simulateOfflineBtn = page.getByRole('button', {
      name: /Simulate Offline Mode/i,
    })
    await simulateOfflineBtn.click()

    // Verify global offline banner mounts in AppShell
    await expect(
      page.getByText(/Offline Mode Active: Trial telemetry is buffered locally/i),
    ).toBeVisible()

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '17-system-offline.png'),
      fullPage: true,
    })

    // Turn off offline mode simulation for clean state
    await page
      .getByRole('button', { name: /Disable Offline Mode/i })
      .click()

    // 3. Error Boundary Test Bench & Simulated Crash Catch
    const errorTab = page.getByRole('tab', { name: /Error Boundary Test Bench/i })
    await errorTab.click()

    await expect(
      page.getByRole('heading', { name: /Interactive Error Boundary Test Bench/i }),
    ).toBeVisible()
    await expect(page.getByText(/Subtree Mounted Cleanly/i)).toBeVisible()

    // Trigger simulated crash
    await page
      .getByRole('button', { name: /Trigger Simulated Component Crash/i })
      .click()

    // Verify Error Boundary caught it with Zero White Screen
    await expect(
      page.getByRole('heading', {
        name: /Component Fault Isolated & Preserved/i,
      }),
    ).toBeVisible()
    await expect(page.getByText(/ERR-CLIENT-RECOVERY/i)).toBeVisible()

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '17-system-error.png'),
      fullPage: true,
    })

    // Recover by clicking Try Re-rendering Component
    await page
      .getByRole('button', { name: /Try Re-rendering Component/i })
      .click()

    await expect(page.getByText(/Subtree Mounted Cleanly/i)).toBeVisible()

    // 4. Dark Mode (Night Lab)
    await page
      .getByRole('button', { name: /Dark \(Night Lab\)/i })
      .first()
      .click()

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    const axeDark = await new AxeBuilder({ page }).analyze()
    expect(axeDark.violations).toEqual([])

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '17-system-dark.png'),
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
      path: path.join(SCREENSHOT_DIR, '17-system-768.png'),
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
      path: path.join(SCREENSHOT_DIR, '17-system-375.png'),
      fullPage: true,
    })

    // 7. Test Direct Unregistered URL Routing
    await page.goto('/unregistered-test-manifold-path', { waitUntil: 'networkidle' })
    await expect(
      page.getByRole('heading', { name: /Synaptic Pathway Not Mapped/i }),
    ).toBeVisible()
  })
})
