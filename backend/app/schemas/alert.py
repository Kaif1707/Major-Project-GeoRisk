from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.country import CountryResponse


class AlertRuleResponse(BaseModel):
    id: str
    user_id: str
    country_id: Optional[str] = None
    metric_code: str
    condition: str
    threshold_value: float
    alert_type: str
    is_active: bool
    created_at: datetime
    country: Optional[CountryResponse] = None

    class Config:
        from_attributes = True


class AlertRuleCreate(BaseModel):
    country_code: Optional[str] = None
    metric_code: str = Field(default="overall_georisk")
    condition: str = Field(default="gt") # gt, lt, gte, lte, eq
    threshold_value: float = Field(...)
    alert_type: str = Field(default="in_app")


class AlertNotificationResponse(BaseModel):
    id: str
    user_id: str
    alert_rule_id: Optional[str] = None
    title: str
    message: str
    is_read: bool
    triggered_at: datetime

    class Config:
        from_attributes = True
