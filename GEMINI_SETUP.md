# Gemini Integration Setup

This project has been updated to use Google's Gemini AI instead of Ollama for generating phishing simulation content.

## Setup Instructions

### 1. Get a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Install Dependencies

Run the installation script:

```bash
install_gemini_deps.bat
```

Or manually install:

```bash
pip install google-generativeai>=0.3.0 flask flask-cors
```

### 3. Set Environment Variable

Set your Gemini API key as an environment variable:

**Windows (Command Prompt):**

```bash
set GEMINI_API_KEY=your_api_key_here
```

**Windows (PowerShell):**

```powershell
$env:GEMINI_API_KEY="your_api_key_here"
```

**For permanent setup, add to Windows Environment Variables through System Properties.**

### 4. Start the Service

Run the Gemini service:

```bash
start_gemini_service.bat
```

Or manually:

```bash
python gemini_service.py
```

The service will start on `http://localhost:5000`

## API Endpoints

The API endpoints remain the same as before:

- `GET /health` - Health check
- `POST /generate/email` - Generate email phishing content
- `POST /generate/url` - Generate URL phishing content
- `POST /feedback` - Generate personalized feedback
- `POST /generate/email/bulk` - Generate bulk email content
- `POST /generate/url/bulk` - Generate bulk URL content

## Changes Made

1. **Backend Service**: Replaced `ollama_service.py` with `gemini_service.py`

   - Uses Google Generative AI library instead of Ollama API calls
   - Same endpoints and response formats maintained
   - Improved error handling for API failures

2. **Frontend Service**: Updated `ollamaService.ts` to `geminiService.ts`

   - Updated import statements in components
   - Same interface maintained for seamless integration

3. **Dependencies**: Updated `requirements.txt`
   - Removed `requests` dependency
   - Added `google-generativeai>=0.3.0`

## Model Configuration

The service uses `gemini-1.5-flash` by default, which provides:

- Fast response times
- Good quality content generation
- Cost-effective for educational content

You can modify the model in `gemini_service.py` if needed.

## Troubleshooting

### Common Issues

1. **API Key Not Set**

   ```
   ValueError: GEMINI_API_KEY environment variable not set
   ```

   Solution: Set the environment variable as described above

2. **API Rate Limits**

   - Gemini has rate limits - if you hit them, wait a moment and try again
   - For production use, consider implementing retry logic

3. **Network Issues**
   ```
   Error connecting to Gemini: [error details]
   ```
   Solution: Check internet connection and API key validity

### Testing the Service

You can test the service health with:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "status": "healthy",
  "model": "gemini-1.5-flash"
}
```

## Benefits of Gemini Integration

1. **No Local Setup Required**: Unlike Ollama, no need to download and run local models
2. **Better Performance**: Cloud-based processing with consistent response times
3. **Regular Updates**: Google continuously improves Gemini models
4. **Scalability**: Can handle concurrent requests better than local models
5. **Reduced Resource Usage**: No local GPU/CPU intensive model running

## Cost Considerations

Gemini API has usage-based pricing. For educational/development use, the free tier should be sufficient. Monitor your usage in the Google AI Studio dashboard.
