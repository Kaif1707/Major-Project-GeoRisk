from typing import List, Dict, Any
from app.etl.connectors.base import BaseConnector


class IMFConnector(BaseConnector):
    """IMF Data API Architecture Connector stub."""

    def __init__(self):
        super().__init__(base_url="http://dataservices.imf.org/REST/SDMX_JSON.svc", rate_limit_delay=0.3)

    def extract_indicator(self, indicator_code: str, start_year: int = 2020, end_year: int = 2025) -> List[Dict[str, Any]]:
        """Extract structured IMF macroeconomic series."""
        # Architecture stub returning empty list or mock response
        return []
