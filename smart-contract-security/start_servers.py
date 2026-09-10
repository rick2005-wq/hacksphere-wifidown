import subprocess
import time
import sys
import os

print("Starting servers...", flush=True)

# Start Backend
backend_env = os.environ.copy()
# Point to correct python in venv if needed, but since we run this script inside venv, sys.executable is the right one!
backend_proc = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "main:app", "--port", "8000"],
    cwd="backend"
)

# Start Frontend
frontend_proc = subprocess.Popen(
    ["npm", "run", "dev"], 
    cwd="frontend",
    shell=True
)

try:
    print("Servers are running. Waiting until parent process exits...")
    while True:
        time.sleep(60)
except KeyboardInterrupt:
    pass
finally:
    print("Shutting down... ")
    backend_proc.kill()
    frontend_proc.kill()
