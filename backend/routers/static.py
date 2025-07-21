from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
import logging
import mimetypes

router = APIRouter(prefix="/uploads", tags=["static"])
logger = logging.getLogger(__name__)

UPLOAD_DIR = Path("/app/uploads")

@router.get("/{file_type}/{filename}")
async def get_uploaded_file(file_type: str, filename: str):
    """Serve uploaded files"""
    try:
        # Validate file type
        if file_type not in ["image", "video"]:
            raise HTTPException(status_code=400, detail="Invalid file type")
        
        # Construct file path
        file_path = UPLOAD_DIR / file_type / filename
        
        # Check if file exists
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        # Check if file is within allowed directory (security)
        try:
            file_path.resolve().relative_to(UPLOAD_DIR.resolve())
        except ValueError:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Guess media type
        media_type, _ = mimetypes.guess_type(str(file_path))
        
        return FileResponse(
            path=str(file_path),
            media_type=media_type,
            headers={"Cache-Control": "public, max-age=3600"}  # 1 hour cache
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error serving file {file_type}/{filename}: {e}")
        raise HTTPException(status_code=500, detail="Error serving file")