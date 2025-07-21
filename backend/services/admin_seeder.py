from motor.motor_asyncio import AsyncIOMotorDatabase
from models.admin_models import AdminUser
from services.auth_service import get_password_hash
import logging

logger = logging.getLogger(__name__)

async def seed_admin_user(db: AsyncIOMotorDatabase):
    """Create default admin user if none exists"""
    
    # Check if admin users exist
    existing_admin = await db.admin_users.count_documents({})
    if existing_admin > 0:
        logger.info("Admin user already exists, skipping seed")
        return
    
    logger.info("Creating default admin user...")
    
    # Create default admin user
    default_admin = AdminUser(
        username="admin",
        email="admin@jsevent.fr",
        hashed_password=get_password_hash("jsevent2025"),  # Default password - CHANGE IN PRODUCTION
        is_superuser=True
    )
    
    await db.admin_users.insert_one(default_admin.dict())
    
    logger.info("Default admin user created:")
    logger.info("Username: admin")
    logger.info("Password: jsevent2025")
    logger.info("⚠️  IMPORTANT: Change the default password in production!")