from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class EventPackage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # "mariage", "anniversaire", "bapteme"
    price: int
    features: List[str]
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class EventPackageCreate(BaseModel):
    name: str
    type: str
    price: int
    features: List[str]
    is_active: bool = True

class EventPackageUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    price: Optional[int] = None
    features: Optional[List[str]] = None
    is_active: Optional[bool] = None

class PhotoboothPackage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: int
    features: List[str]
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PhotoboothPackageCreate(BaseModel):
    name: str
    price: int
    features: List[str]
    is_active: bool = True

class AdditionalService(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: Optional[int] = None
    unit: Optional[str] = None  # "pièce", "week-end"
    description: str
    custom: bool = False
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AdditionalServiceCreate(BaseModel):
    name: str
    price: Optional[int] = None
    unit: Optional[str] = None
    description: str
    custom: bool = False
    is_active: bool = True