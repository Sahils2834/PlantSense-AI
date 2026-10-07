from fastapi import APIRouter
from app.services.model_registry import model_registry

router = APIRouter()

@router.get("/models/status")
def get_models_status():
    """
    Returns status of loaded YOLO models (YOLO11n, YOLO12n, YOLO26n)
    """
    return model_registry.get_status()
