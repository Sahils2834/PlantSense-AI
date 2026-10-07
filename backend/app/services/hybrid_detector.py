import io
import time
import logging
from datetime import datetime
from typing import Dict, List, Any, Tuple, Optional
from PIL import Image
import numpy as np
import cv2

from app.core.config import settings
from app.services.model_registry import model_registry, PLANTDOC_CLASSES

logger = logging.getLogger("hybrid_detector")
logging.basicConfig(level=logging.INFO)

# Dataset folder names / raw labels mapped to clean UI display names
DATASET_TO_DISPLAY = {
    "Apple Scab Leaf":                       "Apple - Apple Scab",
    "Apple leaf":                            "Apple - Healthy",
    "Apple rust leaf":                       "Apple - Cedar Rust",
    "Bell_pepper leaf":                      "Pepper - Healthy",
    "Bell_pepper leaf spot":                 "Pepper - Bacterial Spot",
    "Blueberry leaf":                        "Blueberry - Healthy",
    "Cherry leaf":                           "Cherry - Healthy",
    "Corn Gray leaf spot":                   "Corn - Gray Leaf Spot",
    "Corn leaf blight":                      "Corn - Northern Leaf Blight",
    "Corn rust leaf":                        "Corn - Common Rust",
    "Peach leaf":                            "Peach - Healthy",
    "Potato leaf early blight":              "Potato - Early Blight",
    "Potato leaf late blight":               "Potato - Late Blight",
    "Raspberry leaf":                        "Raspberry - Healthy",
    "Soyabean leaf":                         "Soybean - Healthy",
    "Squash Powdery mildew leaf":            "Squash - Powdery Mildew",
    "Strawberry leaf":                       "Strawberry - Healthy",
    "Tomato Early blight leaf":              "Tomato - Early Blight",
    "Tomato Septoria leaf spot":             "Tomato - Septoria Leaf Spot",
    "Tomato leaf":                           "Tomato - Healthy",
    "Tomato leaf bacterial spot":            "Tomato - Bacterial Spot",
    "Tomato leaf late blight":               "Tomato - Late Blight",
    "Tomato leaf mosaic virus":              "Tomato - Mosaic Virus",
    "Tomato leaf yellow virus":              "Tomato - Yellow Leaf Curl Virus",
    "Tomato mold leaf":                      "Tomato - Leaf Mold",
    "Tomato two spotted spider mites leaf":  "Tomato - Spider Mites",
    "grape leaf":                            "Grape - Healthy",
    "grape leaf black rot":                  "Grape - Black Rot",
}

# Non-plant COCO classes to filter/reject
COCO_REJECT_CLASSES = {
    "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat",
    "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat",
    "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack",
    "umbrella", "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball",
    "kite", "baseball bat", "baseball glove", "skateboard", "surfboard", "tennis racket",
    "bottle", "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana", "sandwich",
    "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair", "couch",
    "bed", "dining table", "toilet", "tv", "laptop", "mouse", "remote", "keyboard",
    "cell phone", "microwave", "oven", "toaster", "sink", "refrigerator", "book", "clock",
    "vase", "scissors", "teddy bear", "hair drier", "toothbrush", "helmet"
}

def clean_label(raw_label: str) -> Tuple[str, str]:
    """
    Parses raw class name into (Plant, Disease) tuple.
    """
    if not raw_label or raw_label == "No supported plant detected":
        return "Unknown", "No supported plant detected"

    disp = DATASET_TO_DISPLAY.get(raw_label, raw_label)
    if " - " in disp:
        parts = disp.split(" - ")
        return parts[0].strip(), parts[1].strip()

    s = raw_label.replace("___", " - ").replace("_", " ").strip()
    if " - " in s:
        parts = s.split(" - ")
        return parts[0].strip().title(), parts[1].strip().title()

    words = s.split()
    if len(words) >= 2 and words[0].lower() in ["tomato", "potato", "corn", "apple", "grape", "pepper", "peach", "cherry", "strawberry"]:
        plant = words[0].capitalize()
        disease = " ".join(words[1:]).title()
        return plant, disease

    return "Crop", s.title()


class HybridPlantDetector:
    """
    PlantSense Multi-Model Computer Vision & Gate Pipeline.
    1. Input Validation & Plant / Non-Plant Gate (Color segmentation + COCO object detection).
    2. Multi-Model Inference across 3 PlantDoc YOLO models (YOLO11n, YOLO12n, YOLO26n).
    3. Probability Distribution Normalization & Weighted Ensemble.
    4. True Model Agreement Calculation (3/3, 2/3, 1/3).
    5. Clean Structured Response with Per-Model Breakdown.
    """

    def check_plant_gate(self, img_bgr: np.ndarray, pil_img: Image.Image) -> Tuple[bool, str, float]:
        """
        Determines whether the input image contains a supported plant/leaf foliage.
        Returns (is_plant, reason, foliage_ratio).
        
        Note: Brown/necrotic leaves overlap HSV-wise with skin tones, so we must be
        careful not to reject diseased plant images. Skin-tone rejection only fires
        when there is clearly NO green vegetation AND skin is very dominant.
        """
        total_pixels = img_bgr.shape[0] * img_bgr.shape[1]
        img_hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)

        # Foliage masks:
        # Green foliar spectrum (vibrant leaf green, dark green, olive green)
        green_mask = cv2.inRange(img_hsv, np.array([25, 20, 20]), np.array([90, 255, 255]))
        # Yellow/chlorotic foliar spectrum (yellowing diseased leaves)
        yellow_mask = cv2.inRange(img_hsv, np.array([18, 30, 30]), np.array([35, 255, 255]))
        # Leaf necrosis / brown blight spectrum (wider range for diseased leaves)
        brown_mask = cv2.inRange(img_hsv, np.array([5, 30, 30]), np.array([22, 255, 200]))
        # Reddish leaf spot spectrum (many diseases cause red lesions)
        red_mask1 = cv2.inRange(img_hsv, np.array([0, 50, 30]), np.array([8, 255, 200]))
        red_mask2 = cv2.inRange(img_hsv, np.array([165, 50, 30]), np.array([180, 255, 200]))

        foliage_mask = cv2.bitwise_or(green_mask, yellow_mask)
        foliage_mask = cv2.bitwise_or(foliage_mask, brown_mask)
        foliage_mask = cv2.bitwise_or(foliage_mask, red_mask1)
        foliage_mask = cv2.bitwise_or(foliage_mask, red_mask2)

        green_pixels = cv2.countNonZero(green_mask)
        foliage_pixels = cv2.countNonZero(foliage_mask)
        
        green_ratio = green_pixels / max(1, total_pixels)
        foliage_ratio = foliage_pixels / max(1, total_pixels)

        # Human skin tone mask — only reliable when green is absent
        # Skin tones: hue 0-18, medium saturation (not too low = white/grey, not too high = vivid)
        skin_mask1 = cv2.inRange(img_hsv, np.array([0, 40, 80]), np.array([15, 160, 240]))
        skin_mask2 = cv2.inRange(img_hsv, np.array([168, 40, 80]), np.array([180, 160, 240]))
        skin_mask = cv2.bitwise_or(skin_mask1, skin_mask2)
        skin_ratio = cv2.countNonZero(skin_mask) / max(1, total_pixels)

        # 1. Only reject when skin is VERY dominant AND there is virtually NO green at all
        #    (Brown diseased leaves have similar HSV to skin, so require strict condition)
        if skin_ratio > 0.50 and green_ratio < 0.05 and foliage_ratio < 0.15:
            return False, "Human / person image detected", foliage_ratio

        # 2. Check COCO detector gate if loaded — only reject non-plant if almost no green
        if model_registry.coco_gate is not None:
            try:
                coco_res = model_registry.coco_gate.predict(pil_img, verbose=False, conf=0.45)
                if coco_res and len(coco_res) > 0 and coco_res[0].boxes is not None:
                    for box in coco_res[0].boxes:
                        cls_id = int(box.cls[0].cpu().numpy())
                        conf = float(box.conf[0].cpu().numpy())
                        cls_name = coco_res[0].names.get(cls_id, "").lower()
                        if cls_name in COCO_REJECT_CLASSES and conf > 0.50:
                            if green_ratio < 0.10 and foliage_ratio < 0.20:
                                return False, f"Non-plant object detected ({cls_name})", foliage_ratio
            except Exception as e:
                logger.debug(f"COCO gate inference notice: {e}")

        # 3. Very strict non-plant check: almost no color at all (black/white/grey image)
        if green_ratio < 0.01 and foliage_ratio < 0.05:
            return False, "Insufficient plant foliage detected", foliage_ratio

        return True, "Plant foliage verified", foliage_ratio

    def calculate_severity(self, disease_name: str, confidence: float) -> str:
        """
        Determines severity based on disease nature and detection confidence.
        """
        if "healthy" in disease_name.lower():
            return "Low"
        if confidence >= 0.85:
            return "High" if ("blight" in disease_name.lower() or "virus" in disease_name.lower() or "rot" in disease_name.lower()) else "Moderate"
        elif confidence >= 0.65:
            return "Moderate"
        else:
            return "Low"

    def process_image(self, image_bytes: bytes, filename: Optional[str] = None) -> Dict[str, Any]:
        """
        Main end-to-end inference pipeline:
        Image -> Validation -> Gate -> Multi-Model Ensemble -> Result
        """
        timestamp = datetime.now().isoformat()
        
        # 1. Decode Image
        try:
            pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            img_width, img_height = pil_img.size
            nparr = np.frombuffer(image_bytes, np.uint8)
            img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except Exception as e:
            logger.error(f"Failed to decode image payload: {e}")
            return {
                "success": False,
                "error": "Invalid or unreadable image file.",
                "timestamp": timestamp
            }

        # 2. Plant / Non-Plant Gate
        is_plant, gate_reason, fol_ratio = self.check_plant_gate(img_bgr, pil_img)
        if not is_plant:
            logger.info(f"Input rejected by plant gate: {gate_reason} (foliage={fol_ratio:.2f})")
            return {
                "success": True,
                "is_plant": False,
                "plant": "Non-Plant",
                "disease": "No supported plant detected",
                "confidence": 0.0,
                "severity": "Low",
                "affected_area_percent": 0.0,
                "is_unknown": True,
                "gate_reason": gate_reason,
                "model_agreement": {
                    "score": 0.0,
                    "models_agreeing": 0,
                    "total_models": len(model_registry.model_configs)
                },
                "models": {},
                "detections": [],
                "timestamp": timestamp
            }

        # 3. Retrieve Active Models
        active_models = model_registry.get_active_models()
        total_models_count = len(model_registry.model_configs)

        if not active_models:
            logger.error("No active models loaded in ModelRegistry.")
            return {
                "success": False,
                "error": "Machine learning models are currently unavailable.",
                "timestamp": timestamp
            }

        # 4. Multi-Model Inference & Probability Extraction
        # Accumulate probabilities across all 28 classes
        num_classes = len(PLANTDOC_CLASSES)
        class_prob_accumulator = np.zeros(num_classes, dtype=np.float32)
        total_weight = 0.0
        
        per_model_preds: Dict[str, Any] = {}
        model_top_classes: Dict[str, str] = {}

        for model_key, m_data in active_models.items():
            model = m_data["instance"]
            weight = settings.MODEL_WEIGHTS.get(model_key, 0.33)
            
            try:
                res = model.predict(pil_img, verbose=False)
                if res and len(res) > 0 and res[0].probs is not None:
                    probs_tensor = res[0].probs.data.cpu().numpy()
                    top1_idx = int(res[0].probs.top1)
                    top1_conf = float(res[0].probs.top1conf.cpu().numpy())
                    raw_name = res[0].names.get(top1_idx, PLANTDOC_CLASSES.get(top1_idx, f"Class_{top1_idx}"))
                    disp_name = DATASET_TO_DISPLAY.get(raw_name, raw_name)
                    
                    per_model_preds[model_key] = {
                        "name": m_data["name"],
                        "disease": disp_name,
                        "raw_label": raw_name,
                        "confidence": round(top1_conf, 3),
                        "class_id": top1_idx
                    }
                    model_top_classes[model_key] = disp_name
                    
                    # Accumulate weighted probability vector
                    if len(probs_tensor) == num_classes:
                        class_prob_accumulator += probs_tensor * weight
                        total_weight += weight
                    else:
                        class_prob_accumulator[top1_idx] += top1_conf * weight
                        total_weight += weight
            except Exception as ex:
                logger.error(f"Inference error on {model_key}: {ex}")

        if total_weight > 0:
            class_prob_accumulator /= total_weight

        # 5. Ensemble Winning Class & Agreement
        top_idx = int(np.argmax(class_prob_accumulator))
        top_prob = float(class_prob_accumulator[top_idx])
        
        winning_raw = PLANTDOC_CLASSES.get(top_idx, f"Class_{top_idx}")
        winning_display = DATASET_TO_DISPLAY.get(winning_raw, winning_raw)

        # Count true agreement among active models
        agreeing_count = sum(1 for m_key, top_c in model_top_classes.items() if top_c == winning_display)
        num_active = len(active_models)
        agreement_score = round(agreeing_count / max(1, num_active), 2)

        # Out-Of-Distribution / Low Confidence Check
        # OOD threshold is applied per-model: if ALL models have low confidence AND
        # ensemble confidence is low, mark as unknown. A single low-confidence model
        # should NOT mark the result unknown if others agree.
        all_low_conf = all(
            m_data.get("confidence", 1.0) < 0.35
            for m_data in per_model_preds.values()
        ) if per_model_preds else True

        is_unknown = False
        # Only mark unknown if BOTH ensemble is low confidence AND all models disagree/low
        if top_prob < settings.OOD_THRESHOLD and all_low_conf:
            is_unknown = True
            display_disease = "Unknown / Low Confidence"
            plant_name = "Unknown"
        else:
            display_disease = winning_display
            plant_name, _ = clean_label(display_disease)

        severity_label = self.calculate_severity(display_disease, top_prob)
        is_healthy = "healthy" in display_disease.lower()
        if is_healthy:
            severity_label = "Low"

        calibrated_conf = round(min(0.99, max(0.0, top_prob)), 3)

        detections = []
        if not is_unknown:
            detections.append({
                "label": display_disease,
                "confidence": calibrated_conf,
                "severity": severity_label,
                "affected_area_percent": 0.0
            })

        return {
            "success": True,
            "is_plant": True,
            "plant": plant_name,
            "disease": display_disease,
            "confidence": calibrated_conf,
            "severity": severity_label,
            "affected_area_percent": 0.0,
            "is_unknown": is_unknown,
            "model_agreement": {
                "score": agreement_score,
                "models_agreeing": agreeing_count,
                "total_models": total_models_count,
                "agreement_str": f"{agreeing_count}/{total_models_count}"
            },
            "models": per_model_preds,
            "detections": detections,
            "timestamp": timestamp
        }

hybrid_detector = HybridPlantDetector()
