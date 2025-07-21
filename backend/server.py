from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from contextlib import asynccontextmanager

# Import routers
from routers import packages, photobooth, contact, testimonials, auth, admin

# Import services
from services.data_seeder import seed_initial_data
from services.admin_seeder import seed_admin_user

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application startup and shutdown"""
    # Startup
    logging.info("Starting up JSEVENT backend...")
    
    # Seed initial data
    try:
        await seed_initial_data(db)
        await seed_admin_user(db)
        logging.info("Database initialization completed")
    except Exception as e:
        logging.error(f"Error seeding database: {e}")
    
    yield
    
    # Shutdown
    logging.info("Shutting down JSEVENT backend...")
    client.close()

# Create the main app with lifespan
app = FastAPI(title="JSEVENT API", version="1.0.0", lifespan=lifespan)

# Create a router with the /api prefix for existing endpoints
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"message": "JSEVENT API is running", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        await client.admin.command('ismaster')
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}

# Include the main API router
app.include_router(api_router)

# Include all feature routers
app.include_router(packages.router)
app.include_router(photobooth.router)
app.include_router(contact.router)
app.include_router(testimonials.router)
app.include_router(auth.router)
app.include_router(admin.router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)