from fastapi import APIRouter
from app.api.v1.endpoints import monitors, checks

api_router = APIRouter()
api_router.include_router(monitors.router, prefix="/monitors", tags=["monitors"])
api_router.include_router(checks.router, prefix="", tags=["checks"])