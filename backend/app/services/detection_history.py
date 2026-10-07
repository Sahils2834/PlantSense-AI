import time
from datetime import datetime
from typing import List, Dict, Any

class DetectionHistoryService:
    """
    In-memory / persistent log store for live plant disease detection alerts and statistics.
    """

    def __init__(self):
        self.history: List[Dict[str, Any]] = []
        self.max_items = 200

    def add_detection(self, detection_res: Dict[str, Any]) -> Dict[str, Any]:
        if not detection_res.get("success", False):
            return detection_res

        # Reject non-plant / unknown detections from contaminating history
        if not detection_res.get("is_plant", True) or detection_res.get("is_unknown", False):
            return detection_res

        disease = detection_res.get("disease", "Unknown")
        severity = detection_res.get("severity", "Low")
        confidence = detection_res.get("confidence", 0.0)

        # Do not record healthy leaves as critical disease alert history
        if "healthy" in disease.lower() or disease == "No supported plant detected":
            return detection_res

        record = {
            "id": len(self.history) + 1,
            "disease": disease,
            "plant": detection_res.get("plant", "Crop"),
            "confidence": confidence,
            "severity": severity,
            "model_agreement": detection_res.get("model_agreement", {}).get("agreement_str", "3/3"),
            "affected_area_percent": detection_res.get("affected_area_percent", 0.0),
            "timestamp": detection_res.get("timestamp", datetime.now().isoformat())
        }

        self.history.insert(0, record)
        if len(self.history) > self.max_items:
            self.history.pop()

        return record

    def get_recent(self, limit: int = 30) -> List[Dict[str, Any]]:
        return self.history[:limit]

    def clear(self):
        self.history = []

    def get_stats(self) -> Dict[str, Any]:
        total_detections = len(self.history)
        critical_count = sum(1 for r in self.history if r.get("severity") in ["High", "Critical"])
        
        disease_counts = {}
        for r in self.history:
            d = r.get("disease", "Unknown")
            disease_counts[d] = disease_counts.get(d, 0) + 1

        return {
            "total_detections": total_detections,
            "critical_alerts": critical_count,
            "active_streams": 0,  # Dynamically governed by frontend connection state
            "disease_distribution": disease_counts,
            "system_status": "AI Model Ready"
        }

detection_history = DetectionHistoryService()
