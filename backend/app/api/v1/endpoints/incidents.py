from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.core.database import get_db
from app.models.incident import Incident
from app.schemas.incident import IncidentResponse

router = APIRouter()


@router.get("/incidents", response_model=List[IncidentResponse])
async def list_incidents(
    monitor_id: Optional[int] = None,
    is_resolved: Optional[bool] = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """List incidents across all monitors with optional filtering."""
    query = select(Incident)
    if monitor_id is not None:
        query = query.where(Incident.monitor_id == monitor_id)
    if is_resolved is not None:
        query = query.where(Incident.is_resolved == is_resolved)

    query = query.order_by(desc(Incident.started_at)).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/monitors/{monitor_id}/incidents", response_model=List[IncidentResponse])
async def list_monitor_incidents(
    monitor_id: int,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve incident log history for a specific monitor."""
    query = (
        select(Incident)
        .where(Incident.monitor_id == monitor_id)
        .order_by(desc(Incident.started_at))
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/incidents/{incident_id}/resolve", response_model=IncidentResponse)
async def resolve_incident(
    incident_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Manually resolve an incident."""
    query = select(Incident).where(Incident.id == incident_id)
    result = await db.execute(query)
    incident = result.scalar_one_or_none()

    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found"
        )

    if incident.is_resolved:
        return incident

    incident.is_resolved = True
    incident.resolved_at = datetime.now(timezone.utc)
    db.add(incident)
    await db.commit()
    await db.refresh(incident)
    return incident