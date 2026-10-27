import type { Page } from '@playwright/test'

export async function openJudgeMode(page: Page) {
  const isDrawerOpen = await page.evaluate(() => {
    return document.getElementById('judge-devtools-drawer') !== null
  })
  if (!isDrawerOpen) {
    const judgeBtn = page.getByRole('button', { name: /Judge Mode/i })
    await judgeBtn.click()
    await page.waitForTimeout(300)
  }
}

export async function closeJudgeMode(page: Page) {
  const isDrawerOpen = await page.evaluate(() => {
    return document.getElementById('judge-devtools-drawer') !== null
  })
  if (isDrawerOpen) {
    const closeBtn = page.getByRole('button', { name: /Close Dock/i })
    if (await closeBtn.isVisible()) {
      await closeBtn.click()
    } else {
      await page.getByRole('button', { name: /Judge Mode/i }).click()
    }
    await page.waitForTimeout(300)
  }
}
