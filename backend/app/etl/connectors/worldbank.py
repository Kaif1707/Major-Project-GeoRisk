from typing import List, Dict, Any
from app.etl.connectors.base import BaseConnector


class WorldBankConnector(BaseConnector):
    """World Bank Open Data API Connector."""

    # Indicator mappings
    INDICATOR_CODES = {
        "NY.GDP.MKTP.CD": "gdp_usd",              # GDP (current US$)
        "NY.GDP.MKTP.KD.ZG": "gdp_growth_pct",     # GDP growth (annual %)
        "FP.CPI.TOTL.ZG": "inflation_pct",         # Inflation, consumer prices (annual %)
        "BX.KLT.DINV.CD.WD": "fdi_usd",            # Foreign direct investment, net inflows (BoP, current US$)
        "SP.POP.TOTL": "population",               # Population, total
        "PV.EST": "political_stability",           # Political Stability and Absence of Violence/Terrorism
        "GE.EST": "govt_effectiveness",            # Government Effectiveness
        "RL.EST": "rule_of_law",                   # Rule of Law
        "RQ.EST": "regulatory_quality",            # Regulatory Quality
        "CC.EST": "control_of_corruption",         # Control of Corruption
    }

    def __init__(self):
        super().__init__(base_url="https://api.worldbank.org/v2", rate_limit_delay=0.1)

    def extract_indicator(self, indicator_code: str, start_year: int = 2020, end_year: int = 2025) -> List[Dict[str, Any]]:
        """Fetch indicator time-series across all countries."""
        endpoint = f"country/all/indicator/{indicator_code}"
        params = {
            "date": f"{start_year}:{end_year}",
            "format": "json",
            "per_page": 1000
        }
        
        data = self.fetch(endpoint, params=params)
        records = []
        
        if data and isinstance(data, list) and len(data) > 1 and data[1]:
            for item in data[1]:
                val = item.get("value")
                country_iso = item.get("countryiso3code")
                year_str = item.get("date")
                
                if val is not None and country_iso and year_str:
                    try:
                        records.append({
                            "iso_code": country_iso.upper(),
                            "country_name": item.get("country", {}).get("value"),
                            "indicator_code": indicator_code,
                            "field_name": self.INDICATOR_CODES.get(indicator_code, indicator_code),
                            "year": int(year_str),
                            "value": float(val)
                        })
                    except (ValueError, TypeError):
                        continue

        return records
