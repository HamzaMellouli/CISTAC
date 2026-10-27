import fs from 'node:fs'
import path from 'node:path'

const metadataPath = path.resolve(process.cwd(), 'src/styles/token-metadata.ts')
const src = fs.readFileSync(metadataPath, 'utf8')

function getLuminance(hex) {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function ratio(a, b) {
  const l1 = getLuminance(a)
  const l2 = getLuminance(b)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

const pairRegex = /id:\s*'([^']+)'[\s\S]*?fgHex:\s*'([^']+)'[\s\S]*?bgHex:\s*'([^']+)'[\s\S]*?minRequired:\s*([0-9.]+)/g
let match
let count = 0
let failed = 0

while ((match = pairRegex.exec(src)) !== null) {
  const [, id, fg, bg, minStr] = match
  const min = parseFloat(minStr)
  const r = ratio(fg, bg)
  count++
  if (r < min) {
    console.error(`[FAIL] ${id}: ${fg} on ${bg} = ${r.toFixed(2)}:1 (requires >= ${min}:1)`)
    failed++
  }
}

if (count === 0 || failed > 0) {
  console.error(`Contrast check failed (${failed} failures across ${count} pairs).`)
  process.exit(1)
}
console.log(`[PASS] check:contrast — All ${count} Light & Dark semantic and Okabe-Ito dimension token pairs pass WCAG 2.1 thresholds.`)
