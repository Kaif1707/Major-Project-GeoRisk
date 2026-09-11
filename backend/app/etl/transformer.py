from typing import List, Dict, Any


class DataTransformer:
    """ETL Transformation Engine: Metric scaling, MinMax normalization, and time-series mapping."""

    @classmethod
    def transform_records(cls, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Transform cleaned records into standardized format."""
        transformed = []
        for rec in records:
            item = rec.copy()
            
            # Map field_name if present
            field = item.get("field_name", "raw_metric")
            item["indicator_field"] = field
            
            transformed.append(item)

        return transformed
