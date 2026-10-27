"""Non-Clinical Safety Guardrails for Member 2 (AI Coach).

Enforces non-clinical boundaries by:
1. Detecting medical, psychiatric, and diagnostic labels (e.g., ADHD, impairment, pathology).
2. Sanitizing and redacting diagnostic deficit labels into growth-oriented terminology.
3. Ensuring coach responses maintain an empowering, neuroplasticity-focused, non-clinical tone.
4. Providing system instruction fragments for LLM context steering.
"""

from __future__ import annotations

import re
from typing import Dict, List, Tuple
from ai_coach.schemas import SafetyMetadata, SafetyViolation


# Dictionary mapping clinical / deficit patterns to growth-mindset alternatives.
CLINICAL_TERM_REPLACEMENTS: Dict[str, str] = {
    r"\b(adhd|a\.d\.h\.d\.)\b": "divergent attentional style",
    r"\b(add|a\.d\.d\.)\b": "fluctuating focus pattern",
    r"\b(autism|autistic)\b": "systematizing cognitive profile",
    r"\b(ocd|o\.c\.d\.)\b": "high-precision focus tendency",
    r"\b(dyslexia|dyslexic)\b": "alternative visual-linguistic processing",
    r"\b(dementia|alzheimer'?s)\b": "cognitive endurance challenge",
    r"\b(bipolar|schizophreni[ac])\b": "variable cognitive rhythm",
    r"\b(clinical depression|depressive disorder)\b": "reduced energy episode",
    r"\b(anxiety disorder|clinical anxiety)\b": "elevated stress state",
    r"\b(cognitive impairment|mild cognitive impairment|mci)\b": "developing processing capacity",
    r"\b(impairment|impairments)\b": "developing capacity",
    r"\b(cognitive deficit|mental deficit)\b": "targeted growth opportunity",
    r"\b(deficit|deficits)\b": "targeted growth area",
    r"\b(brain damage|brain injury)\b": "adaptive neural restructuring",
    r"\b(neurological disorder|neurodegenerative disorder)\b": "distinct neural pattern",
    r"\b(disorder|disorders)\b": "cognitive style variation",
    r"\b(mental retardation|retarded)\b": "unique learning pace",
    r"\b(pathology|pathological)\b": "atypical variance",
    r"\b(abnormal|abnormality)\b": "divergent baseline",
    r"\b(dysfunctional|dysfunction)\b": "suboptimal strategy",
    r"\b(mental handicap|handicapped)\b": "differential accessibility profile",
    r"\b(disability|disabled)\b": "distinct cognitive modality",
    r"\b(patient|patients)\b": "learner",
    r"\b(symptom|symptoms)\b": "observable behavioral signal",
    r"\b(syndrome)\b": "cognitive pattern",
    r"\b(subnormal)\b": "baseline",
    r"\b(diagnosis|diagnosed|diagnosing)\b": "performance assessment",
    r"\b(prognosis)\b": "growth trajectory",
    r"\b(clinical condition)\b": "cognitive state",
}

# Compiled regex patterns for fast detection
COMPILED_PATTERNS = [
    (re.compile(pattern, re.IGNORECASE), replacement, pattern)
    for pattern, replacement in CLINICAL_TERM_REPLACEMENTS.items()
]

# Additional strictly prohibited diagnostic phrases that must trigger immediate rejection/remediation
BLOCKED_DIAGNOSTIC_QUERIES = [
    re.compile(r"\bdo i have (adhd|autism|dementia|depression|ocd|a disorder)\b", re.IGNORECASE),
    re.compile(r"\bam i (bipolar|autistic|mentally ill|retarded|brain-damaged)\b", re.IGNORECASE),
    re.compile(r"\bdiagnose me\b", re.IGNORECASE),
]

DISCLAIMER_TEXT = (
    "Note: AI4Brain is a non-clinical cognitive fitness and skill-building system. "
    "We evaluate cognitive agility, working memory, and focus strategies through dynamic "
    "neuroplasticity principles and do not provide medical or psychiatric diagnoses."
)


class SafetyGuardrailEngine:
    """Engine for inspecting and enforcing non-clinical safety boundaries."""

    def __init__(self, strict_mode: bool = True):
        self.strict_mode = strict_mode

    def check_safety(self, text: str) -> SafetyMetadata:
        """Scan text for clinical, diagnostic, or deficit terminology."""
        if not text:
            return SafetyMetadata(is_safe=True)

        detected_terms: List[str] = []
        violations: List[SafetyViolation] = []

        for compiled_rx, replacement, raw_pattern in COMPILED_PATTERNS:
            matches = compiled_rx.findall(text)
            if matches:
                for match in matches:
                    term_str = match if isinstance(match, str) else match[0]
                    detected_terms.append(term_str.strip())
                    violations.append(
                        SafetyViolation(
                            detected_phrase=term_str.strip(),
                            rule_category="non_clinical_boundary",
                            remediation_applied=f"Substitute with growth-aligned term: '{replacement}'"
                        )
                    )

        is_safe = len(detected_terms) == 0
        return SafetyMetadata(
            is_safe=is_safe,
            clinical_terms_detected=list(set(detected_terms)),
            sanitized=False,
            violations=violations
        )

    def is_diagnostic_inquiry(self, text: str) -> bool:
        """Check if user prompt is explicitly asking for medical diagnosis."""
        return any(rx.search(text) for rx in BLOCKED_DIAGNOSTIC_QUERIES)

    def sanitize(self, text: str) -> Tuple[str, SafetyMetadata]:
        """Sanitize text by replacing clinical and deficit terms with growth-mindset phrasing.
        
        Returns:
            Tuple of (sanitized_text, safety_metadata)
        """
        if not text:
            return text, SafetyMetadata(is_safe=True)

        meta = self.check_safety(text)
        if meta.is_safe:
            return text, meta

        sanitized_text = text
        for compiled_rx, replacement, _ in COMPILED_PATTERNS:
            sanitized_text = compiled_rx.sub(replacement, sanitized_text)

        meta.sanitized = True
        return sanitized_text, meta

    def wrap_with_disclaimer_if_needed(self, text: str, user_prompt: str = "") -> str:
        """Append non-clinical disclaimer if user sought medical diagnosis or advice."""
        if self.is_diagnostic_inquiry(user_prompt):
            return f"{text}\n\n---\n*{DISCLAIMER_TEXT}*"
        return text

    @staticmethod
    def get_system_prompt_guardrails() -> str:
        """Return the strict system instruction snippet to inject into LLM prompts."""
        return (
            "STRICT NON-CLINICAL SAFETY MANDATE:\n"
            "1. You are a cognitive fitness coach, NOT a medical or clinical diagnostic tool.\n"
            "2. NEVER use diagnostic or pathological labels (e.g., ADHD, autism, dementia, "
            "impairment, deficit, disorder, pathology, dysfunction).\n"
            "3. ALWAYS frame cognitive performance through a growth-mindset and neuroplasticity lens "
            "(e.g., 'focus modulation', 'working memory endurance', 'pattern induction agility').\n"
            "4. If the user asks whether they have a medical/psychiatric condition, gently decline "
            "and redirect to cognitive exercise habits and professional medical consultation if desired.\n"
        )
