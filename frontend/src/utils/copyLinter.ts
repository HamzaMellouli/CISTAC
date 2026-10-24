import type { CopyLintResult, CopyLintViolation } from '../contracts'

interface BannedTermRule {
  pattern: RegExp
  termLabel: string
  category: 'clinical_diagnostic' | 'punitive_guilt'
  replacementSuggestion: string
}

const BANNED_RULES: readonly BannedTermRule[] = [
  {
    pattern: /\badhd\b/gi,
    termLabel: 'ADHD',
    category: 'clinical_diagnostic',
    replacementSuggestion: 'attentional variability or fast-switching style',
  },
  {
    pattern: /\bdementia\b/gi,
    termLabel: 'dementia',
    category: 'clinical_diagnostic',
    replacementSuggestion: 'memory recall variability',
  },
  {
    pattern: /\bautism\b/gi,
    termLabel: 'autism',
    category: 'clinical_diagnostic',
    replacementSuggestion: 'individual processing profile',
  },
  {
    pattern: /\bdiagnos(?:is|e|ed|tic)\b/gi,
    termLabel: 'diagnosis / diagnostic',
    category: 'clinical_diagnostic',
    replacementSuggestion: 'non-clinical profile estimate',
  },
  {
    pattern: /\bdisorder(?:s)?\b/gi,
    termLabel: 'disorder',
    category: 'clinical_diagnostic',
    replacementSuggestion: 'cognitive pattern',
  },
  {
    pattern: /\bdeficit(?:s)?\b/gi,
    termLabel: 'deficit',
    category: 'clinical_diagnostic',
    replacementSuggestion: 'growth opportunity',
  },
  {
    pattern: /\bimpair(?:ment|ed)\b/gi,
    termLabel: 'impairment / impaired',
    category: 'clinical_diagnostic',
    replacementSuggestion: 'lower-confidence range or temporary fatigue',
  },
  {
    pattern: /\bpatholog(?:y|ical)\b/gi,
    termLabel: 'pathology / pathological',
    category: 'clinical_diagnostic',
    replacementSuggestion: 'response pattern',
  },
  {
    pattern: /\bsymptom(?:s)?\b/gi,
    termLabel: 'symptom',
    category: 'clinical_diagnostic',
    replacementSuggestion: 'session telemetry signal',
  },
  {
    pattern: /\bpatient(?:s)?\b/gi,
    termLabel: 'patient',
    category: 'clinical_diagnostic',
    replacementSuggestion: 'learner / user',
  },
  {
    pattern: /\biq\b/gi,
    termLabel: 'IQ',
    category: 'clinical_diagnostic',
    replacementSuggestion: 'dimension percentage estimate',
  },
  {
    pattern: /\bbroke your (?:[\w-]+\s+)?streak\b/gi,
    termLabel: 'broke your streak',
    category: 'punitive_guilt',
    replacementSuggestion: 'welcome back—pick up right where you left off',
  },
  {
    pattern: /\blost your streak\b/gi,
    termLabel: 'lost your streak',
    category: 'punitive_guilt',
    replacementSuggestion: 'ready for a fresh check-in whenever you are',
  },
  {
    pattern: /\byou failed\b/gi,
    termLabel: 'you failed',
    category: 'punitive_guilt',
    replacementSuggestion: 'tricky block—every miss helps calibrate your range',
  },
]

/**
 * Validates any UI copy or coach message against our non-clinical and zero-guilt rules.
 */
export function lintCopyText(input: string): CopyLintResult {
  const violations: CopyLintViolation[] = []
  let sanitizedPreview = input

  for (const rule of BANNED_RULES) {
    if (rule.pattern.test(input)) {
      violations.push({
        term: rule.termLabel,
        category: rule.category,
        replacementSuggestion: rule.replacementSuggestion,
      })
      sanitizedPreview = sanitizedPreview.replace(
        rule.pattern,
        `[${rule.replacementSuggestion}]`,
      )
    }
    rule.pattern.lastIndex = 0
  }

  return {
    input,
    isClean: violations.length === 0,
    violations,
    sanitizedPreview,
  }
}


export const SAMPLE_GUARDRAIL_INTERCEPTION_INPUT =
  'Patient shows working-memory deficit and broke your 4-day streak after a slow block.'
