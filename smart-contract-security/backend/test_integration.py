import urllib.request
import json
import subprocess
import time
import sys

print("Starting backend...")
proc = subprocess.Popen([sys.executable, "-m", "uvicorn", "main:app", "--port", "8085"])

try:
    time.sleep(3)
    
    # Check health
    health_req = urllib.request.urlopen("http://localhost:8085/health")
    print("Health response:", health_req.read().decode())

    # Post to /api/analyze
    with open("../contracts/sample.sol", "r", encoding="utf-8") as f:
        src = f.read()

    data = json.dumps({"source": src}).encode('utf-8')
    req = urllib.request.Request(
        "http://localhost:8085/api/analyze",
        data=data,
        headers={"Content-Type": "application/json"}
    )
    
    result_req = urllib.request.urlopen(req)
    result_text = result_req.read().decode()
    
    result_json = json.loads(result_text)
    print("Analyze Success Flag:", result_json.get("success"))
    print("Analysis Status:", result_json.get("analysis_status"))
    print("Has slither data:", "slither" in result_json)
    
    # Optionally print a snippet of raw Slither output
    if "slither" in result_json and "results" in result_json["slither"]:
        print("Success field inside Slither result:", result_json["slither"]["results"].get("success"))
    
finally:
    proc.kill()
