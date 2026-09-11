from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr


class PermissionResponse(BaseModel):
    id: str
    name: str
    code: str
    module: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class RoleResponse(BaseModel):
    id: str
    name: str
    code: str
    description: Optional[str] = None
    is_system: bool
    permissions: List[PermissionResponse] = []

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    username: str
    full_name: str
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str] = None
    theme_preference: str
    language_preference: str
    last_login_at: Optional[datetime] = None
    created_at: datetime
    role: RoleResponse
    permissions: List[str] = []

    class Config:
        from_attributes = True


class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    theme_preference: Optional[str] = None
    language_preference: Optional[str] = None
