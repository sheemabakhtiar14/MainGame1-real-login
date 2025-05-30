# Ollama Integration Setup

This guide will help you set up the Ollama integration for the phishing simulation game.

## Prerequisites

1. **Ollama installed** - Make sure you have Ollama installed on your system
2. **gemma3:4b model** - The model should be pulled and available

## Setup Instructions

### 1. Pull the Gemma Model

First, make sure you have the gemma3:4b model:

```bash
ollama pull gemma3:4b
```

### 2. Install Python Dependencies

Install the required Python packages:

```bash
pip install -r requirements.txt
```

### 3. Start Ollama Server

Start the Ollama server (if not already running):

```bash
ollama serve
```

### 4. Start the Python Service

Run the Python service that connects to Ollama:

```bash
python ollama_service.py
```

Or use the batch file on Windows:

```bash
start_ollama_service.bat
```

### 5. Start the React Application

In a separate terminal, start your React app:

```bash
npm run dev
```

## How It Works

1. **Training Data**: The system uses training data files in `training_data/` folder:

   - `email_scams.txt` - Contains examples of email phishing scams
   - `url_scams.txt` - Contains examples of URL phishing scams

2. **LLM Generation**: When a user enters a game mode:

   - The system generates 3 new scams for the current level
   - Each scam is generated based on the training data and difficulty level
   - The LLM also generates personalized feedback

3. **Efficient Loading**:
   - Content is only generated when the user clicks on a specific mode
   - Email mode only generates email scams
   - URL mode only generates URL scams

## API Endpoints

The Python service provides these endpoints:

- `GET /health` - Health check
- `POST /generate/email` - Generate email phishing scam
- `POST /generate/url` - Generate URL phishing scam
- `POST /feedback` - Generate personalized feedback

## Troubleshooting

### Connection Errors

If you see connection errors:

1. Make sure Ollama is running: `ollama serve`
2. Verify the model is available: `ollama list`
3. Check the Python service is running on port 5000
4. Ensure no firewall is blocking the connection

### Performance Issues

If generation is slow:

1. The gemma3:4b model provides a good balance of performance and quality
2. Ensure your system has enough RAM for the model (typically 8GB+ recommended)
3. Close other resource-intensive applications

### Model Not Found

If you get "model not found" errors:

```bash
ollama pull gemma3:4b
```

## Configuration

You can modify the model in `ollama_service.py`:

```python
ollama_service = OllamaService("gemma3:4b")  # Change model here
```

Available models can be found at: https://ollama.ai/library
