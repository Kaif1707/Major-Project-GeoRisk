from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings
import logging

logger = logging.getLogger("georisk.database")

# Primary Database Connection Engine (PostgreSQL or fallback SQLite for standalone tests)
db_url = settings.DATABASE_URL
try:
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        echo=settings.ENVIRONMENT == "development"
    )
    # Test connection
    with engine.connect() as conn:
        pass
except Exception as e:
    logger.warning(f"PostgreSQL connection failed ({e}). Falling back to SQLite local database.")
    db_url = "sqlite:///./georisk_local.db"
    engine = create_engine(db_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models."""
    pass


def get_db():
    """Dependency injection helper for database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
