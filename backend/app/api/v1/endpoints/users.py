from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.response import StandardResponse
from app.schemas.user import UserResponse, UserUpdateRequest, RoleResponse, PermissionResponse
from app.services.user_service import UserService
from app.dependencies.auth import get_current_active_user, require_permissions
from app.models.user import User

router = APIRouter()


@router.get("/me", response_model=StandardResponse[UserResponse])
async def get_my_profile(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """Fetch profile details of currently authenticated user."""
    perms = UserService.get_user_permissions(db, current_user)
    user_res = UserResponse.model_validate(current_user)
    user_res.permissions = perms

    return StandardResponse(
        status="success",
        message="Profile retrieved successfully",
        data=user_res
    )


@router.patch("/me", response_model=StandardResponse[UserResponse])
async def update_my_profile(
    update_data: UserUpdateRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update profile preferences of authenticated user."""
    updated_user = UserService.update_user_profile(db, current_user, update_data)
    perms = UserService.get_user_permissions(db, updated_user)
    
    user_res = UserResponse.model_validate(updated_user)
    user_res.permissions = perms

    return StandardResponse(
        status="success",
        message="Profile updated successfully",
        data=user_res
    )


@router.get("", response_model=StandardResponse[List[UserResponse]])
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(require_permissions(["users:manage"])),
    db: Session = Depends(get_db)
):
    """List registered users (Requires `users:manage` permission)."""
    users = UserService.get_all_users(db, skip=skip, limit=limit)
    users_res = []
    for u in users:
        perms = UserService.get_user_permissions(db, u)
        res = UserResponse.model_validate(u)
        res.permissions = perms
        users_res.append(res)

    return StandardResponse(
        status="success",
        message="Users listed successfully",
        data=users_res
    )


@router.get("/roles", response_model=StandardResponse[List[RoleResponse]])
async def list_roles(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List system RBAC roles."""
    roles = UserService.get_all_roles(db)
    roles_res = [RoleResponse.model_validate(r) for r in roles]

    return StandardResponse(
        status="success",
        message="Roles retrieved successfully",
        data=roles_res
    )


@router.get("/permissions", response_model=StandardResponse[List[PermissionResponse]])
async def list_permissions(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List system permissions."""
    perms = UserService.get_all_permissions(db)
    perms_res = [PermissionResponse.model_validate(p) for p in perms]

    return StandardResponse(
        status="success",
        message="Permissions retrieved successfully",
        data=perms_res
    )
