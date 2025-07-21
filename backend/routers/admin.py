from fastapi import APIRouter, HTTPException, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from models.admin_models import AdminUser, DashboardStats, GalleryItem, GalleryItemCreate, GalleryItemUpdate
from models.contact_models import ContactRequest, ContactRequestUpdate, Testimonial, TestimonialUpdate
from routers.auth import get_current_user
from datetime import datetime
import logging
import os

router = APIRouter(prefix="/api/admin", tags=["admin"])
logger = logging.getLogger(__name__)

async def get_database() -> AsyncIOMotorDatabase:
    from motor.motor_asyncio import AsyncIOMotorClient
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    return client[os.environ['DB_NAME']]

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get dashboard statistics"""
    try:
        # Get counts
        total_contact_requests = await db.contact_requests.count_documents({})
        pending_contact_requests = await db.contact_requests.count_documents({"status": "new"})
        total_testimonials = await db.testimonials.count_documents({})
        pending_testimonials = await db.testimonials.count_documents({"is_approved": False})
        total_gallery_items = await db.gallery_items.count_documents({"is_active": True})
        total_bookings = await db.bookings.count_documents({})
        
        # Get recent requests
        recent_cursor = db.contact_requests.find({}).sort("created_at", -1).limit(5)
        recent_requests_raw = await recent_cursor.to_list(5)
        recent_requests = []
        
        for req in recent_requests_raw:
            recent_requests.append({
                "id": req["id"],
                "name": req["name"],
                "event_type": req["event_type"],
                "status": req["status"],
                "created_at": req["created_at"].isoformat() if req.get("created_at") else None
            })
        
        return DashboardStats(
            total_contact_requests=total_contact_requests,
            pending_contact_requests=pending_contact_requests,
            total_testimonials=total_testimonials,
            pending_testimonials=pending_testimonials,
            total_gallery_items=total_gallery_items,
            total_bookings=total_bookings,
            recent_requests=recent_requests
        )
        
    except Exception as e:
        logger.error(f"Dashboard stats error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get dashboard stats")

# Contact Requests Management
@router.get("/contact-requests", response_model=List[ContactRequest])
async def get_all_contact_requests(
    status: Optional[str] = None,
    limit: int = 50,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all contact requests with optional filtering"""
    try:
        filter_query = {}
        if status:
            filter_query["status"] = status
            
        cursor = db.contact_requests.find(filter_query).sort("created_at", -1).limit(limit)
        requests = await cursor.to_list(limit)
        
        return [ContactRequest(**req) for req in requests]
        
    except Exception as e:
        logger.error(f"Error fetching contact requests: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch contact requests")

@router.put("/contact-requests/{request_id}", response_model=ContactRequest)
async def update_contact_request(
    request_id: str,
    update_data: ContactRequestUpdate,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update contact request status"""
    try:
        # Find the request
        existing_request = await db.contact_requests.find_one({"id": request_id})
        if not existing_request:
            raise HTTPException(status_code=404, detail="Contact request not found")
        
        # Update fields
        update_fields = {k: v for k, v in update_data.dict().items() if v is not None}
        update_fields["updated_at"] = datetime.utcnow()
        
        # Update in database
        await db.contact_requests.update_one(
            {"id": request_id},
            {"$set": update_fields}
        )
        
        # Get updated request
        updated_request = await db.contact_requests.find_one({"id": request_id})
        
        logger.info(f"Contact request {request_id} updated by {current_user.username}")
        
        return ContactRequest(**updated_request)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating contact request: {e}")
        raise HTTPException(status_code=500, detail="Failed to update contact request")

# Testimonials Management
@router.get("/testimonials", response_model=List[Testimonial])
async def get_all_testimonials(
    approved: Optional[bool] = None,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all testimonials with optional filtering"""
    try:
        filter_query = {}
        if approved is not None:
            filter_query["is_approved"] = approved
            
        cursor = db.testimonials.find(filter_query).sort("created_at", -1)
        testimonials = await cursor.to_list(100)
        
        return [Testimonial(**testimonial) for testimonial in testimonials]
        
    except Exception as e:
        logger.error(f"Error fetching testimonials: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch testimonials")

@router.put("/testimonials/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(
    testimonial_id: str,
    update_data: TestimonialUpdate,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update testimonial (approve/reject)"""
    try:
        # Find the testimonial
        existing_testimonial = await db.testimonials.find_one({"id": testimonial_id})
        if not existing_testimonial:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        # Update fields
        update_fields = {k: v for k, v in update_data.dict().items() if v is not None}
        update_fields["updated_at"] = datetime.utcnow()
        
        # Update in database
        await db.testimonials.update_one(
            {"id": testimonial_id},
            {"$set": update_fields}
        )
        
        # Get updated testimonial
        updated_testimonial = await db.testimonials.find_one({"id": testimonial_id})
        
        logger.info(f"Testimonial {testimonial_id} updated by {current_user.username}")
        
        return Testimonial(**updated_testimonial)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating testimonial: {e}")
        raise HTTPException(status_code=500, detail="Failed to update testimonial")

# Gallery Management
@router.get("/gallery", response_model=List[GalleryItem])
async def get_gallery_items(
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all gallery items"""
    try:
        cursor = db.gallery_items.find({}).sort("created_at", -1)
        items = await cursor.to_list(100)
        
        return [GalleryItem(**item) for item in items]
        
    except Exception as e:
        logger.error(f"Error fetching gallery items: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch gallery items")

@router.post("/gallery", response_model=GalleryItem)
async def create_gallery_item(
    gallery_data: GalleryItemCreate,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create new gallery item"""
    try:
        gallery_item = GalleryItem(
            **gallery_data.dict(),
            created_by=current_user.id
        )
        
        await db.gallery_items.insert_one(gallery_item.dict())
        
        logger.info(f"Gallery item created by {current_user.username}")
        
        return gallery_item
        
    except Exception as e:
        logger.error(f"Error creating gallery item: {e}")
        raise HTTPException(status_code=500, detail="Failed to create gallery item")

@router.put("/gallery/{item_id}", response_model=GalleryItem)
async def update_gallery_item(
    item_id: str,
    update_data: GalleryItemUpdate,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update gallery item"""
    try:
        # Find the item
        existing_item = await db.gallery_items.find_one({"id": item_id})
        if not existing_item:
            raise HTTPException(status_code=404, detail="Gallery item not found")
        
        # Update fields
        update_fields = {k: v for k, v in update_data.dict().items() if v is not None}
        update_fields["updated_at"] = datetime.utcnow()
        
        # Update in database
        await db.gallery_items.update_one(
            {"id": item_id},
            {"$set": update_fields}
        )
        
        # Get updated item
        updated_item = await db.gallery_items.find_one({"id": item_id})
        
        logger.info(f"Gallery item {item_id} updated by {current_user.username}")
        
        return GalleryItem(**updated_item)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating gallery item: {e}")
        raise HTTPException(status_code=500, detail="Failed to update gallery item")

@router.delete("/gallery/{item_id}")
async def delete_gallery_item(
    item_id: str,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Delete gallery item"""
    try:
        result = await db.gallery_items.delete_one({"id": item_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Gallery item not found")
        
        logger.info(f"Gallery item {item_id} deleted by {current_user.username}")
        
        return {"message": "Gallery item deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting gallery item: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete gallery item")