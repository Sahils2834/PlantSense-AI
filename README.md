# 🌱 PLANTSENSE
### AI-Powered Multi-Model Plant Disease Detection & Multilingual Farmer Assistant

PlantSense is an enterprise-grade agricultural intelligence platform that combines **Multi-Model Computer Vision (YOLO11n, YOLO12n, YOLO26n)**, **Input Gating**, **Weighted Consensus Ensembling**, and **Multilingual Generative AI** to deliver real-time, field-ready plant disease diagnosis and localized farmer decision support.

---

## 🚀 Key Features

1. **Multi-Model Computer Vision Ensemble:**
   - Evaluates three independent models: **YOLO11n**, **YOLO12n**, and **YOLO26n** trained on the 28-class PlantDoc dataset.
   - Computes weighted softmax probability distributions and reports authentic model agreement (e.g., `3/3 models agree`).
2. **Plant / Non-Plant Rejection Gate:**
   - Robust dual-stage verification: checks non-plant object detection (rejects humans, phones, cars, food, animals) and analyzes foliar chlorophyll/necrosis color spectra.
   - Rejects non-plant input with clear guidance (*"No supported plant detected"*).
3. **Comprehensive Input Modalities:**
   - **Image Upload:** Immediate drag-and-drop analysis with full model consensus breakdown.
   - **Live Camera Stream:** Real-time frame sampling (~2 FPS) with live bounding boxes, confidence, and active stream tracking.
   - **Video Inspection Pipeline:** Server-side frame sampling, temporal aggregation across frames, dominant disease identification, and video inspection reports.
4. **Multilingual GenAI Farmer Assistant:**
   - Full native language support across UI, diagnostics, and AI advice in **English, Hindi (हिन्दी), Marathi (मराठी), Kannada (ಕನ್ನಡ), Telugu (తెలుగు), Tamil (தமிழ்), Gujarati (ગુજરાતી), Bengali (বাংলা), and Punjabi (ਪੰਜਾਬੀ)**.
   - When Gemini API key is configured, generates rich personalized remedies and step-by-step action plans in the target language.
   - Grounded rule-based fallback knowledgebase ensures 100% offline availability in Hindi, Marathi, and English.
5. **Conversational "Ask AI" Farmer Chat:**
   - Context-aware dialogue maintaining current crop diagnosis, confidence, and regional farmer context.
   - Guarded against hallucinations when no plant is detected.
6. **Real-time System & Model Health Synchronization:**
   - Separate, live health metrics for Backend, 3x ML Models, and LLM Generative AI.

---

## 🏗️ Architecture & ML Pipeline

```
                 ┌─────────────────────────────────┐
                 │    USER INPUT (Image/Video/Cam) │
                 └────────────────┬────────────────┘
                                  │
                                  ▼
                 ┌─────────────────────────────────┐
                 │      INPUT VALIDATION & GATE    │
                 │   - Chlorophyll / Foliar Filter │
                 │   - Non-Plant Object Rejection  │
                 └────────────────┬────────────────┘
                                  │
                  [Valid Plant Leaf Verified]
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
         ▼                        ▼                        ▼
  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
  │   YOLO11n    │         │   YOLO12n    │         │   YOLO26n    │
  │ (28 Classes) │         │ (28 Classes) │         │ (28 Classes) │
  └──────┬───────┘         └──────┬───────┘         └──────┬───────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                                  ▼
                 ┌─────────────────────────────────┐
                 │  CLASS PROBABILITY NORMALIZATION│
                 │   - 28-Class Softmax Vectors    │
                 │   - Weighted Voting Ensemble    │
                 └────────────────┬────────────────┘
                                  │
                                  ▼
                 ┌─────────────────────────────────┐
                 │       FINAL DISEASE RESULT      │
                 │   - True Model Agreement (3/3)  │
                 │   - Calibrated Confidence       │
                 │   - Categorized Severity        │
                 └────────────────┬────────────────┘
                                  │
                                  ▼
                 ┌─────────────────────────────────┐
                 │   MULTILINGUAL LLM REASONING    │
                 │   - Grounded / Gemini Engine    │
                 │   - Symptoms, Causes, Remedies  │
                 │   - Action Plan (Today/3D/2W)   │
                 │   - Target Language (HI/MR/EN)  │
                 └────────────────┬────────────────┘
                                  │
                                  ▼
                 ┌─────────────────────────────────┐
                 │      FARMER UI / CHAT / REPORT  │
                 └─────────────────────────────────┘
```

---

## 🌿 PlantDoc Dataset & Supported Classes

PlantSense is trained on 28 agricultural classes from the benchmark PlantDoc dataset:

| # | Crop | Condition / Disease |
|---|---|---|
| 0 | Apple | Apple Scab (`Apple Scab Leaf`) |
| 1 | Apple | Healthy (`Apple leaf`) |
| 2 | Apple | Cedar Rust (`Apple rust leaf`) |
| 3 | Bell Pepper | Healthy (`Bell_pepper leaf`) |
| 4 | Bell Pepper | Bacterial Spot (`Bell_pepper leaf spot`) |
| 5 | Blueberry | Healthy (`Blueberry leaf`) |
| 6 | Cherry | Healthy (`Cherry leaf`) |
| 7 | Corn | Gray Leaf Spot (`Corn Gray leaf spot`) |
| 8 | Corn | Northern Leaf Blight (`Corn leaf blight`) |
| 9 | Corn | Common Rust (`Corn rust leaf`) |
| 10 | Peach | Healthy (`Peach leaf`) |
| 11 | Potato | Early Blight (`Potato leaf early blight`) |
| 12 | Potato | Late Blight (`Potato leaf late blight`) |
| 13 | Raspberry | Healthy (`Raspberry leaf`) |
| 14 | Soybean | Healthy (`Soyabean leaf`) |
| 15 | Squash | Powdery Mildew (`Squash Powdery mildew leaf`) |
| 16 | Strawberry | Healthy (`Strawberry leaf`) |
| 17 | Tomato | Early Blight (`Tomato Early blight leaf`) |
| 18 | Tomato | Septoria Leaf Spot (`Tomato Septoria leaf spot`) |
| 19 | Tomato | Healthy (`Tomato leaf`) |
| 20 | Tomato | Bacterial Spot (`Tomato leaf bacterial spot`) |
| 21 | Tomato | Late Blight (`Tomato leaf late blight`) |
| 22 | Tomato | Mosaic Virus (`Tomato leaf mosaic virus`) |
| 23 | Tomato | Yellow Leaf Curl Virus (`Tomato leaf yellow virus`) |
| 24 | Tomato | Leaf Mold (`Tomato mold leaf`) |
| 25 | Tomato | Spider Mites (`Tomato two spotted spider mites leaf`) |
| 26 | Grape | Healthy (`grape leaf`) |
| 27 | Grape | Black Rot (`grape leaf black rot`) |

---

## 📁 Project Directory Tree

```
plant-desease-detection/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── ai.py           # GenAI & Ask AI Chat endpoints
│   │   │       ├── detections.py   # Detection history & statistics
│   │   │       ├── diagnosis.py    # Image & frame diagnosis
│   │   │       ├── health.py       # Live system health check
│   │   │       ├── models.py       # Model registry status endpoint
│   │   │       └── video.py        # Video analysis endpoint
│   │   ├── core/
│   │   │   ├── config.py           # Application settings & thresholds
│   │   │   └── database.py         # SQLite / table schemas
│   │   ├── services/
│   │   │   ├── detection_history.py# Validated history log store
│   │   │   ├── hybrid_detector.py  # Gate, ensemble & inference engine
│   │   │   ├── knowledge_service.py# Multilingual grounded knowledgebase
│   │   │   ├── llm_assistant.py    # Gemini & fallback GenAI assistant
│   │   │   ├── model_registry.py   # Model manager for YOLO11/12/26
│   │   │   └── video_processor.py  # Temporal video frame aggregator
│   │   └── main.py                 # FastAPI application root & CORS
│   ├── models/
│   │   ├── yolo11n.pt              # Trained PlantDoc YOLO11n classifier
│   │   ├── yolo12n.pt              # Trained PlantDoc YOLO12n classifier
│   │   ├── yolo26n.pt              # Trained PlantDoc YOLO26n classifier
│   │   └── coco_gate.pt            # Non-plant rejection gate model
│   ├── .env.example                # Configuration template
│   └── requirements.txt            # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── Header.jsx       # Health status & language selector
│   │   │   │   ├── ReportsModal.jsx # Inspection reports & logs
│   │   │   │   ├── Sidebar.jsx      # Navigation, controls & history
│   │   │   │   ├── StatsBar.jsx     # Live counts & stream monitor
│   │   │   │   └── StreamView.jsx   # Live camera / video stream canvas
│   │   │   └── diagnosis/
│   │   │       ├── AnalysisPane.jsx # Diagnosis result & GenAI panel
│   │   │       ├── ChatPane.jsx     # Ask AI multilingual chat
│   │   │       ├── FarmerContextDrawer.jsx # Farmer field context form
│   │   │       ├── ImageUploadView.jsx     # Image drag & drop
│   │   │       ├── VideoAnalysisResult.jsx # Video report card
│   │   │       └── VideoUploadView.jsx     # Video upload & preview
│   │   ├── App.jsx                 # Master application controller
│   │   ├── App.css                 # Responsive stylesheet
│   │   └── i18n.js                 # Centralized 9-language translations
│   ├── package.json
│   └── vite.config.js
│
├── dataset/                        # PlantDoc dataset (train / test)
├── runs/                           # Training checkpoint artifacts
├── tests_final_system.py           # Automated 18-point verification test
└── README.md
```

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Install Python requirements
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# (Optional: Add your GEMINI_API_KEY in backend/.env)

# Start backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install npm dependencies
npm install

# Start development server
npm run dev
```
Frontend will be available at `http://localhost:5173`.

---

## 🧪 Automated System Verification

To run the complete 18-point end-to-end automated test suite:
```bash
python tests_final_system.py
```

---

## 📜 Research Relationship

- **Baseline:** Research paper *"ConvGeM-next: a deep learning framework for plant disease detection"* (Frontiers in Plant Science, 2026).
- **PlantSense Extension:** Extends the benchmark dataset into an operational field assistant with **multi-model consensus voting**, **non-plant rejection gating**, **real-time video & camera streaming**, **sub-second inference**, and **multilingual GenAI reasoning** for real-world farmers.
