from typing import Optional
from sqlalchemy.orm import Session
from fastapi import Request
from app.models.user import AuditLog


def log_audit_event(
    db: Session,
    action: str,
    module: str,
    user_id: Optional[str] = None,
    details: Optional[str] = None,
    request: Optional[Request] = None
):
    """Utility helper to persist structured audit events."""
    ip_address = None
    user_agent = None

    if request:
        ip_address = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")

    audit_entry = AuditLog(
        user_id=user_id,
        action=action,
        module=module,
        ip_address=ip_address,
        user_agent=user_agent,
        details=details
    )
    db.add(audit_entry)
    db.commit()
    return audit_entry
