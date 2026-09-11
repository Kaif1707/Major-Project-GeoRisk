from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.user import User, Role, Permission, RolePermission
from app.schemas.user import UserUpdateRequest


class UserService:
    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
        """Fetch user by ID."""
        return db.query(User).filter(User.id == user_id, User.deleted_at == None).first()

    @staticmethod
    def get_user_permissions(db: Session, user: User) -> List[str]:
        """Retrieve list of permission codes for a user."""
        if not user.role:
            return []
        
        perms = db.query(Permission.code).join(RolePermission).filter(RolePermission.role_id == user.role_id).all()
        return [p[0] for p in perms]

    @staticmethod
    def update_user_profile(db: Session, user: User, update_data: UserUpdateRequest) -> User:
        """Update current user profile attributes."""
        if update_data.full_name is not None:
            user.full_name = update_data.full_name
        if update_data.avatar_url is not None:
            user.avatar_url = update_data.avatar_url
        if update_data.theme_preference is not None:
            user.theme_preference = update_data.theme_preference
        if update_data.language_preference is not None:
            user.language_preference = update_data.language_preference

        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_all_users(db: Session, skip: int = 0, limit: int = 50) -> List[User]:
        """List all registered users."""
        return db.query(User).filter(User.deleted_at == None).offset(skip).limit(limit).all()

    @staticmethod
    def get_all_roles(db: Session) -> List[Role]:
        """List all RBAC roles."""
        return db.query(Role).all()

    @staticmethod
    def get_all_permissions(db: Session) -> List[Permission]:
        """List all system permissions."""
        return db.query(Permission).all()
