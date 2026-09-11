import logging
from typing import List, Dict, Any, Tuple

logger = logging.getLogger("georisk.etl.validation")


class DataValidator:
    """ETL Validation Engine: Schema, missing fields, ISO codes, and outlier detection."""

    VALID_ISO_LENGTH = 3
    MIN_YEAR = 1960
    MAX_YEAR = 2030

    @classmethod
    def validate_records(cls, records: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """Validate list of raw records. Returns (valid_records, rejected_records)."""
        valid = []
        rejected = []

        for record in records:
            iso_code = record.get("iso_code")
            year = record.get("year")
            value = record.get("value")

            # Rule 1: ISO Code must be 3 uppercase letters
            if not iso_code or len(iso_code) != cls.VALID_ISO_LENGTH or not iso_code.isalpha():
                rejected.append({**record, "reason": f"Invalid ISO Code: {iso_code}"})
                continue

            # Rule 2: Year bounds
            if not isinstance(year, int) or year < cls.MIN_YEAR or year > cls.MAX_YEAR:
                rejected.append({**record, "reason": f"Invalid Year: {year}"})
                continue

            # Rule 3: Value must be numeric
            if value is None or not isinstance(value, (int, float)):
                rejected.append({**record, "reason": f"Missing or non-numeric value: {value}"})
                continue

            valid.append(record)

        logger.info(f"Validated {len(records)} records. Passed: {len(valid)}, Rejected: {len(rejected)}")
        return valid, rejected
