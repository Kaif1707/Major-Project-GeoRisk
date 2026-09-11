import sys
import os
from sqlalchemy.orm import Session

# Ensure app package is importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from app.database.session import SessionLocal, engine, Base
from app.models.user import User, Role, Permission, RolePermission
from app.core.security import get_password_hash


def seed_database():
    """Seed initial database with RBAC roles, permissions, and default accounts."""
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Define Permissions
        permissions_data = [
            {"name": "Dashboard Access", "code": "dashboard:view", "module": "dashboard", "description": "Access dashboard overview"},
            {"name": "Countries Access", "code": "countries:view", "module": "countries", "description": "View sovereign country profiles"},
            {"name": "Reports Access", "code": "reports:view", "module": "reports", "description": "View and export risk reports"},
            {"name": "Forecast Access", "code": "forecast:view", "module": "forecast", "description": "Access predictive ML models"},
            {"name": "AI Assistant Access", "code": "ai:query", "module": "ai_assistant", "description": "Query GeoRisk AI Assistant"},
            {"name": "Admin Panel Access", "code": "admin:view", "module": "admin", "description": "Access system administration panel"},
            {"name": "User Management", "code": "users:manage", "module": "admin", "description": "Manage users and role assignments"},
            {"name": "Weight Management", "code": "weights:manage", "module": "admin", "description": "Modify risk indicator weighting matrix"},
            {"name": "ETL Management", "code": "etl:manage", "module": "admin", "description": "Trigger and configure data ingestion jobs"},
            {"name": "System Logs View", "code": "logs:view", "module": "admin", "description": "Inspect audit and system log records"},
            {"name": "Settings Access", "code": "settings:manage", "module": "settings", "description": "Modify account and application settings"},
        ]

        permission_map = {}
        for p_data in permissions_data:
            perm = db.query(Permission).filter_by(code=p_data["code"]).first()
            if not perm:
                perm = Permission(**p_data)
                db.add(perm)
                db.flush()
            permission_map[p_data["code"]] = perm

        # 2. Define Roles
        roles_data = [
            {
                "name": "Super Admin",
                "code": "super_admin",
                "description": "Full system control across all modules and administration",
                "is_system": True,
                "perms": list(permission_map.keys())
            },
            {
                "name": "Admin",
                "code": "admin",
                "description": "System administrator with user and operational management",
                "is_system": True,
                "perms": ["dashboard:view", "countries:view", "reports:view", "forecast:view", "ai:query", "admin:view", "users:manage", "settings:manage"]
            },
            {
                "name": "Analyst",
                "code": "analyst",
                "description": "Senior risk & investment analyst",
                "is_system": True,
                "perms": ["dashboard:view", "countries:view", "reports:view", "forecast:view", "ai:query", "settings:manage"]
            },
            {
                "name": "Researcher",
                "code": "researcher",
                "description": "Academic or research user",
                "is_system": True,
                "perms": ["dashboard:view", "countries:view", "reports:view", "forecast:view", "settings:manage"]
            },
            {
                "name": "Investor",
                "code": "investor",
                "description": "Institutional or corporate investor",
                "is_system": True,
                "perms": ["dashboard:view", "countries:view", "reports:view", "forecast:view", "ai:query", "settings:manage"]
            },
            {
                "name": "Student",
                "code": "student",
                "description": "Standard educational tier access",
                "is_system": True,
                "perms": ["dashboard:view", "countries:view", "settings:manage"]
            },
            {
                "name": "Guest",
                "code": "guest",
                "description": "Read-only preview tier",
                "is_system": True,
                "perms": ["dashboard:view"]
            },
        ]

        role_map = {}
        for r_data in roles_data:
            role = db.query(Role).filter_by(code=r_data["code"]).first()
            if not role:
                role = Role(
                    name=r_data["name"],
                    code=r_data["code"],
                    description=r_data["description"],
                    is_system=r_data["is_system"]
                )
                db.add(role)
                db.flush()

                # Attach permissions
                for perm_code in r_data["perms"]:
                    if perm_code in permission_map:
                        rp = RolePermission(role_id=role.id, permission_id=permission_map[perm_code].id)
                        db.add(rp)
            role_map[r_data["code"]] = role

        # 3. Create Default Super Admin Account
        admin_email = "admin@georisk.internal"
        admin_user = db.query(User).filter_by(email=admin_email).first()
        if not admin_user:
            admin_user = User(
                email=admin_email,
                username="admin",
                full_name="System Super Administrator",
                hashed_password=get_password_hash("admin123"),
                role_id=role_map["super_admin"].id,
                is_active=True,
                is_verified=True,
                theme_preference="dark",
                language_preference="en"
            )
            db.add(admin_user)
        else:
            admin_user.hashed_password = get_password_hash("admin123")

        # 4. Create Default Sample Analyst Account
        analyst_email = "analyst@georisk.internal"
        analyst_user = db.query(User).filter_by(email=analyst_email).first()
        if not analyst_user:
            analyst_user = User(
                email=analyst_email,
                username="analyst",
                full_name="Senior Investment Analyst",
                hashed_password=get_password_hash("analyst123"),
                role_id=role_map["analyst"].id,
                is_active=True,
                is_verified=True,
                theme_preference="dark",
                language_preference="en"
            )
            db.add(analyst_user)
        else:
            analyst_user.hashed_password = get_password_hash("analyst123")

        db.commit()
        print("Database seed completed successfully with RBAC roles, permissions, and default accounts.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
