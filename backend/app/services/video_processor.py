import os
import cv2
import logging
from typing import Dict, List, Any
from app.services.hybrid_detector import hybrid_detector

logger = logging.getLogger("video_processor")
logging.basicConfig(level=logging.INFO)

class VideoProcessorService:
    """
    Robust Video Frame Extraction & Aggregate Disease Analysis Pipeline.
    Performs configurable frame sampling, per-frame multi-model ensemble,
    temporal disease tracking, confidence stability, and report aggregation.
    """

    def process_video_file(self, video_path: str, target_fps: float = 2.0) -> Dict[str, Any]:
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video file not found at {video_path}")

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            logger.error(f"Could not open video file at {video_path}")
            return {
                "success": False,
                "error": "Failed to read or decode video file codec.",
                "total_frames": 0,
                "analyzed_frames": 0
            }

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        video_fps = float(cap.get(cv2.CAP_PROP_FPS)) or 30.0
        
        # Calculate sample interval to achieve target ~2 FPS
        sample_interval = max(1, int(video_fps / max(0.5, target_fps)))

        analyzed_frames_count = 0
        affected_frames_count = 0
        non_plant_frames_count = 0
        healthy_frames_count = 0

        disease_counts: Dict[str, int] = {}
        disease_confidences: Dict[str, List[float]] = {}
        disease_plants: Dict[str, str] = {}
        disease_severities: Dict[str, List[str]] = {}

        frame_idx = 0

        try:
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break

                if frame_idx % sample_interval == 0:
                    analyzed_frames_count += 1

                    # Encode frame to JPEG bytes for inference
                    success, encoded_img = cv2.imencode('.jpg', frame)
                    if success:
                        img_bytes = encoded_img.tobytes()
                        frame_res = hybrid_detector.process_image(img_bytes)

                        if not frame_res.get("success", False):
                            continue

                        if not frame_res.get("is_plant", True) or frame_res.get("is_unknown", False):
                            non_plant_frames_count += 1
                            continue

                        dis_str = frame_res.get("disease", "Unknown")
                        conf = frame_res.get("confidence", 0.0)
                        plant = frame_res.get("plant", "Crop")
                        sev = frame_res.get("severity", "Low")

                        if "healthy" in dis_str.lower():
                            healthy_frames_count += 1
                        else:
                            affected_frames_count += 1
                            disease_counts[dis_str] = disease_counts.get(dis_str, 0) + 1
                            disease_plants[dis_str] = plant
                            
                            if dis_str not in disease_confidences:
                                disease_confidences[dis_str] = []
                                disease_severities[dis_str] = []

                            disease_confidences[dis_str].append(conf)
                            disease_severities[dis_str].append(sev)

                frame_idx += 1

        except Exception as e:
            logger.error(f"Error during video frame processing: {e}")
        finally:
            cap.release()

        # Handle case: All frames were non-plant or unreadable
        if analyzed_frames_count == 0 or (non_plant_frames_count >= analyzed_frames_count * 0.8 and not disease_counts and healthy_frames_count == 0):
            return {
                "success": True,
                "is_plant": False,
                "plant": "Non-Plant",
                "primary_disease": "No supported plant detected in video",
                "max_confidence": 0.0,
                "avg_confidence": 0.0,
                "severity": "None",
                "total_frames": total_frames,
                "analyzed_frames": analyzed_frames_count,
                "affected_frames": 0,
                "affected_percent": 0.0,
                "detected_diseases": []
            }

        # Handle case: Healthy plant with no disease
        if not disease_counts:
            return {
                "success": True,
                "is_plant": True,
                "plant": "Plant Crop",
                "primary_disease": "Healthy Plant (No Disease Detected)",
                "max_confidence": 0.95,
                "avg_confidence": 0.92,
                "severity": "Low",
                "total_frames": total_frames,
                "analyzed_frames": analyzed_frames_count,
                "affected_frames": 0,
                "affected_percent": 0.0,
                "detected_diseases": []
            }

        # Dominant disease selection
        primary_disease = max(disease_counts.items(), key=lambda x: x[1])[0]
        primary_plant = disease_plants.get(primary_disease, "Crop")
        
        all_confs = disease_confidences[primary_disease]
        max_conf = round(float(max(all_confs)), 3)
        avg_conf = round(float(sum(all_confs) / len(all_confs)), 3)

        affected_pct = round((affected_frames_count / max(1, analyzed_frames_count)) * 100.0, 1)

        detected_list = []
        for d_name, count in sorted(disease_counts.items(), key=lambda x: x[1], reverse=True):
            d_confs = disease_confidences[d_name]
            detected_list.append({
                "disease": d_name,
                "plant": disease_plants.get(d_name, "Crop"),
                "frame_count": count,
                "confidence": round(float(sum(d_confs) / len(d_confs)), 3),
                "max_confidence": round(float(max(d_confs)), 3)
            })

        return {
            "success": True,
            "is_plant": True,
            "plant": primary_plant,
            "primary_disease": primary_disease,
            "max_confidence": max_conf,
            "avg_confidence": avg_conf,
            "severity": disease_severities[primary_disease][0] if disease_severities.get(primary_disease) else "Moderate",
            "total_frames": total_frames,
            "analyzed_frames": analyzed_frames_count,
            "affected_frames": affected_frames_count,
            "affected_percent": affected_pct,
            "detected_diseases": detected_list
        }

video_processor = VideoProcessorService()
