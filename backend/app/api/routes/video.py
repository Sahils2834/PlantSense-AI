import os
import asyncio
import shutil
import tempfile
from functools import partial
from fastapi import APIRouter, File, UploadFile, HTTPException
from app.services.video_processor import video_processor

router = APIRouter()

@router.post("/video/analyze")
async def analyze_video(file: UploadFile = File(...)):
    """
    Accepts video file upload, executes frame extraction & aggregate disease analysis,
    and returns complete Video Analysis Report.
    Runs in thread pool to avoid blocking the async event loop during heavy processing.
    """
    if not file:
        raise HTTPException(status_code=400, detail="No video file provided.")

    filename = file.filename or "video.mp4"
    extension = os.path.splitext(filename)[1].lower()
    
    if extension not in [".mp4", ".webm", ".mov", ".avi", ".mkv"]:
        raise HTTPException(status_code=400, detail="Unsupported video format. Allowed formats: MP4, WEBM, MOV, AVI, MKV.")

    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, filename)

    try:
        content = await file.read()
        with open(temp_path, "wb") as buffer:
            buffer.write(content)
        
        # Run CPU-bound video processing in a thread pool
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            partial(video_processor.process_video_file, temp_path, 2.0)
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing video upload: {str(e)}")
    finally:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)
