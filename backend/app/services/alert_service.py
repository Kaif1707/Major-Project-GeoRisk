from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.alert import AlertRule, AlertNotification
from app.models.country import Country
from app.models.risk import RiskScore
from app.services.country_service import CountryService


class AlertService:
    @staticmethod
    def get_user_alert_rules(db: Session, user_id: str) -> List[AlertRule]:
        """Fetch alert rules for a user."""
        return db.query(AlertRule).filter_by(user_id=user_id).order_by(AlertRule.created_at.desc()).all()

    @staticmethod
    def create_alert_rule(
        db: Session,
        user_id: str,
        threshold_value: float,
        country_code: Optional[str] = None,
        metric_code: str = "overall_georisk",
        condition: str = "gt",
        alert_type: str = "in_app"
    ) -> AlertRule:
        """Create a new threshold alert rule."""
        country_id = None
        if country_code:
            c = CountryService.get_country_by_id_or_code(db, country_code)
            if c:
                country_id = c.id

        rule = AlertRule(
            user_id=user_id,
            country_id=country_id,
            metric_code=metric_code,
            condition=condition,
            threshold_value=threshold_value,
            alert_type=alert_type
        )
        db.add(rule)
        db.commit()
        db.refresh(rule)
        return rule

    @staticmethod
    def get_user_notifications(db: Session, user_id: str, unread_only: bool = False) -> List[AlertNotification]:
        """Fetch alert notifications for a user."""
        query = db.query(AlertNotification).filter_by(user_id=user_id)
        if unread_only:
            query = query.filter_by(is_read=False)
        return query.order_by(AlertNotification.triggered_at.desc()).all()
