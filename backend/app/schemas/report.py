from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class GeneratedReportResponse(BaseModel):
    id: str
    user_id: str
    title: str
    report_type: str
    country_code: Optional[str] = None
    format: str
    content_text: Optional[str] = None
    file_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ReportGenerateRequest(BaseModel):
    report_type: str = Field(default="CountryRiskDossier") # CountryRiskDossier, RegionalSummary, PortfolioRisk
    country_code: Optional[str] = None
    region: Optional[str] = None
    format: str = Field(default="pdf")                      # pdf, csv, json
