from typing import List, Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.security import decode_token
from app.models.user import User
from app.services.user_service import UserService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """Validate Bearer Access Token and return authenticated User."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise credentials_exception

    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    user = UserService.get_user_by_id(db, user_id=user_id)
    if user is None:
        raise credentials_exception

    return user


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Ensure authenticated user is active."""
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user account")
    return current_user


def require_permissions(required_perms: List[str]) -> Callable:
    """Dependency factory checking required granular permissions."""
    def permission_checker(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
        user_perms = UserService.get_user_permissions(db, current_user)
        # Super admin bypass check
        if current_user.role and current_user.role.code == "super_admin":
            return current_user

        for req_p in required_perms:
            if req_p not in user_perms:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission denied. Required permission: {req_p}"
                )
        return current_user
    return permission_checker


def require_roles(allowed_roles: List[str]) -> Callable:
    """Dependency factory checking required user roles."""
    def role_checker(current_user: User = Depends(get_current_active_user)):
        if not current_user.role or current_user.role.code not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role restriction. Allowed roles: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker
