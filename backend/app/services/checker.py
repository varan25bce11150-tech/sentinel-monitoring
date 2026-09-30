import time
import httpx
from typing import Optional
from app.schemas.check import HealthCheckResult


async def perform_health_check(
    url: str,
    method: str = "GET",
    timeout_seconds: int = 10
) -> HealthCheckResult:
    """
    Executes an asynchronous HTTP request against the given URL and measures response time.
    """
    start_time = time.perf_counter()
    headers = {"User-Agent": "Sentinel-Monitoring/1.0"}

    async with httpx.AsyncClient(follow_redirects=True, timeout=float(timeout_seconds)) as client:
        try:
            response = await client.request(
                method=method.upper(),
                url=url,
                headers=headers
            )
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
            
            # Consider 2xx and 3xx as healthy status codes
            is_up = 200 <= response.status_code < 400

            return HealthCheckResult(
                is_up=is_up,
                status_code=response.status_code,
                response_time_ms=elapsed_ms,
                error_message=None if is_up else f"HTTP Status {response.status_code}"
            )

        except httpx.TimeoutException:
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return HealthCheckResult(
                is_up=False,
                status_code=None,
                response_time_ms=elapsed_ms,
                error_message=f"Request timed out after {timeout_seconds}s"
            )

        except httpx.RequestError as exc:
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return HealthCheckResult(
                is_up=False,
                status_code=None,
                response_time_ms=elapsed_ms,
                error_message=f"Network error: {str(exc)}"
            )

        except Exception as exc:
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return HealthCheckResult(
                is_up=False,
                status_code=None,
                response_time_ms=elapsed_ms,
                error_message=f"Unexpected error: {str(exc)}"
            )