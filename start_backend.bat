@echo off
echo Starting Gemini Backend Service...
echo.

cd /d "%~dp0backend"

REM Check if .env file exists
if not exist ".env" (
    echo ERROR: .env file not found in backend folder!
    echo Please make sure backend/.env exists with your Gemini API keys.
    echo.
    pause
    exit /b 1
)

echo Using Gemini 1.5 Pro model
echo.

python gemini_service.py
pause
