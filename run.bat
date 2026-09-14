@echo off
echo Starting LocalFind Server...
python server.py
if %ERRORLEVEL% NEQ 0 (
    echo Python not found in PATH, trying py / default paths...
    py server.py
)
pause
