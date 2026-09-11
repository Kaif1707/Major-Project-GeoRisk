from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.user import UserResponse
from app.schemas.risk import RiskWeightResponse


class AdminDashboardSummary(BaseModel):
    system_status: str
    total_users: int
    active_sessions: int
    countries_loaded: int
    indicators_loaded: int
    latest_etl_status: str
    latest_georisk_calc: datetime
    db_status: str
    cache_status: str
    api_health: str


class AdminUserCreate(BaseModel):
    email: str
    username: str
    full_name: str
    password: str
    role_code: str = "Analyst"


class AdminUserUpdate(BaseModel):
    full_name: Optional[str] = None
    role_code: Optional[str] = None
    is_active: Optional[bool] = None


class WeightUpdateRequest(BaseModel):
    dimension_name: str
    weight_pct: float = Field(..., ge=0, le=100)


class AuditLogResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    action: str
    module: str
    status: str
    ip_address: Optional[str] = None
    details: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True


class SystemHealthResponse(BaseModel):
    cpu_usage_pct: float
    memory_usage_pct: float
    db_connections_active: int
    redis_status: str
    uptime_seconds: int
    api_latency_ms: float
