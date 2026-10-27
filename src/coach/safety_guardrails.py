"""Non-clinical regex and safety filters (README deliverable: src/coach/safety_guardrails.py)."""

from ai_coach.safety_guardrails import (
    CLINICAL_TERM_REPLACEMENTS,
    DISCLAIMER_TEXT,
    SafetyGuardrailEngine,
)

__all__ = [
    "SafetyGuardrailEngine",
    "CLINICAL_TERM_REPLACEMENTS",
    "DISCLAIMER_TEXT",
]
