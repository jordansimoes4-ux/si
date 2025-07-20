from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from models.contact_models import Testimonial, TestimonialCreate
import logging
import os

router = APIRouter(prefix="/api", tags=["testimonials"])
logger = logging.getLogger(__name__)

async def get_database() -> AsyncIOMotorDatabase:
    from motor.motor_asyncio import AsyncIOMotorClient
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    return client[os.environ['DB_NAME']]

@router.get("/testimonials", response_model=List[Testimonial])
async def get_approved_testimonials(db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get all approved testimonials"""
    try:
        cursor = db.testimonials.find({"is_approved": True}).sort("created_at", -1)
        testimonials = await cursor.to_list(length=100)
        
        return [Testimonial(**testimonial) for testimonial in testimonials]
        
    except Exception as e:
        logger.error(f"Error fetching testimonials: {e}")
        raise HTTPException(status_code=500, detail="Error fetching testimonials")

@router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(
    testimonial_data: TestimonialCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new testimonial (requires admin approval)"""
    try:
        # Create testimonial (not approved by default)
        testimonial = Testimonial(**testimonial_data.dict(), is_approved=False)
        
        # Insert into database
        result = await db.testimonials.insert_one(testimonial.dict())
        
        if result.inserted_id:
            logger.info(f"New testimonial created: {testimonial.id} (pending approval)")
            return testimonial
        else:
            raise HTTPException(status_code=500, detail="Failed to create testimonial")
            
    except Exception as e:
        logger.error(f"Error creating testimonial: {e}")
        raise HTTPException(status_code=500, detail="Error creating testimonial")