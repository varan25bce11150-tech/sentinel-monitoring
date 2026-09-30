from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.monitor import Monitor
from app.schemas.monitor import MonitorCreate, MonitorUpdate, MonitorResponse

router = APIRouter()


@router.get("/", response_model=List[MonitorResponse])
async def list_monitors(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve all monitors."""
    query = select(Monitor).offset(skip).limit(limit)
    result = await db.execute(query)
    monitors = result.scalars().all()
    return monitors


@router.post("/", response_model=MonitorResponse, status_code=status.HTTP_201_CREATED)
async def create_monitor(
    monitor_in: MonitorCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new monitor."""
    monitor = Monitor(**monitor_in.model_dump())
    db.add(monitor)
    await db.commit()
    await db.refresh(monitor)
    return monitor


@router.get("/{monitor_id}", response_model=MonitorResponse)
async def get_monitor(
    monitor_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get monitor details by ID."""
    query = select(Monitor).where(Monitor.id == monitor_id)
    result = await db.execute(query)
    monitor = result.scalar_one_or_none()
    if not monitor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Monitor not found"
        )
    return monitor


@router.put("/{monitor_id}", response_model=MonitorResponse)
async def update_monitor(
    monitor_id: int,
    monitor_in: MonitorUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update an existing monitor."""
    query = select(Monitor).where(Monitor.id == monitor_id)
    result = await db.execute(query)
    monitor = result.scalar_one_or_none()
    if not monitor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Monitor not found"
        )

    update_data = monitor_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(monitor, field, value)

    db.add(monitor)
    await db.commit()
    await db.refresh(monitor)
    return monitor


@router.delete("/{monitor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_monitor(
    monitor_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a monitor."""
    query = select(Monitor).where(Monitor.id == monitor_id)
    result = await db.execute(query)
    monitor = result.scalar_one_or_none()
    if not monitor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Monitor not found"
        )

    await db.delete(monitor)
    await db.commit()
    return None