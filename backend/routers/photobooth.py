from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from models.event_models import PhotoboothPackage, AdditionalService
import logging
import os

router = APIRouter(prefix="/api", tags=["photobooth"])
logger = logging.getLogger(__name__)

async def get_database() -> AsyncIOMotorDatabase:
    from motor.motor_asyncio import AsyncIOMotorClient
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    return client[os.environ['DB_NAME']]

@router.get("/photobooth-packages", response_model=List[PhotoboothPackage])
async def get_photobooth_packages(db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get all active photobooth packages"""
    try:
        cursor = db.photobooth_packages.find({"is_active": True})
        packages = await cursor.to_list(length=100)
        
        return [PhotoboothPackage(**pkg) for pkg in packages]
    except Exception as e:
        logger.error(f"Error fetching photobooth packages: {e}")
        raise HTTPException(status_code=500, detail="Error fetching photobooth packages")

@router.get("/additional-services", response_model=List[AdditionalService])
async def get_additional_services(db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get all active additional services"""
    try:
        cursor = db.additional_services.find({"is_active": True})
        services = await cursor.to_list(length=100)
        
        return [AdditionalService(**service) for service in services]
    except Exception as e:
        logger.error(f"Error fetching additional services: {e}")
        raise HTTPException(status_code=500, detail="Error fetching additional services")