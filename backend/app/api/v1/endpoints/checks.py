from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.core.database import get_db
from app.models.check import Check
from app.schemas.check import CheckResponse

router = APIRouter()


@router.get("/monitors/{monitor_id}/checks", response_model=List[CheckResponse])
async def get_monitor_check_history(
    monitor_id: int,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve historical check logs for a specific monitor, newest first."""
    query = (
        select(Check)
        .where(Check.monitor_id == monitor_id)
        .order_by(desc(Check.checked_at))
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(query)
    checks = result.scalars().all()
    return checks