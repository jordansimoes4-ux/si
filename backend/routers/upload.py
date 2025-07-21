from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.admin_models import AdminUser
from routers.auth import get_current_user
import os
import shutil
import uuid
import logging
from pathlib import Path
from typing import Optional
import mimetypes

router = APIRouter(prefix="/api/upload", tags=["upload"])
logger = logging.getLogger(__name__)

# Upload directory
UPLOAD_DIR = Path("/app/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Allowed file types
ALLOWED_IMAGE_TYPES = {
    "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
}
ALLOWED_VIDEO_TYPES = {
    "video/mp4", "video/avi", "video/mov", "video/wmv", "video/webm"
}
ALL_ALLOWED_TYPES = ALLOWED_IMAGE_TYPES | ALLOWED_VIDEO_TYPES

# Max file size (50MB)
MAX_FILE_SIZE = 50 * 1024 * 1024

async def get_database() -> AsyncIOMotorDatabase:
    from motor.motor_asyncio import AsyncIOMotorClient
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    return client[os.environ['DB_NAME']]

def get_file_type(content_type: str) -> str:
    """Determine if file is image or video"""
    if content_type in ALLOWED_IMAGE_TYPES:
        return "image"
    elif content_type in ALLOWED_VIDEO_TYPES:
        return "video"
    else:
        raise ValueError("Unsupported file type")

def validate_file(file: UploadFile) -> None:
    """Validate uploaded file"""
    # Check content type
    if file.content_type not in ALL_ALLOWED_TYPES:
        raise HTTPException(
            status_code=400, 
            detail=f"Type de fichier non supporté. Types autorisés: {', '.join(ALL_ALLOWED_TYPES)}"
        )
    
    # Check file size (this is approximate, actual check happens during read)
    if hasattr(file, 'size') and file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Fichier trop volumineux. Taille maximum: {MAX_FILE_SIZE // (1024*1024)}MB"
        )

async def save_file(file: UploadFile, file_type: str) -> tuple[str, str]:
    """Save uploaded file and return file path and URL"""
    try:
        # Generate unique filename
        file_extension = Path(file.filename).suffix.lower()
        if not file_extension:
            # Try to guess extension from content type
            extension = mimetypes.guess_extension(file.content_type)
            if extension:
                file_extension = extension
            else:
                file_extension = ".bin"
        
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Create type-specific directory
        type_dir = UPLOAD_DIR / file_type
        type_dir.mkdir(exist_ok=True)
        
        file_path = type_dir / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            
            # Check actual file size
            if len(content) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail=f"Fichier trop volumineux. Taille maximum: {MAX_FILE_SIZE // (1024*1024)}MB"
                )
            
            buffer.write(content)
        
        # Generate URL (relative path from uploads)
        file_url = f"/uploads/{file_type}/{unique_filename}"
        
        logger.info(f"File saved: {file_path}")
        return str(file_path), file_url
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error saving file: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la sauvegarde du fichier")

@router.post("/file")
async def upload_file(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    event_type: Optional[str] = Form(None),
    is_featured: bool = Form(False),
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Upload a file (image or video)"""
    try:
        # Validate file
        validate_file(file)
        
        # Get file type
        file_type = get_file_type(file.content_type)
        
        # Save file
        file_path, file_url = await save_file(file, file_type)
        
        # Create gallery item
        from models.admin_models import GalleryItem
        
        gallery_item = GalleryItem(
            title=title,
            description=description,
            file_type=file_type,
            file_url=file_url,
            event_type=event_type,
            is_featured=is_featured,
            created_by=current_user.id
        )
        
        # Save to database
        await db.gallery_items.insert_one(gallery_item.dict())
        
        logger.info(f"Gallery item created by {current_user.username}: {gallery_item.id}")
        
        return {
            "id": gallery_item.id,
            "title": gallery_item.title,
            "file_type": gallery_item.file_type,
            "file_url": gallery_item.file_url,
            "message": "Fichier uploadé avec succès"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'upload")

@router.get("/info")
async def get_upload_info():
    """Get upload constraints and allowed types"""
    return {
        "max_file_size": MAX_FILE_SIZE,
        "max_file_size_mb": MAX_FILE_SIZE // (1024 * 1024),
        "allowed_image_types": list(ALLOWED_IMAGE_TYPES),
        "allowed_video_types": list(ALLOWED_VIDEO_TYPES),
        "upload_dir": str(UPLOAD_DIR)
    }