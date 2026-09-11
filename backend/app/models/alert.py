import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Boolean, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


class AlertRule(Base):
    __tablename__ = "alert_rules"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    country_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("countries.id", ondelete="CASCADE"), nullable=True, index=True)
    
    metric_code: Mapped[str] = mapped_column(String(50), default="overall_georisk", nullable=False) # overall_georisk, gdp_growth, inflation, political_stability
    condition: Mapped[str] = mapped_column(String(20), default="gt", nullable=False)               # gt, lt, gte, lte, eq
    threshold_value: Mapped[float] = mapped_column(Float, nullable=False)
    alert_type: Mapped[str] = mapped_column(String(20), default="in_app", nullable=False)           # in_app, email, webhook
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship("User")
    country: Mapped[Optional["Country"]] = relationship("Country")


class AlertNotification(Base):
    __tablename__ = "alert_notifications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    alert_rule_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("alert_rules.id", ondelete="SET NULL"), nullable=True)
    
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    triggered_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    user: Mapped["User"] = relationship("User")
