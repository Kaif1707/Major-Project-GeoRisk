from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.response import StandardResponse
from app.schemas.indicator import DataRefreshHistoryResponse
from app.services.etl_service import ETLService

router = APIRouter()


@router.post("/refresh", response_model=StandardResponse[DataRefreshHistoryResponse])
async def trigger_refresh(db: Session = Depends(get_db)):
    """Trigger manual on-demand execution of the ETL data extraction pipeline."""
    refresh_record = ETLService.trigger_manual_refresh(db)
    res = DataRefreshHistoryResponse.model_validate(refresh_record)

    return StandardResponse(
        status="success",
        message="ETL pipeline execution triggered and completed",
        data=res
    )


@router.get("/status", response_model=StandardResponse[dict])
async def get_etl_status(db: Session = Depends(get_db)):
    """Fetch health status of external data providers and pipeline history."""
    etl_status = ETLService.get_etl_status(db)
    return StandardResponse(
        status="success",
        message="ETL status retrieved successfully",
        data=etl_status
    )


@router.get("/refresh-history", response_model=StandardResponse[List[DataRefreshHistoryResponse]])
async def get_refresh_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """List historical ETL pipeline executions."""
    history = ETLService.get_refresh_history(db, skip=skip, limit=limit)
    res = [DataRefreshHistoryResponse.model_validate(h) for h in history]

    return StandardResponse(
        status="success",
        message="Refresh history retrieved successfully",
        data=res
    )
