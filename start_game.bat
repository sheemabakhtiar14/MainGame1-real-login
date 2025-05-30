@echo off
echo Starting Phishing Simulation Game with LLM Integration...
echo.

echo Checking if Ollama is running...
curl -s http://localhost:11434/api/version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Ollama is not running!
    echo Please start Ollama first: ollama serve
    echo Then make sure gemma3:4b model is available: ollama list
    pause
    exit /b 1
)

echo Ollama is running ✓
echo.

echo Starting Python Flask service...
start "Python Service" cmd /k "cd /d %~dp0 && python ollama_service.py"
timeout /t 3 /nobreak >nul

echo Starting React development server...
start "React App" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ✓ Services are starting up...
echo ✓ Python service will be available at: http://localhost:5000
echo ✓ React app will be available at: http://localhost:5174
echo.
echo Press any key to open the game in your browser...
pause >nul

start http://localhost:5174

echo.
echo Game is now running with AI-powered content generation!
echo Close this window when you're done playing.
pause
