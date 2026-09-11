from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.indicator import DataRefreshHistory, DataQualityLog
from app.models.country import IndicatorSource
from app.etl.pipeline import ETLPipeline


class ETLService:
    @staticmethod
    def trigger_manual_refresh(db: Session) -> DataRefreshHistory:
        """Trigger an on-demand ETL pipeline execution."""
        pipeline = ETLPipeline(db)
        return pipeline.run_full_refresh(job_type="Manual")

    @staticmethod
    def get_refresh_history(db: Session, skip: int = 0, limit: int = 50) -> List[DataRefreshHistory]:
        """Fetch ETL execution history."""
        return db.query(DataRefreshHistory).order_by(DataRefreshHistory.started_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def get_etl_status(db: Session) -> dict:
        """Fetch overall health status of ETL data sources and pipelines."""
        sources = db.query(IndicatorSource).all()
        last_refresh = db.query(DataRefreshHistory).order_by(DataRefreshHistory.started_at.desc()).first()
        quality_logs = db.query(DataQualityLog).order_by(DataQualityLog.logged_at.desc()).limit(5).all()

        return {
            "status": "healthy",
            "active_sources_count": len(sources),
            "sources": [{"name": s.name, "code": s.code, "status": s.health_status} for s in sources],
            "last_refresh": {
                "id": last_refresh.id if last_refresh else None,
                "status": last_refresh.status if last_refresh else "none",
                "rows_imported": last_refresh.rows_imported if last_refresh else 0,
                "completed_at": last_refresh.completed_at if last_refresh else None,
            } if last_refresh else None,
            "recent_quality_logs_count": len(quality_logs)
        }
