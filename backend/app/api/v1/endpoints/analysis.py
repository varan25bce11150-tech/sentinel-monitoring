from fastapi import APIRouter, Query
from typing import List, Dict, Any
from pydantic import BaseModel

router = APIRouter()

class AnalysisSummaryResponse(BaseModel):
    timeframe: str
    uptime_percentage: float
    avg_latency_ms: int
    total_checks: int
    incident_count: int
    error_rate_percent: float

class LatencyPoint(BaseModel):
    timestamp: str
    latency_ms: int
    cpu_load: int
    memory_load: int

class LatencyTrendResponse(BaseModel):
    data: List[LatencyPoint]

class IncidentResponse(BaseModel):
    id: str
    service: str
    severity: str
    message: str
    timestamp: str
    duration: str
    status: str

@router.get("/summary", response_model=AnalysisSummaryResponse)
async def get_analysis_summary(timeframe: str = Query("24h")):
    return {
        "timeframe": timeframe,
        "uptime_percentage": 99.94,
        "avg_latency_ms": 142,
        "total_checks": 142800,
        "incident_count": 2,
        "error_rate_percent": 0.06
    }

@router.get("/latency-trends", response_model=LatencyTrendResponse)
async def get_latency_trends(timeframe: str = Query("24h")):
    return {
        "data": [
            {"timestamp": "00:00", "latency_ms": 120, "cpu_load": 32, "memory_load": 45},
            {"timestamp": "04:00", "latency_ms": 115, "cpu_load": 28, "memory_load": 44},
            {"timestamp": "08:00", "latency_ms": 210, "cpu_load": 65, "memory_load": 58},
            {"timestamp": "12:00", "latency_ms": 185, "cpu_load": 55, "memory_load": 52},
            {"timestamp": "16:00", "latency_ms": 140, "cpu_load": 40, "memory_load": 48},
            {"timestamp": "20:00", "latency_ms": 125, "cpu_load": 35, "memory_load": 46}
        ]
    }

@router.get("/incidents", response_model=List[IncidentResponse])
async def get_analysis_incidents():
    return [
        {
            "id": "INC-1042",
            "service": "Database Cluster Primary",
            "severity": "CRITICAL",
            "message": "Connection pool saturation detected (>95% active connections)",
            "timestamp": "2026-10-02 08:14:22",
            "duration": "4m 12s",
            "status": "RESOLVED"
        },
        {
            "id": "INC-1041",
            "service": "Payment Webhook Gateway",
            "severity": "WARNING",
            "message": "Elevated HTTP 504 Gateway Timeout responses (>5%)",
            "timestamp": "2026-10-01 19:30:10",
            "duration": "12m 45s",
            "status": "RESOLVED"
        }
    ]