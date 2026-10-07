from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import create_tables


# =========================================================
# Application startup / shutdown
# =========================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Runs when the FastAPI application starts and stops.
    """

    # Create database tables
    create_tables()

    print("Plant Disease Detection API started")

    yield

    print("Plant Disease Detection API stopped")


# =========================================================
# FastAPI application
# =========================================================

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "AI-powered plant disease detection system "
        "designed for real-field conditions."
    ),
    lifespan=lifespan,
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from app.api.routes import health, diagnosis, models, detections, video, ai

# Include Routers
app.include_router(health.router, prefix=settings.API_PREFIX, tags=["Health"])
app.include_router(diagnosis.router, prefix=settings.API_PREFIX, tags=["Diagnosis"])
app.include_router(models.router, prefix=settings.API_PREFIX, tags=["Models"])
app.include_router(detections.router, prefix=settings.API_PREFIX, tags=["Detections"])
app.include_router(video.router, prefix=settings.API_PREFIX, tags=["Video"])
app.include_router(ai.router, prefix=settings.API_PREFIX, tags=["AI"])



# =========================================================
# Root endpoint
# =========================================================

@app.get("/")
def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
    }


from app.services.model_registry import model_registry
from app.services.llm_assistant import llm_assistant

# =========================================================
# Health endpoint
# =========================================================

@app.get("/health")
def root_health_check():
    m_stat = model_registry.get_status()
    models_ready = m_stat.get("active_models_count", 0) > 0
    return {
        "status": "healthy" if models_ready else "degraded",
        "backend": True,
        "models": models_ready,
        "models_count": m_stat.get("active_models_count", 0),
        "llm": llm_assistant.is_available(),
        "service": "PlantSense AI Plant Health API",
    }