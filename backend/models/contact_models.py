from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime, date
import uuid

class ContactRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    event_type: str
    event_date: Optional[str] = None
    guests: Optional[int] = None
    message: Optional[str] = None
    status: str = "new"  # "new", "contacted", "quoted", "closed"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ContactRequestCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    event_type: str
    event_date: Optional[date] = None
    guests: Optional[int] = None
    message: Optional[str] = None

class ContactRequestUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    contact_request_id: str
    package_id: str
    package_type: str  # "event", "photobooth"
    total_price: int
    status: str = "pending"  # "pending", "confirmed", "cancelled"
    event_date: date
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BookingCreate(BaseModel):
    contact_request_id: str
    package_id: str
    package_type: str
    total_price: int
    event_date: date
    notes: Optional[str] = None

class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    event: str
    text: str
    rating: int = Field(ge=1, le=5)
    is_approved: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TestimonialCreate(BaseModel):
    name: str
    event: str
    text: str
    rating: int = Field(ge=1, le=5)

class TestimonialUpdate(BaseModel):
    is_approved: Optional[bool] = None