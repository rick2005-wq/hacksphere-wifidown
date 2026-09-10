import urllib.request
import json
import subprocess
import time
import sys
import unittest
from scanner.severity import normalize_severity
from scanner.parser import parse_slither_output

class TestScannerInternal(unittest.TestCase):
    def test_severity_mapping(self):
        self.assertEqual(normalize_severity("CRITICAL"), "critical")
        self.assertEqual(normalize_severity("High"), "high")
        self.assertEqual(normalize_severity("Informational"), "informational")
        self.assertEqual(normalize_severity("random_stuff"), "unknown")
        
    def test_malformed_parser(self):
        # Normal structure but empty results
        empty_res = {"success": True, "slither": {"success": True, "results": None}}
        out = parse_slither_output(empty_res)
        self.assertTrue(out["success"])
        self.assertEqual(out["summary"]["total"], 0)
        
        # Complete garbage
        garbage = "not a dict at all"
        out2 = parse_slither_output(garbage)
        self.assertFalse(out2["success"])
        self.assertEqual(out2["analysis_status"], "failed")

print("Running Unit Tests...")
unittest.TextTestRunner().run(unittest.defaultTestLoader.loadTestsFromTestCase(TestScannerInternal))

print("\nStarting backend for Integration Tests...")
proc = subprocess.Popen([sys.executable, "-m", "uvicorn", "main:app", "--port", "8086"])

try:
    time.sleep(3)
    
    print("\n1. Testing Health Endpoint")
    health_req = urllib.request.urlopen("http://localhost:8086/health")
    assert health_req.status == 200
    print("Health response:", health_req.read().decode())

    print("\n2. Testing sample.sol (Expected Findings)")
    with open("../contracts/sample.sol", "r", encoding="utf-8") as f:
        src = f.read()

    data = json.dumps({"source": src}).encode('utf-8')
    req = urllib.request.Request(
        "http://localhost:8086/api/analyze",
        data=data,
        headers={"Content-Type": "application/json"}
    )
    
    result_req = urllib.request.urlopen(req)
    result_json = json.loads(result_req.read().decode())
    
    print("Success Flag:", result_json.get("success"))
    print("Summary:", result_json.get("summary"))
    
    findings = result_json.get("findings", [])
    print(f"Number of findings: {len(findings)}")
    assert len(findings) == result_json["summary"]["total"]
    
    if len(findings) > 0:
        print("First Finding Keys:", list(findings[0].keys()))

    print("\n3. Testing Safe Code (Zero or Minimum Findings)")
    safe_code = "pragma solidity ^0.8.20;\ncontract Safe {\n    uint256 public a;\n}\n"
    data2 = json.dumps({"source": safe_code}).encode('utf-8')
    req2 = urllib.request.Request(
        "http://localhost:8086/api/analyze",
        data=data2,
        headers={"Content-Type": "application/json"}
    )
    result_req2 = urllib.request.urlopen(req2)
    result_json2 = json.loads(result_req2.read().decode())
    print("Safe Code Summary:", result_json2.get("summary"))
    print("Safe Code Success:", result_json2.get("success"))
    
finally:
    proc.kill()
    print("Backend stopped. ALL TESTS EXECUTED.")
