from datetime import datetime, timedelta
from typing import Tuple, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Request
from app.models.user import User, Role, RefreshToken, Permission
from app.core.security import (
    verify_password, get_password_hash, create_access_token, 
    create_refresh_token, decode_token, hash_token
)
from app.core.config import settings
from app.schemas.auth import LoginRequest, RegisterRequest
from app.utils.audit import log_audit_event


class AuthService:
    @staticmethod
    def register_user(db: Session, request_data: RegisterRequest, req: Optional[Request] = None) -> User:
        """Register a new user account."""
        # Check duplicate email
        if db.query(User).filter(User.email == request_data.email).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email address is already registered")

        # Check duplicate username
        if db.query(User).filter(User.username == request_data.username).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username is already taken")

        # Get role (default to analyst if requested role not found)
        role = db.query(Role).filter(Role.code == request_data.role_code).first()
        if not role:
            role = db.query(Role).filter(Role.code == "analyst").first()
            if not role:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Default system roles not seeded")

        user = User(
            email=request_data.email,
            username=request_data.username,
            full_name=request_data.full_name,
            hashed_password=get_password_hash(request_data.password),
            role_id=role.id,
            is_active=True,
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        log_audit_event(db, action="USER_REGISTERED", module="auth", user_id=user.id, details=f"Registered account {user.email}", request=req)
        return user

    @staticmethod
    def authenticate_user(db: Session, login_data: LoginRequest, req: Optional[Request] = None) -> Tuple[User, str, str]:
        """Authenticate user and issue JWT Access & Refresh Tokens."""
        # Query by username or email
        user = db.query(User).filter(
            (User.email == login_data.username_or_email) | (User.username == login_data.username_or_email)
        ).first()

        if not user or not verify_password(login_data.password, user.hashed_password):
            log_audit_event(db, action="LOGIN_FAILED", module="auth", details=f"Failed attempt for {login_data.username_or_email}", request=req)
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username/email or password")

        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")

        # Update last login timestamp
        user.last_login_at = datetime.utcnow()

        # Create JWT Tokens
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        if login_data.remember_me:
            access_token_expires = timedelta(days=14)

        access_token = create_access_token(subject=user.id, expires_delta=access_token_expires)
        raw_refresh_token = create_refresh_token(subject=user.id)

        # Store Refresh Token Hash in DB
        refresh_expires_at = datetime.utcnow() + timedelta(days=30)
        token_entry = RefreshToken(
            user_id=user.id,
            token_hash=hash_token(raw_refresh_token),
            expires_at=refresh_expires_at
        )
        db.add(token_entry)
        db.commit()

        log_audit_event(db, action="LOGIN_SUCCESS", module="auth", user_id=user.id, details="User logged in successfully", request=req)
        return user, access_token, raw_refresh_token

    @staticmethod
    def refresh_tokens(db: Session, raw_refresh_token: str, req: Optional[Request] = None) -> Tuple[str, str]:
        """Validate refresh token and issue new token pair (Refresh Token Rotation)."""
        payload = decode_token(raw_refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

        user_id = payload.get("sub")
        t_hash = hash_token(raw_refresh_token)
        
        token_entry = db.query(RefreshToken).filter(
            RefreshToken.user_id == user_id,
            RefreshToken.token_hash == t_hash,
            RefreshToken.is_revoked == False
        ).first()

        if not token_entry or token_entry.expires_at < datetime.utcnow():
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token revoked or expired")

        # Revoke old refresh token (Rotation pattern)
        token_entry.is_revoked = True

        # Generate new token pair
        new_access_token = create_access_token(subject=user_id)
        new_refresh_token = create_refresh_token(subject=user_id)

        new_token_entry = RefreshToken(
            user_id=user_id,
            token_hash=hash_token(new_refresh_token),
            expires_at=datetime.utcnow() + timedelta(days=30)
        )
        db.add(new_token_entry)
        db.commit()

        log_audit_event(db, action="TOKEN_REFRESHED", module="auth", user_id=user_id, details="Rotated JWT tokens", request=req)
        return new_access_token, new_refresh_token

    @staticmethod
    def revoke_refresh_tokens(db: Session, user_id: str, req: Optional[Request] = None):
        """Revoke all refresh tokens for a user on logout."""
        db.query(RefreshToken).filter(RefreshToken.user_id == user_id).update({"is_revoked": True})
        db.commit()
        log_audit_event(db, action="LOGOUT", module="auth", user_id=user_id, details="User logged out", request=req)
