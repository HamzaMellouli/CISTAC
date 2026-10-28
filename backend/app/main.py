"""AI4Brain Neurocognitive Assessment & Training Engine - Main FastAPI Entrypoint."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.session import router as session_router
from app.api.routes.telemetry import router as telemetry_router
from app.api.routes.brain import router as brain_router
from app.api.routes.coach import router as coach_router
from app.api.routes.v1_interop import router as v1_router

app = FastAPI(
    title="AI4Brain Neurocognitive Assessment & Training Platform",
    description="Computational Psychometrics, Procedural Task Generation, and Digital Brain State Engine",
    version="1.4.0",
)

# Enable CORS for frontend and sandboxed execution runtimes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes for both /api (Agent Cockpit) and /v1 (Platform Standard)
app.include_router(session_router, prefix="/api")
app.include_router(telemetry_router, prefix="/api")
app.include_router(brain_router, prefix="/api")
app.include_router(coach_router, prefix="/api")
app.include_router(v1_router)


@app.get("/")
def health_check():
    """System health check and engine capability matrix."""
    return {
        "status": "OPERATIONAL",
        "engine": "AI4Brain Neurocognitive Agent",
        "version": "1.4.0",
        "psychometrics": ["EZ-Diffusion-DDM", "3PL-IRT-MLE", "SSRT-Integration", "SignalDetection-dPrime", "RCI"],
        "task_generators": ["Arbitrarily Applicable Relational Responding (RFT)", "Interference-Loaded N-Back"],
        "digital_brain_nodes": ["dlPFC", "ACC", "vlPFC_Striatum", "Hippocampus_DG", "Parieto_Occipital"],
        "design_system": "Doodle (Hand Drawn) Design System",
    }
