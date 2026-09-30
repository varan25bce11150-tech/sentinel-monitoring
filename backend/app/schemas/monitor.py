from datetime import datetime
from typing import Optional
from pydantic import BaseModel, HttpUrl, Field


class MonitorBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, example="My Website API")
    url: str = Field(..., example="https://api.github.com")
    method: str = Field(default="GET", pattern="^(GET|POST|PUT|DELETE|HEAD|PATCH)$")
    interval_seconds: int = Field(default=60, ge=10, le=86400)
    timeout_seconds: int = Field(default=10, ge=1, le=120)
    is_active: bool = True


class MonitorCreate(MonitorBase):
    pass


class MonitorUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    url: Optional[str] = None
    method: Optional[str] = Field(None, pattern="^(GET|POST|PUT|DELETE|HEAD|PATCH)$")
    interval_seconds: Optional[int] = Field(None, ge=10, le=86400)
    timeout_seconds: Optional[int] = Field(None, ge=1, le=120)
    is_active: Optional[bool] = None


class MonitorResponse(MonitorBase):
    id: int
    user_id: Optional[int] = None
    status: str
    last_checked_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True