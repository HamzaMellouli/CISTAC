"""Comprehensive test suite for Member 2 (AI Coach & Collaboration Engine)."""

import pytest
from ai_coach.agent import AICoachAgent
from ai_coach.collaboration_scorer import (
    ARCHETYPE_WEIGHT_PROFILES,
    CollaborationScorer,
)
from ai_coach.safety_guardrails import SafetyGuardrailEngine
from ai_coach.schemas import (
    ArchetypeTier,
    ChatMessage,
    ChatMessageRole,
    ChatRequest,
    DimensionScores,
    DimensionWeights,
)
from ai_coach.xai_explainer import XAIExplainer
import src.coach as src_coach


class TestSafetyGuardrails:
    """Tests for non-clinical guardrails and lexical filters."""

    def setup_method(self):
        self.guardrail = SafetyGuardrailEngine()

    def test_clean_growth_mindset_text_is_safe(self):
        clean_text = (
            "Your working memory sequence stability improved by 15% through repeated practice. "
            "Focus on pacing and strategic chunking heuristics."
        )
        meta = self.guardrail.check_safety(clean_text)
        assert meta.is_safe is True
        assert len(meta.clinical_terms_detected) == 0

    def test_detects_prohibited_clinical_terms(self):
        clinical_text = "The user exhibits signs of ADHD and mild cognitive impairment with abnormal dysfunction."
        meta = self.guardrail.check_safety(clinical_text)
        assert meta.is_safe is False
        detected = [t.lower() for t in meta.clinical_terms_detected]
        assert any("adhd" in t for t in detected)
        assert any("cognitive impairment" in t for t in detected)
        assert any("abnormal" in t for t in detected)
        assert any("dysfunction" in t for t in detected)

    def test_sanitizes_clinical_terms_to_growth_mindset(self):
        clinical_text = "Treating this patient for cognitive deficit and neurological disorder."
        sanitized, meta = self.guardrail.sanitize(clinical_text)
        assert meta.sanitized is True
        assert "patient" not in sanitized.lower()
        assert "deficit" not in sanitized.lower()
        assert "learner" in sanitized.lower()
        assert "targeted growth opportunity" in sanitized.lower()

    def test_diagnostic_inquiry_detection_and_disclaimer(self):
        user_prompt = "Do I have ADHD or dementia?"
        assert self.guardrail.is_diagnostic_inquiry(user_prompt) is True

        reply = "Let's focus on exercises to strengthen your working memory and attention pacing."
        wrapped = self.guardrail.wrap_with_disclaimer_if_needed(reply, user_prompt=user_prompt)
        assert "non-clinical cognitive fitness" in wrapped
        assert "do not provide medical or psychiatric diagnoses" in wrapped


class TestCollaborationScorer:
    """Tests for Dynamic AI Collaboration Scoring engine."""

    def setup_method(self):
        self.scorer = CollaborationScorer()

    def test_all_archetype_weights_sum_to_one(self):
        for cluster_id in range(9):
            weights: DimensionWeights = self.scorer.get_weights(cluster_id)
            w_dict = weights.to_dict()
            total_sum = sum(w_dict.values())
            assert pytest.approx(total_sum, rel=1e-3) == 1.0, f"Cluster {cluster_id} weights must sum to 1.0"

    def test_weight_distribution_shift_across_archetypes(self):
        # Explorer (cluster 0): Clarification + Iteration should dominate
        w_explorer = self.scorer.get_weights(0).to_dict()
        assert w_explorer["clarification"] >= 0.30
        assert w_explorer["iteration"] >= 0.30
        assert w_explorer["autonomy"] <= 0.15

        # Strategist (cluster 8): Critical Verification + Autonomy should dominate
        w_strategist = self.scorer.get_weights(8).to_dict()
        assert w_strategist["critical_verification"] >= 0.30
        assert w_strategist["autonomy"] >= 0.35
        assert w_strategist["clarification"] <= 0.10

    def test_composite_score_calculation(self):
        # Cluster 4 (balanced weights: 0.20 each)
        dims = DimensionScores(
            clarification=80.0,
            critical_verification=70.0,
            iteration=90.0,
            autonomy=60.0,
            responsible_use=100.0,
        )
        res = self.scorer.calculate_score(dims, cluster_id=4)
        expected = (80.0 * 0.20) + (70.0 * 0.20) + (90.0 * 0.20) + (60.0 * 0.20) + (100.0 * 0.20)
        assert pytest.approx(res.composite_score, abs=0.1) == expected
        assert res.archetype_tier == ArchetypeTier.PRACTITIONER
        assert res.growth_recommendation != ""

    def test_interaction_signals_evaluation(self):
        chat_history = [
            ChatMessage(role=ChatMessageRole.USER, content="Could you clarify how this matrix pattern works? Why is this rule applied?"),
            ChatMessage(role=ChatMessageRole.ASSISTANT, content="Here is how the transformation functions..."),
            ChatMessage(role=ChatMessageRole.USER, content="Are you sure? What if we rotate counterclockwise instead? I verified the alternative."),
        ]
        dims = self.scorer.evaluate_interaction_signals(chat_history)
        assert dims.clarification > 40.0
        assert dims.critical_verification > 40.0
        assert dims.iteration > 30.0


class TestXAIExplainer:
    """Tests for Member 3 Prototype Differential Vector Δc translation."""

    def setup_method(self):
        self.explainer = XAIExplainer()

    def test_positive_working_memory_delta(self):
        delta = {"working_memory": 0.20}
        rationale = self.explainer.generate_adaptation_rationale(delta, active_cluster_id=2)
        assert "working memory stability improved by 20%" in rationale
        assert "pacing" in rationale

    def test_negative_pattern_induction_delta(self):
        delta = {"pattern_induction": -0.15}
        rationale = self.explainer.generate_adaptation_rationale(delta, active_cluster_id=1)
        assert "scaffolded visual contrast cues" in rationale or "matrix" in rationale

    def test_prompt_context_formatting(self):
        delta = {"working_memory": 0.20, "executive_function": -0.10}
        prompt_block = self.explainer.format_xai_prompt_context(
            delta_vector=delta,
            cluster_id=3,
        )
        assert "Active Cognitive Archetype Index: Cluster 3" in prompt_block
        assert "working_memory: +20.0%" in prompt_block
        assert "executive_function: -10.0%" in prompt_block


class TestAICoachAgent:
    """End-to-end conversational agent testing."""

    def setup_method(self):
        self.agent = AICoachAgent()

    def test_handle_chat_turn_with_xai_and_guardrails(self):
        req = ChatRequest(
            user_id="user_123",
            message="Why did the task get faster? Could you explain the new timing?",
            active_cluster_id=3,
            delta_vector={"working_memory": 0.20},
        )
        resp = self.agent.handle_chat(req)
        assert resp.xai_explanation is not None
        assert "working memory" in resp.xai_explanation.lower()
        assert resp.collab_score_snapshot is not None
        assert 0.0 <= resp.collab_score_snapshot.composite_score <= 100.0
        assert resp.safety_metadata.is_safe is True
        assert len(resp.suggested_actions) >= 2

    def test_custom_llm_callable_with_safety_sanitization(self):
        # Simulate an LLM that mistakenly output a clinical word
        def mock_llm_runner(messages):
            return "You did well, but your ADHD deficit is noticeable."

        agent = AICoachAgent(llm_callable=mock_llm_runner)
        req = ChatRequest(
            user_id="user_test",
            message="How did I do on the last test?",
            active_cluster_id=1,
        )
        resp = agent.handle_chat(req)
        # Verify guardrail sanitized the output
        assert "adhd" not in resp.reply_text.lower()
        assert "deficit" not in resp.reply_text.lower()
        assert resp.safety_metadata.sanitized is True

    def test_generate_learning_path(self):
        curriculum = self.agent.generate_learning_path(
            user_id="user_456",
            cluster_id=7,
            delta_vector={"spatial_orientation": 0.15},
        )
        assert curriculum["user_id"] == "user_456"
        assert curriculum["archetype_tier"] == ArchetypeTier.STRATEGIST.value
        assert len(curriculum["modules"]) >= 3
        assert curriculum["safety_certified"] is True


class TestSrcCoachCompatibility:
    """Verify src/coach re-exports match README deliverables."""

    def test_imports_match(self):
        assert hasattr(src_coach, "AICoachAgent")
        assert hasattr(src_coach, "CollaborationScorer")
        assert hasattr(src_coach, "SafetyGuardrailEngine")
        assert hasattr(src_coach, "XAIExplainer")
