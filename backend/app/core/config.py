from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


# ---------------------------------------------------------
# Project paths
# ---------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[2]

STORAGE_DIR = BASE_DIR / "storage"
UPLOAD_DIR = STORAGE_DIR / "uploads"
RESULTS_DIR = STORAGE_DIR / "results"

MODELS_DIR = BASE_DIR / "models"
DATASETS_DIR = BASE_DIR / "data"


# Create required directories automatically
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
RESULTS_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------
# Application settings
# ---------------------------------------------------------

class Settings(BaseSettings):

    # Application
    APP_NAME: str = "Plant Disease Detection System"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # API
    API_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str = "sqlite:///./plant_disease.db"

    # -----------------------------------------------------
    # AI
    # -----------------------------------------------------

    # Only ONE generative AI key is allowed.
    GEMINI_API_KEY: str = ""

    # -----------------------------------------------------
    # ML configuration
    # -----------------------------------------------------

    MODEL_MODE: str = "balanced"
    DEFAULT_DETECTOR: str = "yolo11n"
    DEFAULT_CLASSIFIER: str = "convnext"
    DEFAULT_SEGMENTATION: str = "none"

    MODEL_WEIGHTS: dict = {
        "yolo11n": 0.35,
        "yolo12n": 0.35,
        "yolo26n": 0.30,
    }

    # -----------------------------------------------------
    # Prediction thresholds
    # -----------------------------------------------------

    CONFIDENCE_THRESHOLD: float = 0.25
    OOD_THRESHOLD: float = 0.18
    UNCERTAINTY_THRESHOLD: float = 0.30

    # Severity thresholds (% of affected leaf area)
    SEVERITY_LOW_MAX: float = 10.0
    SEVERITY_MODERATE_MAX: float = 30.0
    SEVERITY_HIGH_MAX: float = 60.0

    # -----------------------------------------------------
    # Image configuration
    # -----------------------------------------------------

    MAX_IMAGE_SIZE_MB: int = 10
    MAX_IMAGE_WIDTH: int = 4096
    MAX_IMAGE_HEIGHT: int = 4096
    ALLOWED_IMAGE_TYPES: str = "image/jpeg,image/png,image/webp"

    # -----------------------------------------------------
    # Device
    # -----------------------------------------------------

    DEVICE: str = "cpu"

    # -----------------------------------------------------
    # CORS
    # -----------------------------------------------------

    FRONTEND_URL: str = "http://localhost:5173"

    # -----------------------------------------------------
    # Pydantic configuration
    # -----------------------------------------------------

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


# ---------------------------------------------------------
# Global settings instance
# ---------------------------------------------------------

settings = Settings()