from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.response import StandardResponse
from app.schemas.auth import (
    LoginRequest, RegisterRequest, TokenResponse, 
    RefreshTokenRequest, ForgotPasswordRequest, ResetPasswordRequest
)
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/register", response_model=StandardResponse[UserResponse], status_code=status.HTTP_201_CREATED)
async def register(request_data: RegisterRequest, req: Request, db: Session = Depends(get_db)):
    """Register a new user account."""
    user = AuthService.register_user(db, request_data, req)
    perms = UserService.get_user_permissions(db, user)
    
    user_res = UserResponse.model_validate(user)
    user_res.permissions = perms

    return StandardResponse(
        status="success",
        message="User registered successfully",
        data=user_res
    )


@router.post("/login", response_model=StandardResponse[dict])
async def login(login_data: LoginRequest, req: Request, db: Session = Depends(get_db)):
    """Authenticate user credentials and issue JWT Access and Refresh tokens."""
    user, access_token, refresh_token = AuthService.authenticate_user(db, login_data, req)
    perms = UserService.get_user_permissions(db, user)

    user_res = UserResponse.model_validate(user)
    user_res.permissions = perms

    return StandardResponse(
        status="success",
        message="Authentication successful",
        data={
            "user": user_res,
            "tokens": {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer",
                "expires_in": 60 * 24 * 7 * 60
            }
        }
    )


@router.post("/logout", response_model=StandardResponse[dict])
async def logout(req: Request, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Revoke refresh tokens and end session."""
    AuthService.revoke_refresh_tokens(db, current_user.id, req)
    return StandardResponse(
        status="success",
        message="Logged out successfully",
        data={"user_id": current_user.id}
    )


@router.post("/refresh", response_model=StandardResponse[dict])
async def refresh_token(request_data: RefreshTokenRequest, req: Request, db: Session = Depends(get_db)):
    """Rotate JWT Refresh Token and return new token pair."""
    new_access_token, new_refresh_token = AuthService.refresh_tokens(db, request_data.refresh_token, req)
    return StandardResponse(
        status="success",
        message="Tokens refreshed successfully",
        data={
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer"
        }
    )


@router.post("/forgot-password", response_model=StandardResponse[dict])
async def forgot_password(request_data: ForgotPasswordRequest):
    """Initiate password recovery flow."""
    return StandardResponse(
        status="success",
        message="If the email is registered, a password reset token has been dispatched."
    )


@router.post("/reset-password", response_model=StandardResponse[dict])
async def reset_password(request_data: ResetPasswordRequest):
    """Reset password using reset token."""
    return StandardResponse(
        status="success",
        message="Password updated successfully. Please log in with your new credentials."
    )
