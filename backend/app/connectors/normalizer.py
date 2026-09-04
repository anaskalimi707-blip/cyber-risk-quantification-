from typing import Dict, Any, List, Tuple


class DataNormalizer:
    """
    Normalizes heterogeneous cybersecurity logs & records into canonical domain models.
    Calculates Data Quality Index based on completeness, freshness, and veracity.
    """

    @staticmethod
    def calculate_data_quality_score(raw_record: Dict[str, Any], required_fields: List[str]) -> float:
        if not required_fields:
            return 1.0
        present_count = sum([1 for f in required_fields if raw_record.get(f) is not None and str(raw_record.get(f)).strip() != ""])
        completeness = present_count / len(required_fields)
        return round(completeness, 3)

    @staticmethod
    def normalize_asset_record(raw: Dict[str, Any]) -> Dict[str, Any]:
        """Normalizes AWS EC2 / Azure VM / Qualys host into canonical Asset format."""
        name = raw.get("name") or raw.get("hostname") or raw.get("instance_id") or "unnamed-asset"
        ip = raw.get("ip_address") or raw.get("private_ip") or raw.get("public_ip")
        
        return {
            "name": name,
            "asset_type": raw.get("asset_type", "Server"),
            "hostname": raw.get("hostname", name),
            "ip_address": ip,
            "cloud_account": raw.get("cloud_account") or raw.get("account_id"),
            "environment": raw.get("environment", "Production"),
            "criticality": raw.get("criticality", "High"),
            "data_classification": raw.get("data_classification", "Restricted"),
            "internet_exposed": bool(raw.get("internet_exposed", False)),
            "source_system": raw.get("source_system", "Automated Ingestion"),
            "normalized_data": raw
        }
