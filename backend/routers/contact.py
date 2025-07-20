from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from models.contact_models import ContactRequest, ContactRequestCreate, Booking, BookingCreate
import logging
import os

router = APIRouter(prefix="/api", tags=["contact"])
logger = logging.getLogger(__name__)

async def get_database() -> AsyncIOMotorDatabase:
    from motor.motor_asyncio import AsyncIOMotorClient
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    return client[os.environ['DB_NAME']]

@router.post("/contact-request", response_model=ContactRequest)
async def create_contact_request(
    contact_data: ContactRequestCreate, 
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new contact request"""
    try:
        # Create contact request object
        contact_request = ContactRequest(**contact_data.dict())
        
        # Insert into database
        result = await db.contact_requests.insert_one(contact_request.dict())
        
        if result.inserted_id:
            logger.info(f"New contact request created: {contact_request.id}")
            return contact_request
        else:
            raise HTTPException(status_code=500, detail="Failed to create contact request")
            
    except Exception as e:
        logger.error(f"Error creating contact request: {e}")
        raise HTTPException(status_code=500, detail="Error creating contact request")

@router.get("/contact-requests", response_model=List[ContactRequest])
async def get_contact_requests(
    status: str = None, 
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get contact requests (admin endpoint)"""
    try:
        filter_query = {}
        if status:
            filter_query["status"] = status
            
        cursor = db.contact_requests.find(filter_query).sort("created_at", -1)
        requests = await cursor.to_list(length=100)
        
        return [ContactRequest(**req) for req in requests]
        
    except Exception as e:
        logger.error(f"Error fetching contact requests: {e}")
        raise HTTPException(status_code=500, detail="Error fetching contact requests")

@router.post("/booking", response_model=Booking)
async def create_booking(
    booking_data: BookingCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new booking"""
    try:
        # Verify contact request exists
        contact_request = await db.contact_requests.find_one({"id": booking_data.contact_request_id})
        if not contact_request:
            raise HTTPException(status_code=404, detail="Contact request not found")
        
        # Create booking
        booking = Booking(**booking_data.dict())
        
        # Insert into database
        result = await db.bookings.insert_one(booking.dict())
        
        if result.inserted_id:
            logger.info(f"New booking created: {booking.id}")
            return booking
        else:
            raise HTTPException(status_code=500, detail="Failed to create booking")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating booking: {e}")
        raise HTTPException(status_code=500, detail="Error creating booking")

@router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get booking details"""
    try:
        booking = await db.bookings.find_one({"id": booking_id})
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
            
        return Booking(**booking)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching booking {booking_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching booking")