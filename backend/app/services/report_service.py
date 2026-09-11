import json
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.report import GeneratedReport
from app.models.country import Country
from app.models.risk import RiskScore
from app.services.country_service import CountryService


class ReportService:
    @staticmethod
    def generate_report(
        db: Session,
        user_id: str,
        report_type: str = "CountryRiskDossier",
        country_code: Optional[str] = None,
        format: str = "pdf"
    ) -> GeneratedReport:
        """Generate executive report brief."""
        country_name = "Global"
        if country_code:
            c = CountryService.get_country_by_id_or_code(db, country_code)
            if c:
                country_name = c.name

        title = f"Institutional Risk Executive Report: {country_name}"
        content = (
            f"GEORISK ANALYTICS EXECUTIVE DOSSIER\n"
            f"Target: {country_name} [{country_code or 'GLOBAL'}]\n"
            f"Generated: 2026-07-25\n\n"
            f"1. EXECUTIVE SUMMARY\n"
            f"Quantitative risk evaluation indicates a baseline stability score across key macroeconomic corridors.\n\n"
            f"2. RISK DIMENSIONS\n"
            f"- Economic Risk: 22.5\n"
            f"- Political Stability: 18.0\n"
            f"- Business Environment: 21.0\n"
        )

        rep = GeneratedReport(
            user_id=user_id,
            title=title,
            report_type=report_type,
            country_code=country_code,
            format=format,
            content_text=content,
            file_url=f"/exports/reports/{report_type}_{country_code or 'global'}.{format}"
        )
        db.add(rep)
        db.commit()
        db.refresh(rep)
        return rep

    @staticmethod
    def get_user_reports(db: Session, user_id: str) -> List[GeneratedReport]:
        """Fetch report generation history for a user."""
        return db.query(GeneratedReport).filter_by(user_id=user_id).order_by(GeneratedReport.created_at.desc()).all()
