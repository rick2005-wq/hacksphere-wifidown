import subprocess
import json
import logging
import os

logger = logging.getLogger(__name__)

def run_slither(filepath: str):
    """
    Run Slither against a Solidity file and return raw JSON results.
    """
    try:
        # slither --json - outputs JSON to stdout
        cmd = ["slither", filepath, "--json", "-"]
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=90
        )
        
        stdout = result.stdout.strip()
        stderr = result.stderr.strip()

        if not stdout:
            return {
                "success": False,
                "analysis_status": "failed",
                "error": stderr or "Slither produced no output"
            }

        try:
            json_output = json.loads(stdout)
            return {
                "success": True,
                "analysis_status": "completed",
                "slither": {
                    "success": json_output.get("success", True),
                    "results": json_output,
                    "stderr": stderr
                }
            }
        except json.JSONDecodeError as e:
            return {
                "success": False,
                "analysis_status": "failed",
                "error": f"Failed to parse Slither JSON output: {str(e)}",
                "raw_stdout": stdout[:200],  # Truncate for safety
                "raw_stderr": stderr[:200]
            }

    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "analysis_status": "failed",
            "error": "Slither analysis timed out."
        }
    except Exception as e:
        logger.exception("Error running slither")
        return {
            "success": False,
            "analysis_status": "failed",
            "error": str(e)
        }
