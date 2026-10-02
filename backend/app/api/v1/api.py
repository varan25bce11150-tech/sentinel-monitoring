from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    monitors,
    checks,
    incidents,
    settings,
    analysis,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(monitors.router, prefix="/monitors", tags=["monitors"])
api_router.include_router(checks.router, prefix="/checks", tags=["checks"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(analysis.router, prefix="/analytics", tags=["analytics"])