from fastapi import APIRouter
from app.services.detection_history import detection_history

router = APIRouter()

@router.get("/detections/recent")
def get_recent_detections(limit: int = 30):
    return {
        "success": True,
        "recent_alerts": detection_history.get_recent(limit)
    }

@router.get("/detections/stats")
def get_detection_stats():
    return {
        "success": True,
        "stats": detection_history.get_stats()
    }

@router.delete("/detections/clear")
def clear_detections():
    detection_history.clear()
    return {
        "success": True,
        "message": "Detection history cleared successfully."
    }
