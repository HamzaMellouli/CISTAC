"""Tests for V1 Platform Contract Interoperability and Design System."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check_design_system():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OPERATIONAL"
    assert data["design_system"] == "Doodle (Hand Drawn) Design System"


def test_v1_tasks_next():
    response = client.get("/v1/tasks/next?user_id=test_user")
    assert response.status_code == 200
    data = response.json()
    assert "task_id" in data
    assert "dimension" in data
    assert "schema_type" in data
    assert "params" in data


def test_v1_telemetry_event():
    payload = [{
        "user_id": "test_user",
        "session_id": "sess_123",
        "task_id": "task_1",
        "trial_index": 0,
        "score_norm": 1.0,
        "response_time_ms": 420.0,
    }]
    response = client.post("/v1/telemetry/event", json=payload)
    assert response.status_code == 202
    assert response.json()["accepted"] == 1


def test_v1_dashboard_profile():
    response = client.get("/v1/dashboard/profile?user_id=test_user")
    assert response.status_code == 200
    data = response.json()
    assert "estimates" in data
    assert len(data["estimates"]) == 6
    assert data["plasticity_bottleneck"] in ["dlPFC", "ACC", "vlPFC_Striatum", "Hippocampus_DG", "Parieto_Occipital"]


def test_v1_coach_chat():
    payload = {
        "user_id": "test_user",
        "user_prompt": "How can I improve my working memory?",
    }
    response = client.post("/v1/coach/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply_text" in data
    assert "xai_explanation" in data
    assert "suggested_actions" in data


def test_v1_coach_collaboration_score():
    response = client.get("/v1/coach/collaboration-score?user_id=test_user&cluster_id=3")
    assert response.status_code == 200
    data = response.json()
    assert "composite_score" in data
    assert data["composite_score"] >= 0.0


def test_v1_clustering_evaluate():
    payload = {"user_id": "test_user", "latent_vector": [0.1, 0.2, 0.3]}
    response = client.post("/v1/clustering/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["active_cluster_id"] == 3


def test_sandbox_html_doodle_tokens():
    init_res = client.post("/api/session/init", json={"user_id": "test_user"})
    assert init_res.status_code == 200
    html = init_res.json()["sandbox_html"]
    # Verify Doodle design system elements are present in generated HTML
    assert "Doodle (Hand Drawn) Design System" in html
    assert "#FFF5EE" in html  # Canvas paper
    assert "#E86A33" in html  # Brand terracotta
    assert "#263D5B" in html  # Navy border strong
    assert "Delius" in html   # Typography
    assert "tactile-btn" in html
