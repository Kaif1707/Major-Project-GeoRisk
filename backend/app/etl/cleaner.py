from typing import List, Dict, Any


class DataCleaner:
    """ETL Cleaning Engine: Whitespace trimming, ISO uppercase, null imputations."""

    @classmethod
    def clean_records(cls, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Clean validated records."""
        cleaned = []
        for rec in records:
            item = rec.copy()
            # Normalize ISO
            if "iso_code" in item:
                item["iso_code"] = str(item["iso_code"]).strip().upper()
            
            # Clean string values
            if "country_name" in item and item["country_name"]:
                item["country_name"] = str(item["country_name"]).strip()

            # Round numerical values to 4 decimals
            if "value" in item and isinstance(item["value"], (int, float)):
                item["value"] = round(float(item["value"]), 4)

            cleaned.append(item)

        return cleaned
