@echo off
echo Starting Gemini Phishing Simulation Service...
echo.

REM Check if GEMINI_API_KEY is set
if "%GEMINI_API_KEY%"=="" (
    echo ERROR: GEMINI_API_KEY environment variable is not set!
    echo Please set your Gemini API key with:
    echo set GEMINI_API_KEY=your_api_key_here
    echo.
    echo Get your API key from: https://makersuite.google.com/app/apikey
    echo.
    pause
    exit /b 1
)

echo Using Gemini API key: %GEMINI_API_KEY:~0,8%...
echo.

python gemini_service.py
pause
