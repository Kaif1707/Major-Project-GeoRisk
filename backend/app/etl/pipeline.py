import time
import logging
from datetime import datetime
from sqlalchemy.orm import Session
from app.etl.connectors.worldbank import WorldBankConnector
from app.etl.validation import DataValidator
from app.etl.cleaner import DataCleaner
from app.etl.transformer import DataTransformer
from app.etl.loader import DataLoader
from app.models.indicator import DataRefreshHistory

logger = logging.getLogger("georisk.etl.pipeline")


class ETLPipeline:
    """Main ETL Pipeline Orchestrator."""

    def __init__(self, db: Session):
        self.db = db
        self.worldbank = WorldBankConnector()

    def run_full_refresh(self, job_type: str = "Manual") -> DataRefreshHistory:
        """Run complete extraction, validation, cleaning, transformation, and DB loading."""
        start_time = time.time()
        refresh_record = DataRefreshHistory(
            source_name="World Bank & IMF API",
            job_type=job_type,
            status="in_progress",
            started_at=datetime.utcnow()
        )
        self.db.add(refresh_record)
        self.db.commit()

        try:
            raw_records = []
            # Extract sample indicator sets
            for indicator_code in ["NY.GDP.MKTP.KD.ZG", "FP.CPI.TOTL.ZG", "PV.EST"]:
                extracted = self.worldbank.extract_indicator(indicator_code, start_year=2021, end_year=2024)
                raw_records.extend(extracted)

            # Validate
            valid_recs, rejected_recs = DataValidator.validate_records(raw_records)

            # Clean
            cleaned_recs = DataCleaner.clean_records(valid_recs)

            # Transform
            transformed_recs = DataTransformer.transform_records(cleaned_recs)

            # Load
            imported_count = DataLoader.load_transformed_records(self.db, transformed_recs, rejected_recs)

            execution_duration = round(time.time() - start_time, 2)
            refresh_record.status = "success"
            refresh_record.rows_imported = imported_count
            refresh_record.execution_time_seconds = execution_duration
            refresh_record.completed_at = datetime.utcnow()
            self.db.commit()

            logger.info(f"ETL Pipeline completed successfully in {execution_duration}s. Rows imported: {imported_count}")
            return refresh_record
        except Exception as e:
            self.db.rollback()
            execution_duration = round(time.time() - start_time, 2)
            refresh_record.status = "failed"
            refresh_record.error_log = str(e)
            refresh_record.execution_time_seconds = execution_duration
            refresh_record.completed_at = datetime.utcnow()
            self.db.commit()
            logger.error(f"ETL Pipeline failed: {e}")
            return refresh_record
