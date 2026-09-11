import time
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import httpx

logger = logging.getLogger("georisk.etl.connector")


class BaseConnector(ABC):
    """Abstract base class for external API connectors with retries & rate limiting."""

    def __init__(self, base_url: str, rate_limit_delay: float = 0.2, max_retries: int = 3, timeout: float = 15.0):
        self.base_url = base_url
        self.rate_limit_delay = rate_limit_delay
        self.max_retries = max_retries
        self.timeout = timeout

    def fetch(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Optional[Any]:
        """Fetch endpoint with exponential backoff retry and rate limiting."""
        url = f"{self.base_url.rstrip('/')}/{endpoint.lstrip('/')}"
        time.sleep(self.rate_limit_delay)

        for attempt in range(1, self.max_retries + 1):
            try:
                with httpx.Client(timeout=self.timeout) as client:
                    response = client.get(url, params=params)
                    response.raise_for_status()
                    return response.json()
            except (httpx.HTTPStatusError, httpx.RequestError) as exc:
                logger.warning(f"[Attempt {attempt}/{self.max_retries}] Fetch failed for {url}: {exc}")
                if attempt == self.max_retries:
                    logger.error(f"Exhausted retries for {url}")
                    return None
                time.sleep(2 ** attempt)

    @abstractmethod
    def extract_indicator(self, indicator_code: str, start_year: int = 2020, end_year: int = 2025) -> list:
        """Extract structured indicator records."""
        pass
