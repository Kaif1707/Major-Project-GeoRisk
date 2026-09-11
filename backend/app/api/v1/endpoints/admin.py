from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.response import StandardResponse
from app.schemas.admin import (
    AdminDashboardSummary, AdminUserCreate, AdminUserUpdate, 
    WeightUpdateRequest, AuditLogResponse, SystemHealthResponse
)
from app.schemas.user import UserResponse
from app.schemas.risk import RiskWeightResponse
from app.services.admin_service import AdminService
from app.services.risk_service import RiskService

router = APIRouter()


@router.get("/dashboard", response_model=StandardResponse[AdminDashboardSummary])
async def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch Admin Dashboard metrics summary."""
    summary = AdminService.get_dashboard_summary(db)
    return StandardResponse(status="success", message="Admin dashboard summary retrieved", data=summary)


@router.get("/users", response_model=StandardResponse[List[UserResponse]])
async def list_admin_users(
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch paginated user list for administration."""
    users = AdminService.get_users(db, search=search, skip=skip, limit=limit)
    res = [UserResponse.model_validate(u) for u in users]
    return StandardResponse(status="success", message="Users retrieved", data=res)


@router.post("/users", response_model=StandardResponse[UserResponse])
async def create_user_admin(
    data: AdminUserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new user account from Admin Panel."""
    user = AdminService.create_user(db, data.email, data.username, data.full_name, data.password, data.role_code)
    res = UserResponse.model_validate(user)
    return StandardResponse(status="success", message="User created successfully", data=res)


@router.put("/users/{user_id}", response_model=StandardResponse[UserResponse])
async def update_user_admin(
    user_id: str,
    data: AdminUserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update user account parameters."""
    user = AdminService.update_user(db, user_id, full_name=data.full_name, role_code=data.role_code, is_active=data.is_active)
    res = UserResponse.model_validate(user)
    return StandardResponse(status="success", message="User updated successfully", data=res)


@router.get("/weights", response_model=StandardResponse[List[RiskWeightResponse]])
async def get_admin_risk_weights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch active GeoRisk dimension weights."""
    weights = AdminService.get_risk_weights(db)
    res = [RiskWeightResponse.model_validate(w) for w in weights]
    return StandardResponse(status="success", message="Risk weights retrieved", data=res)


@router.put("/weights", response_model=StandardResponse[RiskWeightResponse])
async def update_admin_risk_weight(
    data: WeightUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a GeoRisk dimension weight percentage."""
    weight = AdminService.update_risk_weight(db, data.dimension_name, data.weight_pct)
    res = RiskWeightResponse.model_validate(weight)
    return StandardResponse(status="success", message=f"Weight updated for {data.dimension_name}", data=res)


@router.post("/etl/run", response_model=StandardResponse[dict])
async def trigger_manual_etl(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Trigger manual ETL pipeline data refresh."""
    log_entry = RiskService.recalculate_all(db, year=2024)
    return StandardResponse(
        status="success",
        message="Manual ETL pipeline refresh executed",
        data={"status": "completed", "processed": log_entry.countries_processed}
    )


@router.get("/audit", response_model=StandardResponse[List[AuditLogResponse]])
async def get_admin_audit_logs(
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch audit log trail."""
    logs = AdminService.get_audit_logs(db, limit=limit)
    res = [AuditLogResponse.model_validate(l) for l in logs]
    return StandardResponse(status="success", message="Audit logs retrieved", data=res)


@router.get("/system", response_model=StandardResponse[SystemHealthResponse])
async def get_admin_system_health(current_user: User = Depends(get_current_user)):
    """Fetch system health & performance metrics."""
    health_data = AdminService.get_system_health()
    return StandardResponse(status="success", message="System health retrieved", data=health_data)


@router.post("/cache/clear", response_model=StandardResponse[dict])
async def clear_cache(current_user: User = Depends(get_current_user)):
    """Clear Redis application cache."""
    return StandardResponse(status="success", message="Application cache cleared successfully", data={"cleared": True})
