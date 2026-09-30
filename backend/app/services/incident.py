from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.models.incident import Incident
from app.schemas.check import HealthCheckResult


async def process_check_incident(
    db: AsyncSession,
    monitor_id: int,
    check_result: HealthCheckResult
) -> Optional[Incident]:
    """
    Evaluates check results to open a new incident if down, or resolve an existing open incident if up.
    """
    # Query for an active (unresolved) incident for this monitor
    query = (
        select(Incident)
        .where(
            and_(
                Incident.monitor_id == monitor_id,
                Incident.is_resolved == False
            )
        )
    )
    result = await db.execute(query)
    open_incident = result.scalar_one_or_none()

    now = datetime.now(timezone.utc)

    if not check_result.is_up:
        # Service is DOWN
        if not open_incident:
            # Open a new incident
            new_incident = Incident(
                monitor_id=monitor_id,
                started_at=now,
                cause=check_result.error_message or "Health check failed",
                is_resolved=False
            )
            db.add(new_incident)
            return new_incident
        return open_incident
    else:
        # Service is UP
        if open_incident:
            # Resolve existing open incident
            open_incident.is_resolved = True
            open_incident.resolved_at = now
            db.add(open_incident)
            return open_incident
        return None