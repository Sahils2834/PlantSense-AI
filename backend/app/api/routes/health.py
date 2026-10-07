from fastapi import APIRouter
from app.services.model_registry import model_registry
from app.services.llm_assistant import llm_assistant

router = APIRouter()

@router.get("/health")
def health_check():
    status = model_registry.get_status()
    models_ready = status.get("active_models_count", 0) > 0
    llm_ready = llm_assistant.is_available()

    return {
        "status": "healthy" if models_ready else "degraded",
        "backend": True,
        "models": models_ready,
        "models_count": status.get("active_models_count", 0),
        "llm": llm_ready,
        "service": "PlantSense AI Plant Health API",
        "version": "1.0.0"
    }
