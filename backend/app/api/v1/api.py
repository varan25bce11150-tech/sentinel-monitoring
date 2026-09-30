from fastapi import APIRouter
from app.api.v1.endpoints import monitors, checks, incidents

api_router = APIRouter()
api_router.include_router(monitors.router, prefix="/monitors", tags=["monitors"])
api_router.include_router(checks.router, prefix="", tags=["checks"])
api_router.include_router(incidents.router, prefix="", tags=["incidents"])