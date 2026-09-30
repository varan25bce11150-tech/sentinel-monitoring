from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class IncidentResponse(BaseModel):
    id: int
    monitor_id: int
    started_at: datetime
    resolved_at: Optional[datetime] = None
    cause: Optional[str] = None
    is_resolved: bool

    class Config:
        from_attributes = True


class IncidentUpdate(BaseModel):
    is_resolved: Optional[bool] = True
    cause: Optional[str] = None