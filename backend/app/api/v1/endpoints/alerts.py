from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.response import StandardResponse
from app.schemas.alert import AlertRuleResponse, AlertRuleCreate, AlertNotificationResponse
from app.services.alert_service import AlertService

router = APIRouter()


@router.get("/rules", response_model=StandardResponse[List[AlertRuleResponse]])
async def list_alert_rules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch active alert rules for current user."""
    rules = AlertService.get_user_alert_rules(db, current_user.id)
    res = [AlertRuleResponse.model_validate(r) for r in rules]
    return StandardResponse(status="success", message="Alert rules retrieved", data=res)


@router.post("/rules", response_model=StandardResponse[AlertRuleResponse])
async def create_alert_rule(
    data: AlertRuleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new threshold alert rule."""
    rule = AlertService.create_alert_rule(
        db, current_user.id, data.threshold_value,
        country_code=data.country_code, metric_code=data.metric_code,
        condition=data.condition, alert_type=data.alert_type
    )
    res = AlertRuleResponse.model_validate(rule)
    return StandardResponse(status="success", message="Alert rule created", data=res)


@router.get("/notifications", response_model=StandardResponse[List[AlertNotificationResponse]])
async def list_notifications(
    unread_only: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch in-app alert notifications for current user."""
    notifications = AlertService.get_user_notifications(db, current_user.id, unread_only=unread_only)
    res = [AlertNotificationResponse.model_validate(n) for n in notifications]
    return StandardResponse(status="success", message="Alert notifications retrieved", data=res)
