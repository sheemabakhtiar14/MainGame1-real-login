@echo off
echo Installing Python dependencies for Gemini service...
pip install -r requirements.txt

echo.
echo Setup complete! 
echo.
echo Before running the service, make sure to:
echo 1. Get a Gemini API key from https://makersuite.google.com/app/apikey
echo 2. Set the environment variable: set GEMINI_API_KEY=your_api_key_here
echo 3. Run the service with: python gemini_service.py
echo.
pause
