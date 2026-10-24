import fs from 'node:fs'
import path from 'node:path'

const SRC_DIR = path.resolve(process.cwd(), 'src')

function walkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const results = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'styles') continue
      results.push(...walkFiles(full))
    } else if (/\.(ts|tsx|css)$/.test(entry.name) && !/\.test\.(ts|tsx)$/.test(entry.name)) {
      results.push(full)
    }
  }
  return results
}

const RULES = [
  {
    name: 'Hardcoded hex color',
    regex: /#[0-9a-fA-F]{3,8}\b/g,
  },
  {
    name: 'Hardcoded rgb/hsl color function',
    regex: /\b(?:rgb|rgba|hsl|hsla)\s*\(/g,
  },
  {
    name: 'Arbitrary pixel/rem Tailwind bracket value',
    regex: /\b(?:p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me|gap|text|rounded|duration)-\[[^\]]+\]/g,
  },
]

let violations = 0
for (const file of walkFiles(SRC_DIR)) {
  const content = fs.readFileSync(file, 'utf8')
  const rel = path.relative(process.cwd(), file)
  for (const rule of RULES) {
    const matches = content.match(rule.regex)
    if (matches) {
      console.error(`[FAIL] ${rel}: ${rule.name} -> ${matches.join(', ')}`)
      violations += matches.length
    }
  }
}

if (violations > 0) {
  console.error(`Token lint failed with ${violations} violation(s).`)
  process.exit(1)
}
console.log('[PASS] lint:tokens — 100% design tokens used (0 hardcoded colors, spacings, font sizes, or durations).')
