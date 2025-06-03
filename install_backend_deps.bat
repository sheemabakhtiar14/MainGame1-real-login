@echo off
echo Installing Python dependencies for Gemini backend service...
cd /d "%~dp0backend"
pip install -r requirements.txt

echo.
echo Setup complete! 
echo.
echo Before running the service, make sure the backend/.env file has your Gemini API keys.
echo Then run: start_backend.bat
echo.
pause
