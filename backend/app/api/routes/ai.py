import asyncio
from functools import partial
from typing import Dict, List, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException

from app.services.llm_assistant import llm_assistant
from app.services.knowledge_service import knowledge_service

router = APIRouter()

class AnalyzeRequest(BaseModel):
    disease: str
    confidence: Optional[float] = 0.95
    severity: Optional[str] = "Moderate"
    language: Optional[str] = "en"
    farmer_context: Optional[Dict[str, Any]] = None

class ChatRequest(BaseModel):
    message: str
    disease_context: Optional[str] = None
    confidence: Optional[float] = None
    language: Optional[str] = "en"
    farmer_context: Optional[Dict[str, Any]] = None
    chat_history: Optional[List[Dict[str, str]]] = None

@router.post("/ai/analyze")
async def analyze_disease_endpoint(req: AnalyzeRequest):
    """
    Returns structured GenAI agricultural analysis for detected disease in requested language.
    Runs in thread pool to avoid blocking the async event loop.
    """
    if not req.disease:
        raise HTTPException(status_code=400, detail="Disease name is required.")

    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
        None,
        partial(
            llm_assistant.analyze_disease,
            disease=req.disease,
            confidence=req.confidence or 0.95,
            severity=req.severity or "Moderate",
            language=req.language or "en",
            farmer_context=req.farmer_context
        )
    )
    return result

@router.post("/ai/chat")
async def farmer_chat_endpoint(req: ChatRequest):
    """
    Conversational AI Chat assistant endpoint for farmers.
    Runs in thread pool to avoid blocking the async event loop.
    """
    if not req.message:
        raise HTTPException(status_code=400, detail="Message content is required.")

    loop = asyncio.get_event_loop()
    reply = await loop.run_in_executor(
        None,
        partial(
            llm_assistant.generate_chat_reply,
            message=req.message,
            disease_context=req.disease_context,
            confidence=req.confidence,
            language=req.language or "en",
            farmer_context=req.farmer_context,
            chat_history=req.chat_history
        )
    )
    return {"reply": reply}

@router.get("/disease/{disease_name}")
async def get_disease_knowledge(disease_name: str):
    """
    Knowledge base lookup endpoint for disease details.
    """
    return knowledge_service.get_disease_info(disease_name)
