from scanner.severity import normalize_severity

def parse_slither_output(raw_json: dict) -> dict:
    """
    Takes the raw JSON object from slither_runner.py.
    Differentiates valid, errored, and malformed outputs.
    """
    if not isinstance(raw_json, dict) or "slither" not in raw_json:
        return {
            "success": False,
            "analysis_status": "failed",
            "error": "Malformed or unexpected input structure."
        }
        
    if not raw_json.get("success"):
        return raw_json  # Pass through the execution failure

    slither_data = raw_json["slither"]
    if not slither_data.get("success") or "results" not in slither_data:
        # If slither explicitly returned success: false or missing results
        results = slither_data.get("results") or {}
        error_msg = slither_data.get("stderr") or results.get("error") or "Unknown slither error"
        return {
            "success": False,
            "analysis_status": "failed",
            "error": error_msg
        }

    results_obj = slither_data["results"]
    if results_obj is None:
        results_obj = {}

    detectors = results_obj.get("detectors", [])
    
    findings = []
    for d in detectors:
        impact = d.get("impact", "")
        sev = normalize_severity(impact)
        
        # safely extract location
        elements = d.get("elements", [])
        line_start = None
        line_end = None
        contract_name = None
        func_name = None
        
        for el in elements:
            sm = el.get("source_mapping", {})
            lines = sm.get("lines", [])
            if lines:
                if line_start is None:
                    line_start = min(lines)
                else:
                    line_start = min(line_start, min(lines))
                    
                if line_end is None:
                    line_end = max(lines)
                else:
                    line_end = max(line_end, max(lines))

            # Try to infer contract/function if reported by Slither
            el_type = el.get("type", "")
            if el_type == "contract" and not contract_name:
                contract_name = el.get("name")
            elif el_type == "function" and not func_name:
                func_name = el.get("name")
                
                # sometimes slither sets the contract as well in function type_specific_fields
                tsf = el.get("type_specific_fields", {})
                parent_info = tsf.get("parent", {})
                if parent_info and parent_info.get("type") == "contract" and not contract_name:
                    contract_name = parent_info.get("name")

        finding = {
            "id": d.get("id", "unknown-id"),
            "type": d.get("check", "unknown"),
            "title": d.get("check", "unknown").replace("-", " ").title(),
            "severity": sev,
            "confidence": d.get("confidence", "Unknown"),
            "contract": contract_name,
            "function": func_name,
            "lineStart": line_start,
            "lineEnd": line_end,
            "description": d.get("description", ""),
            "recommendation": None
        }
        findings.append(finding)
        
    summary = {
        "total": len(findings),
        "critical": sum(1 for f in findings if f["severity"] == "critical"),
        "high": sum(1 for f in findings if f["severity"] == "high"),
        "medium": sum(1 for f in findings if f["severity"] == "medium"),
        "low": sum(1 for f in findings if f["severity"] == "low"),
        "informational": sum(1 for f in findings if f["severity"] == "informational")
    }
    
    return {
        "success": True,
        "analysis_status": "completed",
        "summary": summary,
        "findings": findings
    }
