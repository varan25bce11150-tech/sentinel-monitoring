from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class CheckCreate(BaseModel):
    monitor_id: int
    status_code: Optional[int] = None
    response_time_ms: Optional[float] = None
    is_up: bool
    error_message: Optional[str] = None


class CheckResponse(BaseModel):
    id: int
    monitor_id: int
    status_code: Optional[int] = None
    response_time_ms: Optional[float] = None
    is_up: bool
    error_message: Optional[str] = None
    checked_at: datetime

    class Config:
        from_attributes = True


class HealthCheckResult(BaseModel):
    is_up: bool
    status_code: Optional[int] = None
    response_time_ms: Optional[float] = None
    error_message: Optional[str] = None