def normalize_severity(impact: str) -> str:
    """Normalize Slither impact values to application severity levels."""
    if not impact:
        return "informational"
        
    normalized = impact.lower().strip()
    
    mapping = {
        "critical": "critical",
        "high": "high",
        "medium": "medium",
        "low": "low",
        "informational": "informational"
    }
    
    return mapping.get(normalized, "unknown")
