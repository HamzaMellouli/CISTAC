import fs from 'node:fs'
import path from 'node:path'

const SRC_DIR = path.resolve(process.cwd(), 'src')

function walkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const results = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walkFiles(full))
    } else if (
      /\.(ts|tsx)$/.test(entry.name) &&
      !entry.name.includes('copyLinter') &&
      !/\.test\.(ts|tsx)$/.test(entry.name)
    ) {
      results.push(full)
    }
  }
  return results
}

const BANNED = [
  /\badhd\b/i,
  /\bdementia\b/i,
  /\bautism\b/i,
  /\bpathology\b/i,
  /\bsymptom\b/i,
  /\bbroke your (?:[\w-]+\s+)?streak\b/i,
  /\byou failed\b/i,
]

let violations = 0
for (const file of walkFiles(SRC_DIR)) {
  const rel = path.relative(process.cwd(), file)
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
  lines.forEach((line, idx) => {
    // Allow intentional interactive linter demo presets marked with Flagged in DesignSystemPage
    if (rel.endsWith('DesignSystemPage.tsx') && (line.includes('Patient shows signs') || line.includes('broke your 5-day streak'))) {
      return
    }
    for (const pat of BANNED) {
      if (pat.test(line)) {
        console.error(`[FAIL] ${rel}:${idx + 1} matched banned clinical/guilt pattern ${pat}: ${line.trim()}`)
        violations++
      }
    }
  })
}

if (violations > 0) {
  console.error(`Copy lint failed with ${violations} violation(s).`)
  process.exit(1)
}
console.log('[PASS] lint:copy — All UI copy and mock fixtures pass non-clinical and zero-guilt checks.')
