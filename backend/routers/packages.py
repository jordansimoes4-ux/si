from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from models.event_models import EventPackage, PhotoboothPackage, AdditionalService
import logging
import os

router = APIRouter(prefix="/api/packages", tags=["packages"])
logger = logging.getLogger(__name__)

async def get_database() -> AsyncIOMotorDatabase:
    from motor.motor_asyncio import AsyncIOMotorClient
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    return client[os.environ['DB_NAME']]

@router.get("/{event_type}", response_model=List[EventPackage])
async def get_event_packages(event_type: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get all packages for a specific event type"""
    try:
        valid_types = ["mariage", "anniversaire", "bapteme"]
        if event_type not in valid_types:
            raise HTTPException(status_code=400, detail=f"Invalid event type. Must be one of: {valid_types}")
        
        cursor = db.event_packages.find({"type": event_type, "is_active": True})
        packages = await cursor.to_list(length=100)
        
        return [EventPackage(**pkg) for pkg in packages]
    except Exception as e:
        logger.error(f"Error fetching packages for type {event_type}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching packages")

@router.get("/", response_model=List[EventPackage])
async def get_all_event_packages(db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get all active event packages"""
    try:
        cursor = db.event_packages.find({"is_active": True})
        packages = await cursor.to_list(length=100)
        
        return [EventPackage(**pkg) for pkg in packages]
    except Exception as e:
        logger.error(f"Error fetching all packages: {e}")
        raise HTTPException(status_code=500, detail="Error fetching packages")