from datetime import datetime, timezone
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.models.monitor import Monitor
from app.models.check import Check
from app.services.checker import perform_health_check
from app.services.incident import process_check_incident

scheduler = AsyncIOScheduler()


async def run_monitor_checks():
    """Background task to run health checks and process incidents."""
    async with AsyncSessionLocal() as db:
        query = select(Monitor).where(Monitor.is_active == True)
        result = await db.execute(query)
        monitors = result.scalars().all()

        for monitor in monitors:
            check_result = await perform_health_check(
                url=monitor.url,
                method=monitor.method,
                timeout_seconds=monitor.timeout_seconds
            )

            # Update monitor status
            monitor.status = "up" if check_result.is_up else "down"
            monitor.last_checked_at = datetime.now(timezone.utc)
            db.add(monitor)

            # Record check history entry
            check_record = Check(
                monitor_id=monitor.id,
                status_code=check_result.status_code,
                response_time_ms=check_result.response_time_ms,
                is_up=check_result.is_up,
                error_message=check_result.error_message
            )
            db.add(check_record)

            # Evaluate incident creation or resolution
            await process_check_incident(db, monitor.id, check_result)

        await db.commit()


def start_scheduler():
    if not scheduler.running:
        scheduler.add_job(
            run_monitor_checks,
            "interval",
            seconds=30,
            id="recurring_monitor_checker",
            replace_existing=True
        )
        scheduler.start()


def shutdown_scheduler():
    if scheduler.running:
        scheduler.shutdown()