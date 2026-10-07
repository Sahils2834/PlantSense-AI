import os
import io
import sys
import json
from pathlib import Path
from PIL import Image

# Add backend to sys.path
backend_path = Path(__file__).resolve().parent / "backend"
sys.path.insert(0, str(backend_path))

from fastapi.testclient import TestClient
from app.main import app
from app.services.model_registry import model_registry
from app.services.hybrid_detector import hybrid_detector
from app.services.llm_assistant import llm_assistant
from app.services.knowledge_service import knowledge_service

client = TestClient(app)

print("=" * 70)
print("PLANTSENSE COMPREHENSIVE END-TO-END SYSTEM TEST SUITE")
print("=" * 70)

test_results = {}

def record_test(name, passed, details=""):
    test_results[name] = {"passed": passed, "details": details}
    status = "PASS" if passed else "FAIL"
    print(f"[{status}] {name}")
    if details:
        print(f"       Details: {details}")

# ── Test 1: System Health Endpoint ──
try:
    resp = client.get("/api/v1/health")
    data = resp.json()
    passed = resp.status_code == 200 and data.get("backend") is True and data.get("models") is True
    record_test("Health Endpoint (/api/v1/health)", passed, f"models_count={data.get('models_count')}, llm={data.get('llm')}")
except Exception as e:
    record_test("Health Endpoint (/api/v1/health)", False, str(e))

# ── Test 2: Model Status Endpoint ──
try:
    resp = client.get("/api/v1/models/status")
    data = resp.json()
    models = data.get("models", [])
    passed = resp.status_code == 200 and data.get("status") == "ready" and len(models) == 3
    loaded_count = sum(1 for m in models if m.get("loaded") is True and m.get("classes") == 28)
    record_test("Model Health (/api/v1/models/status)", passed and loaded_count == 3, f"3/3 models loaded with 28 classes")
except Exception as e:
    record_test("Model Health (/api/v1/models/status)", False, str(e))

# Helper to load image bytes
test_dir = Path("dataset/test")

def get_class_image(class_folder_name):
    folder = test_dir / class_folder_name
    if folder.exists():
        imgs = list(folder.glob("*.jpg")) + list(folder.glob("*.png"))
        if imgs:
            with open(imgs[0], "rb") as f:
                return f.read(), imgs[0].name
    return None, None

# ── Test 3: Apple Disease Image ──
try:
    img_bytes, filename = get_class_image("Apple Scab Leaf")
    resp = client.post("/api/v1/diagnosis/frame", files={"file": ("apple_scab.jpg", img_bytes, "image/jpeg")})
    data = resp.json()
    passed = resp.status_code == 200 and "Apple" in data.get("plant", "") and "Apple Scab" in data.get("disease", "")
    record_test("TEST 1: Apple Disease Diagnosis", passed, f"Predicted: {data.get('disease')} (conf: {data.get('confidence')})")
except Exception as e:
    record_test("TEST 1: Apple Disease Diagnosis", False, str(e))

# ── Test 4: Corn Disease Image ──
try:
    img_bytes, filename = get_class_image("Corn leaf blight")
    resp = client.post("/api/v1/diagnosis/frame", files={"file": ("corn_blight.jpg", img_bytes, "image/jpeg")})
    data = resp.json()
    passed = resp.status_code == 200 and "Corn" in data.get("plant", "") and "Leaf Blight" in data.get("disease", "")
    record_test("TEST 2: Corn Disease Diagnosis", passed, f"Predicted: {data.get('disease')} (conf: {data.get('confidence')})")
except Exception as e:
    record_test("TEST 2: Corn Disease Diagnosis", False, str(e))

# ── Test 5: Tomato Disease Image ──
try:
    img_bytes, filename = get_class_image("Tomato leaf yellow virus")
    resp = client.post("/api/v1/diagnosis/frame", files={"file": ("tomato_yellow.jpg", img_bytes, "image/jpeg")})
    data = resp.json()
    passed = resp.status_code == 200 and "Tomato" in data.get("plant", "") and "Yellow Leaf Curl Virus" in data.get("disease", "")
    record_test("TEST 3: Tomato Disease Diagnosis", passed, f"Predicted: {data.get('disease')} (conf: {data.get('confidence')})")
except Exception as e:
    record_test("TEST 3: Tomato Disease Diagnosis", False, str(e))

# ── Test 6: Potato Disease Image ──
try:
    img_bytes, filename = get_class_image("Potato leaf early blight")
    resp = client.post("/api/v1/diagnosis/frame", files={"file": ("potato_early.jpg", img_bytes, "image/jpeg")})
    data = resp.json()
    passed = resp.status_code == 200 and "Potato" in data.get("plant", "") and "Blight" in data.get("disease", "")
    record_test("TEST 4: Potato Disease Diagnosis", passed, f"Predicted: {data.get('disease')} (conf: {data.get('confidence')})")
except Exception as e:
    record_test("TEST 4: Potato Disease Diagnosis", False, str(e))

# ── Test 7: Grape Disease Image ──
try:
    img_bytes, filename = get_class_image("grape leaf black rot")
    resp = client.post("/api/v1/diagnosis/frame", files={"file": ("grape_rot.jpg", img_bytes, "image/jpeg")})
    data = resp.json()
    passed = resp.status_code == 200 and "Grape" in data.get("plant", "") and "Black Rot" in data.get("disease", "")
    record_test("TEST 5: Grape Disease Diagnosis", passed, f"Predicted: {data.get('disease')} (conf: {data.get('confidence')})")
except Exception as e:
    record_test("TEST 5: Grape Disease Diagnosis", False, str(e))

# ── Test 8: Non-Plant Gate: Human Image ──
try:
    with open("tests_data/non_plant/human.jpg", "rb") as f:
        img_bytes = f.read()
    resp = client.post("/api/v1/diagnosis/frame", files={"file": ("human.jpg", img_bytes, "image/jpeg")})
    data = resp.json()
    passed = resp.status_code == 200 and data.get("is_plant") is False and "No supported plant" in data.get("disease", "")
    record_test("TEST 6: Human Image Rejection Gate", passed, f"Gate Result: {data.get('disease')} (reason: {data.get('gate_reason')})")
except Exception as e:
    record_test("TEST 6: Human Image Rejection Gate", False, str(e))

# ── Test 9: Non-Plant Gate: Pizza Image ──
try:
    with open("tests_data/non_plant/pizza.jpg", "rb") as f:
        img_bytes = f.read()
    resp = client.post("/api/v1/diagnosis/frame", files={"file": ("pizza.jpg", img_bytes, "image/jpeg")})
    data = resp.json()
    passed = resp.status_code == 200 and data.get("is_plant") is False and "No supported plant" in data.get("disease", "")
    record_test("TEST 7: Pizza Image Rejection Gate", passed, f"Gate Result: {data.get('disease')} (reason: {data.get('gate_reason')})")
except Exception as e:
    record_test("TEST 7: Pizza Image Rejection Gate", False, str(e))

# ── Test 10: Non-Plant Gate: Phone Image ──
try:
    with open("tests_data/non_plant/phone.jpg", "rb") as f:
        img_bytes = f.read()
    resp = client.post("/api/v1/diagnosis/frame", files={"file": ("phone.jpg", img_bytes, "image/jpeg")})
    data = resp.json()
    passed = resp.status_code == 200 and data.get("is_plant") is False and "No supported plant" in data.get("disease", "")
    record_test("TEST 8: Phone Image Rejection Gate", passed, f"Gate Result: {data.get('disease')} (reason: {data.get('gate_reason')})")
except Exception as e:
    record_test("TEST 8: Phone Image Rejection Gate", False, str(e))

# ── Test 11: Non-Plant Gate: Car Image ──
try:
    with open("tests_data/non_plant/car.jpg", "rb") as f:
        img_bytes = f.read()
    resp = client.post("/api/v1/diagnosis/frame", files={"file": ("car.jpg", img_bytes, "image/jpeg")})
    data = resp.json()
    passed = resp.status_code == 200 and data.get("is_plant") is False and "No supported plant" in data.get("disease", "")
    record_test("TEST 9: Car Image Rejection Gate", passed, f"Gate Result: {data.get('disease')} (reason: {data.get('gate_reason')})")
except Exception as e:
    record_test("TEST 9: Car Image Rejection Gate", False, str(e))

# ── Test 12: Multilingual AI Analysis (English) ──
try:
    resp = client.post("/api/v1/ai/analyze", json={"disease": "Tomato - Early Blight", "confidence": 0.95, "severity": "Moderate", "language": "en"})
    data = resp.json()
    passed = resp.status_code == 200 and "explanation" in data and "treatment" in data and len(data.get("treatment", [])) > 0
    record_test("TEST 10: AI Analysis (English)", passed, f"Explanation: {data.get('explanation')[:50]}...")
except Exception as e:
    record_test("TEST 10: AI Analysis (English)", False, str(e))

# ── Test 13: Multilingual AI Analysis (Hindi) ──
try:
    resp = client.post("/api/v1/ai/analyze", json={"disease": "Tomato - Early Blight", "confidence": 0.95, "severity": "Moderate", "language": "hi"})
    data = resp.json()
    has_hindi = any('\u0900' <= char <= '\u097F' for char in data.get("explanation", ""))
    passed = resp.status_code == 200 and has_hindi and "action_plan" in data
    record_test("TEST 11: AI Analysis (Hindi)", passed, f"Explanation: {data.get('explanation')[:50]}...")
except Exception as e:
    record_test("TEST 11: AI Analysis (Hindi)", False, str(e))

# ── Test 14: Multilingual AI Analysis (Marathi) ──
try:
    resp = client.post("/api/v1/ai/analyze", json={"disease": "Tomato - Early Blight", "confidence": 0.95, "severity": "Moderate", "language": "mr"})
    data = resp.json()
    has_marathi = any('\u0900' <= char <= '\u097F' for char in data.get("explanation", ""))
    passed = resp.status_code == 200 and has_marathi and "action_plan" in data
    record_test("TEST 12: AI Analysis (Marathi)", passed, f"Explanation: {data.get('explanation')[:50]}...")
except Exception as e:
    record_test("TEST 12: AI Analysis (Marathi)", False, str(e))

# ── Test 15: Ask AI Chat with Disease Context ──
try:
    resp = client.post("/api/v1/ai/chat", json={
        "message": "What is the best treatment?",
        "disease_context": "Tomato - Early Blight",
        "confidence": 0.95,
        "language": "en"
    })
    data = resp.json()
    passed = resp.status_code == 200 and "reply" in data and len(data["reply"]) > 20
    record_test("TEST 13: Ask AI with Context (English)", passed, f"Reply: {data.get('reply')[:60]}...")
except Exception as e:
    record_test("TEST 13: Ask AI with Context (English)", False, str(e))

# ── Test 16: Ask AI Chat in Marathi ──
try:
    resp = client.post("/api/v1/ai/chat", json={
        "message": "यावर काय उपाय करावेत?",
        "disease_context": "Tomato - Early Blight",
        "confidence": 0.95,
        "language": "mr"
    })
    data = resp.json()
    has_mr = any('\u0900' <= char <= '\u097F' for char in data.get("reply", ""))
    passed = resp.status_code == 200 and has_mr
    record_test("TEST 14: Ask AI in Marathi", passed, f"Reply: {data.get('reply')[:60]}...")
except Exception as e:
    record_test("TEST 14: Ask AI in Marathi", False, str(e))

# ── Test 17: Ask AI with No Detection Context ──
try:
    resp = client.post("/api/v1/ai/chat", json={
        "message": "What is wrong with my plant?",
        "disease_context": None,
        "language": "en"
    })
    data = resp.json()
    passed = resp.status_code == 200 and "upload or capture a plant" in data.get("reply", "").lower()
    record_test("TEST 15: Ask AI No Context Guard", passed, f"Reply: {data.get('reply')}")
except Exception as e:
    record_test("TEST 15: Ask AI No Context Guard", False, str(e))

# ── Test 18: Video Pipeline Analysis ──
try:
    # Create a synthetic 10-frame test video
    import cv2
    import numpy as np
    
    vid_test_path = Path("tests_data/test_plant_video.mp4")
    vid_test_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Generate 15 frames of Apple Scab leaf
    img_bytes, _ = get_class_image("Apple Scab Leaf")
    nparr = np.frombuffer(img_bytes, np.uint8)
    sample_frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    sample_frame = cv2.resize(sample_frame, (320, 240))
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(str(vid_test_path), fourcc, 5.0, (320, 240))
    for _ in range(15):
        out.write(sample_frame)
    out.release()
    
    with open(vid_test_path, "rb") as f:
        vid_bytes = f.read()
    
    resp = client.post("/api/v1/video/analyze", files={"file": ("test_plant_video.mp4", vid_bytes, "video/mp4")})
    data = resp.json()
    passed = resp.status_code == 200 and data.get("success") is True and "Apple" in data.get("plant", "") and "Apple Scab" in data.get("primary_disease", "")
    record_test("TEST 16: Video Aggregation Pipeline", passed, f"Primary: {data.get('primary_disease')} (analyzed {data.get('analyzed_frames')} frames)")
except Exception as e:
    record_test("TEST 16: Video Aggregation Pipeline", False, str(e))

print("=" * 70)
total_tests = len(test_results)
passed_tests = sum(1 for t in test_results.values() if t["passed"])
print(f"RESULTS SUMMARY: {passed_tests} / {total_tests} PASSED ({(passed_tests/total_tests)*100:.1f}%)")
print("=" * 70)
