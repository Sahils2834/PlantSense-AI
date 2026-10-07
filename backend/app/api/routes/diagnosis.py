import asyncio
from functools import partial
from fastapi import APIRouter, File, UploadFile, HTTPException
from app.services.hybrid_detector import hybrid_detector
from app.services.detection_history import detection_history

router = APIRouter()

@router.post("/diagnosis/frame")
async def analyze_frame(file: UploadFile = File(...)):
    """
    Accepts image frame via multipart form file.
    Runs hybrid model inference (YOLO11n, YOLO12n, YOLO26n) and returns detection result.
    Inference is run in a thread pool to avoid blocking the async event loop.
    """
    if not file:
        raise HTTPException(status_code=400, detail="No frame uploaded.")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty frame content.")

    # Run CPU-bound YOLO inference in a thread pool to keep the event loop unblocked
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
        None,
        partial(hybrid_detector.process_image, contents, file.filename)
    )
    
    if result.get("success", False):
        detection_history.add_detection(result)

    return result

# Backward compatibility alias
@router.post("/diagnosis")
async def legacy_diagnosis(file: UploadFile = File(...)):
    return await analyze_frame(file)
