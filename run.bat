@echo off
echo Starting Nearby Server on http://localhost:8000 ...
python server.py
if %ERRORLEVEL% NEQ 0 (
    echo Python not found in PATH, trying py / default paths...
    "%USERPROFILE%\.local\bin\python3.14.exe" server.py
)
if %ERRORLEVEL% NEQ 0 (
    py server.py
)
pause
