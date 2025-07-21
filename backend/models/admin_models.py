from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid

class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AdminUserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    is_superuser: bool = False

class AdminUserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class GalleryItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    file_type: str  # "image" or "video"
    file_url: str
    thumbnail_url: Optional[str] = None
    event_type: Optional[str] = None  # "mariage", "anniversaire", "bapteme"
    is_featured: bool = False
    is_active: bool = True
    created_by: str  # admin user id
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class GalleryItemCreate(BaseModel):
    title: str
    description: Optional[str] = None
    file_type: str
    file_url: str
    thumbnail_url: Optional[str] = None
    event_type: Optional[str] = None
    is_featured: bool = False

class GalleryItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_type: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None

class DashboardStats(BaseModel):
    total_contact_requests: int
    pending_contact_requests: int
    total_testimonials: int
    pending_testimonials: int
    total_gallery_items: int
    total_bookings: int
    recent_requests: List[dict] = []