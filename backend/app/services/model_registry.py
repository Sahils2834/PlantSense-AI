import os
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional
from ultralytics import YOLO

from app.core.config import settings, MODELS_DIR, BASE_DIR

logger = logging.getLogger("model_registry")
logging.basicConfig(level=logging.INFO)

# Authoritative PlantDoc 28-class canonical names
PLANTDOC_CLASSES = {
    0: "Apple Scab Leaf",
    1: "Apple leaf",
    2: "Apple rust leaf",
    3: "Bell_pepper leaf",
    4: "Bell_pepper leaf spot",
    5: "Blueberry leaf",
    6: "Cherry leaf",
    7: "Corn Gray leaf spot",
    8: "Corn leaf blight",
    9: "Corn rust leaf",
    10: "Peach leaf",
    11: "Potato leaf early blight",
    12: "Potato leaf late blight",
    13: "Raspberry leaf",
    14: "Soyabean leaf",
    15: "Squash Powdery mildew leaf",
    16: "Strawberry leaf",
    17: "Tomato Early blight leaf",
    18: "Tomato Septoria leaf spot",
    19: "Tomato leaf",
    20: "Tomato leaf bacterial spot",
    21: "Tomato leaf late blight",
    22: "Tomato leaf mosaic virus",
    23: "Tomato leaf yellow virus",
    24: "Tomato mold leaf",
    25: "Tomato two spotted spider mites leaf",
    26: "grape leaf",
    27: "grape leaf black rot"
}

class ModelRegistry:
    """
    Manages loading, status, and access to PlantDoc YOLO models:
    - YOLO11n (yolo11n.pt)
    - YOLO12n (yolo12n.pt)
    - YOLO26n (yolo26n.pt)
    and optional COCO gate model (coco_gate.pt)
    """

    def __init__(self):
        self.models: Dict[str, Any] = {}
        self.coco_gate: Optional[YOLO] = None
        self.model_configs = [
            {"name": "YOLO11n", "filename": "yolo11n.pt", "key": "yolo11n"},
            {"name": "YOLO12n", "filename": "yolo12n.pt", "key": "yolo12n"},
            {"name": "YOLO26n", "filename": "yolo26n.pt", "key": "yolo26n"},
        ]
        self.load_all_models()

    def _find_model_path(self, filename: str) -> Path:
        # Search in MODELS_DIR (backend/models), then workspace root
        path1 = MODELS_DIR / filename
        if path1.exists():
            return path1
        # Fallback to workspace root runs/classify
        if "yolo11" in filename:
            p = BASE_DIR.parent / "runs" / "classify" / "runs" / "classify" / "yolo11n_plantdoc" / "weights" / "best.pt"
            if p.exists(): return p
        elif "yolo12" in filename:
            p = BASE_DIR.parent / "runs" / "classify" / "runs" / "classify" / "yolo12n_plantdoc" / "weights" / "best.pt"
            if p.exists(): return p
        elif "yolo26" in filename:
            p = BASE_DIR.parent / "runs" / "classify" / "runs" / "classify" / "yolo26n_plantdoc" / "weights" / "best.pt"
            if p.exists(): return p
        return path1

    def load_all_models(self):
        logger.info("Initializing PlantSense Model Registry...")
        for cfg in self.model_configs:
            model_key = cfg["key"]
            model_path = self._find_model_path(cfg["filename"])
            if model_path.exists():
                try:
                    logger.info(f"Loading {cfg['name']} from {model_path}...")
                    model = YOLO(str(model_path))
                    class_count = len(getattr(model, "names", {}))
                    task = getattr(model, "task", "classify")
                    
                    self.models[model_key] = {
                        "name": cfg["name"],
                        "key": model_key,
                        "instance": model,
                        "path": str(model_path),
                        "status": "loaded",
                        "classes_count": class_count,
                        "task": task
                    }
                    logger.info(f"Successfully loaded {cfg['name']} ({class_count} classes, task={task})")
                except Exception as e:
                    logger.error(f"Failed to load {cfg['name']}: {str(e)}")
                    self.models[model_key] = {
                        "name": cfg["name"],
                        "key": model_key,
                        "instance": None,
                        "path": str(model_path),
                        "status": f"error: {str(e)}",
                        "classes_count": 0,
                        "task": "unknown"
                    }
            else:
                logger.warning(f"Model file not found for {cfg['name']} at {model_path}")
                self.models[model_key] = {
                    "name": cfg["name"],
                    "key": model_key,
                    "instance": None,
                    "path": str(model_path),
                    "status": "not_found",
                    "classes_count": 0,
                    "task": "unknown"
                }

        # Load COCO gate model if available
        coco_path = MODELS_DIR / "coco_gate.pt"
        if not coco_path.exists():
            coco_path = BASE_DIR.parent / "yolo12n.pt"
        if coco_path.exists():
            try:
                self.coco_gate = YOLO(str(coco_path))
                logger.info(f"Loaded COCO Gate Model from {coco_path}")
            except Exception as e:
                logger.warning(f"Could not load COCO Gate Model: {e}")

    def get_status(self) -> Dict[str, Any]:
        loaded_count = sum(1 for m in self.models.values() if m.get("instance") is not None)
        total_count = len(self.model_configs)
        
        models_list = []
        for cfg in self.model_configs:
            key = cfg["key"]
            m_info = self.models.get(key, {})
            is_loaded = m_info.get("instance") is not None
            models_list.append({
                "name": cfg["name"],
                "key": key,
                "loaded": is_loaded,
                "status": m_info.get("status", "unknown"),
                "classes": m_info.get("classes_count", 28),
                "task": m_info.get("task", "classify"),
                "weight": settings.MODEL_WEIGHTS.get(key, 0.33)
            })

        return {
            "status": "ready" if loaded_count >= 1 else "unavailable",
            "active_models_count": loaded_count,
            "total_models_count": total_count,
            "models": models_list,
            "coco_gate_active": self.coco_gate is not None
        }

    def get_active_models(self) -> Dict[str, Any]:
        return {k: v for k, v in self.models.items() if v.get("instance") is not None}

# Global singleton instance
model_registry = ModelRegistry()
