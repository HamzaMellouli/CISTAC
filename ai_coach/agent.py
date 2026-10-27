"""AI Coach Agent & Conversational LLM Runner for Member 2.

Handles:
- Natural-language dialogue with the user.
- Explainability injection using Member 3's differential vector Δc.
- Real-time AI Collaboration Score calculation across the 5 dimensions.
- Strict non-clinical safety post-processing and guardrail filtering.
- Skill-building learning path recommendations.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional

from ai_coach.collaboration_scorer import CollaborationScorer
from ai_coach.safety_guardrails import SafetyGuardrailEngine
from ai_coach.schemas import (
    ArchetypeTier,
    ChatMessage,
    ChatMessageRole,
    ChatRequest,
    CoachingResponse,
    CollaborationScoreResult,
    DimensionScores,
    SafetyMetadata,
)
from ai_coach.xai_explainer import XAIExplainer


PROMPTS_DIR = Path(__file__).resolve().parent / "prompts"


def _load_prompt_template(filename: str, fallback_default: str = "") -> str:
    """Safely load a text prompt template from the prompts directory."""
    target_file = PROMPTS_DIR / filename
    if target_file.is_file():
        return target_file.read_text(encoding="utf-8")
    return fallback_default


class AICoachAgent:
    """Conversational AI Coach Agent with explainability injection and safety guardrails."""

    def __init__(
        self,
        scorer: Optional[CollaborationScorer] = None,
        explainer: Optional[XAIExplainer] = None,
        guardrail: Optional[SafetyGuardrailEngine] = None,
        llm_callable: Optional[Callable[[List[Dict[str, str]]], str]] = None,
    ):
        self.scorer = scorer or CollaborationScorer()
        self.explainer = explainer or XAIExplainer()
        self.guardrail = guardrail or SafetyGuardrailEngine()
        self.llm_callable = llm_callable

        # Cache base prompt
        self.system_prompt_base = _load_prompt_template(
            "system_coach.txt",
            fallback_default="You are the AI Cognitive Fitness Coach. Guide the user with growth mindset."
        )

    def assemble_system_prompt(
        self,
        cluster_id: int = 4,
        delta_vector: Optional[Dict[str, float]] = None,
        uncertainty: float = 0.0,
    ) -> str:
        """Compose the full system instruction with XAI injection and safety mandates."""
        xai_context = self.explainer.format_xai_prompt_context(
            delta_vector=delta_vector,
            cluster_id=cluster_id,
        )
        guardrail_mandate = self.guardrail.get_system_prompt_guardrails()

        return (
            f"{self.system_prompt_base}\n\n"
            f"{guardrail_mandate}\n\n"
            f"{xai_context}\n"
        )

    def handle_chat(self, request: ChatRequest) -> CoachingResponse:
        """Process user message, evaluate collaboration score, inject XAI, and generate safe reply."""
        cluster_id = request.active_cluster_id if request.active_cluster_id is not None else 4
        delta_vec = request.delta_vector or {}

        # 1. Update chat history with current message
        session_history = list(request.chat_history)
        session_history.append(ChatMessage(role=ChatMessageRole.USER, content=request.message))

        # 2. Evaluate Dynamic AI Collaboration Score
        dimension_scores = self.scorer.evaluate_interaction_signals(session_history)
        collab_result: CollaborationScoreResult = self.scorer.calculate_score(
            dimension_scores=dimension_scores,
            cluster_id=cluster_id,
        )

        # 3. Derive XAI Adaptation Justification
        xai_justification = self.explainer.generate_adaptation_rationale(
            delta_vector=delta_vec,
            active_cluster_id=cluster_id,
        )

        # 4. Generate Coach Response
        raw_reply = self._generate_response(
            message=request.message,
            history=session_history,
            cluster_id=cluster_id,
            delta_vector=delta_vec,
            xai_justification=xai_justification,
            collab_result=collab_result,
        )

        # 5. Enforce Non-Clinical Guardrails on Coach Response
        safe_reply, safety_meta = self.guardrail.sanitize(raw_reply)
        safe_reply = self.guardrail.wrap_with_disclaimer_if_needed(safe_reply, user_prompt=request.message)

        # 6. Generate Contextual Suggested Actions
        suggested_actions = self._generate_suggested_actions(
            cluster_id=cluster_id,
            collab_result=collab_result,
            delta_vector=delta_vec,
        )

        return CoachingResponse(
            reply_text=safe_reply,
            xai_explanation=xai_justification,
            suggested_actions=suggested_actions,
            collab_score_snapshot=collab_result,
            safety_metadata=safety_meta,
        )

    def _generate_response(
        self,
        message: str,
        history: List[ChatMessage],
        cluster_id: int,
        delta_vector: Dict[str, float],
        xai_justification: str,
        collab_result: CollaborationScoreResult,
    ) -> str:
        """Dispatch to LLM callable or high-fidelity internal fallback."""
        system_prompt = self.assemble_system_prompt(
            cluster_id=cluster_id,
            delta_vector=delta_vector,
        )

        # If custom LLM runner is supplied, invoke it
        if self.llm_callable is not None:
            messages_payload = [{"role": "system", "content": system_prompt}]
            for msg in history[-8:]:  # Sliding window of last 8 turns
                messages_payload.append({"role": msg.role.value, "content": msg.content})
            try:
                return self.llm_callable(messages_payload)
            except Exception as exc:
                # Graceful degradation to deterministic cognitive coach fallback
                pass

        # Deterministic / Offline Cognitive Coach Fallback Engine
        return self._generate_offline_coaching_response(
            message=message,
            cluster_id=cluster_id,
            xai_justification=xai_justification,
            collab_result=collab_result,
        )

    def _generate_offline_coaching_response(
        self,
        message: str,
        cluster_id: int,
        xai_justification: str,
        collab_result: CollaborationScoreResult,
    ) -> str:
        """High-fidelity local cognitive coach response generator."""
        lower_msg = message.lower()
        tier = self.scorer.get_tier_for_cluster(cluster_id)

        # If user is asking why task changed or adapted
        if any(w in lower_msg for w in ["why", "harder", "faster", "change", "adapted", "pacing", "different"]):
            return (
                f"That adjustment was guided directly by your recent cognitive telemetry. {xai_justification} "
                "By calibrating task parameters to match your current cognitive velocity, we keep you in an optimal "
                "neuroplastic growth zone—challenging enough to expand capacity without causing unnecessary cognitive fatigue."
            )

        # If user is asking about their collaboration score
        if any(w in lower_msg for w in ["score", "collab", "collaboration", "rating", "progress"]):
            return (
                f"Your active AI Collaboration Index is currently {collab_result.composite_score:.1f}/100 "
                f"within the {collab_result.archetype_tier.value.title()} tier. "
                f"{collab_result.growth_recommendation} "
                f"Remember: {xai_justification}"
            )

        # Default conversational guidance with growth framing
        tier_guidance = {
            ArchetypeTier.EXPLORER: (
                "Focus on building steady task rhythm and taking brief clarity pauses before multi-step choices."
            ),
            ArchetypeTier.PRACTITIONER: (
                "You're demonstrating solid operational agility. Try challenging your initial intuitions by testing edge cases."
            ),
            ArchetypeTier.STRATEGIST: (
                "Excellent strategic independence. Maintain high critical verification while exploring advanced multidimensional patterns."
            ),
        }[tier]

        return (
            f"I hear you. As we progress through this session, {tier_guidance} "
            f"\n\nContextual Note: {xai_justification} "
            f"\n\nWhat specific dimension would you like to focus on refining next?"
        )

    def _generate_suggested_actions(
        self,
        cluster_id: int,
        collab_result: CollaborationScoreResult,
        delta_vector: Dict[str, float],
    ) -> List[str]:
        """Generate 2-3 dynamic next action cards for the user."""
        actions: List[str] = []

        # Collaboration enhancement tip
        actions.append(collab_result.growth_recommendation)

        # Dimension targeted exercise tip
        if delta_vector:
            top_dim = max(delta_vector, key=lambda k: abs(delta_vector[k]))
            actions.append(f"Engage next 3-minute challenge targeting {top_dim.replace('_', ' ')}.")
        else:
            actions.append("Launch next calibrated task block from cache.")

        # Autonomy / Reflection tip
        actions.append("Reflect on your problem-solving strategy and compare with previous attempts.")

        return actions

    def generate_learning_path(
        self,
        user_id: str,
        cluster_id: int,
        delta_vector: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        """Produce a structured, personalized cognitive learning curriculum."""
        tier = self.scorer.get_tier_for_cluster(cluster_id)
        deltas = delta_vector or {}

        modules = [
            {
                "module_id": "MOD-WM-01",
                "title": "Working Memory Stabilization",
                "focus": "Dual N-Back sequence stability and chunking heuristics",
                "target_duration_mins": 10,
            },
            {
                "module_id": "MOD-PI-02",
                "title": "Matrix Pattern Induction Agility",
                "focus": "Rule-extrapolation speed across progressive rotational matrices",
                "target_duration_mins": 12,
            },
            {
                "module_id": "MOD-EF-03",
                "title": "Executive Task-Switching Conditioning",
                "focus": "Cognitive flexibility under variable distractor loads",
                "target_duration_mins": 8,
            },
        ]

        return {
            "user_id": user_id,
            "archetype_id": cluster_id,
            "archetype_tier": tier.value,
            "learning_path_title": f"{tier.value.title()} Adaptive Cognitive Track",
            "modules": modules,
            "recommended_weekly_sessions": 3 if tier == ArchetypeTier.EXPLORER else 4,
            "explainability_anchor": self.explainer.generate_adaptation_rationale(deltas, cluster_id),
            "safety_certified": True,
        }
