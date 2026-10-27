"""AI Coach & Collaboration Engine (Layer B - Member 2).

Modules:
- agent: Conversational AI Coach prompt runner with XAI injection.
- collaboration_scorer: Dynamic AI Collaboration Scorer (0-100).
- safety_guardrails: Non-clinical regex filters and growth-mindset guardrails.
- xai_explainer: Member 3 prototype differential vector (Δc) decoder.
- schemas: Pydantic v2 data models and contracts.
"""

from ai_coach.agent import AICoachAgent
from ai_coach.collaboration_scorer import CollaborationScorer
from ai_coach.safety_guardrails import SafetyGuardrailEngine
from ai_coach.xai_explainer import XAIExplainer
from ai_coach.schemas import (
    ArchetypeTier,
    ChatMessage,
    ChatMessageRole,
    ChatRequest,
    CoachingResponse,
    CognitiveDimension,
    CollaborationDimension,
    CollaborationScoreResult,
    DimensionScores,
    DimensionWeights,
    SafetyMetadata,
    SafetyViolation,
    StateBusEvent,
)

__all__ = [
    "AICoachAgent",
    "CollaborationScorer",
    "SafetyGuardrailEngine",
    "XAIExplainer",
    "ArchetypeTier",
    "ChatMessage",
    "ChatMessageRole",
    "ChatRequest",
    "CoachingResponse",
    "CognitiveDimension",
    "CollaborationDimension",
    "CollaborationScoreResult",
    "DimensionScores",
    "DimensionWeights",
    "SafetyMetadata",
    "SafetyViolation",
    "StateBusEvent",
]
