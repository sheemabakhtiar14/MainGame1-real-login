import requests
import json
import random
from typing import Dict, Any, List
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

class OllamaService:
    def __init__(self, model_name="gemma3:4b"):
        self.model_name = model_name
        self.base_url = "http://localhost:11434/api/generate"
        self.training_data = {
            'email': self._load_training_data('email_scams.txt'),
            'url': self._load_training_data('url_scams.txt')
        }
    
    def _load_training_data(self, filename: str) -> str:
        """Load training data from file"""
        try:
            training_data_path = os.path.join('training_data', filename)
            with open(training_data_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            print(f"Warning: {filename} not found. Using minimal examples.")
            if 'email' in filename:
                return "Example email scam: Urgent security alert requiring immediate action."
            else:
                return "Example URL scam: Fake domain mimicking legitimate service."
    
    def _call_ollama(self, prompt: str, context: str = "") -> str:
        """Make API call to Ollama"""
        full_prompt = f"{context}\n\n{prompt}" if context else prompt
        
        payload = {
            "model": self.model_name,
            "prompt": full_prompt,
            "stream": False,
            "options": {
                "temperature": 0.8,
                "top_p": 0.9,
                "max_tokens": 500
            }
        }
        
        try:
            response = requests.post(self.base_url, json=payload, timeout=30)
            if response.status_code == 200:
                result = response.json()
                return result.get('response', '').strip()
            else:
                return f"Error: Ollama API returned status {response.status_code}"
        except requests.exceptions.RequestException as e:
            return f"Error connecting to Ollama: {str(e)}"
    
    def generate_email_scam(self, level: int) -> Dict[str, Any]:
        """Generate email phishing scam based on training data and level"""
        difficulty_context = {
            1: "Create a basic, obvious email scam with clear red flags",
            2: "Create a moderately convincing email scam with some subtle red flags", 
            3: "Create a sophisticated, highly convincing email scam with minimal obvious red flags"
        }
        
        context = f"""
        Training Data Examples:
        {self.training_data['email']}
        
        Level {level} Difficulty: {difficulty_context.get(level, difficulty_context[1])}
        """
        
        prompt = f"""
        Generate a realistic email phishing scam for level {level} difficulty.
        
        Return ONLY a JSON object with this exact structure:
        {{
            "subject": "Email subject line",
            "sender": "sender@domain.com",
            "content": "Email body content",
            "isPhishing": true,
            "redFlags": ["flag1", "flag2", "flag3"],
            "explanation": "Why this is a phishing attempt"
        }}
        
        Make it realistic but clearly a scam for training purposes.
        """
        
        response = self._call_ollama(prompt, context)
        return self._parse_json_response(response, 'email', level)
    
    def generate_url_scam(self, level: int) -> Dict[str, Any]:
        """Generate URL phishing scam based on training data and level"""
        difficulty_context = {
            1: "Create an obviously fake URL with clear domain manipulation",
            2: "Create a moderately deceptive URL with subtle domain tricks",
            3: "Create a highly sophisticated URL that closely mimics legitimate sites"
        }
        
        context = f"""
        Training Data Examples:
        {self.training_data['url']}
        
        Level {level} Difficulty: {difficulty_context.get(level, difficulty_context[1])}
        """
        
        prompt = f"""
        Generate a realistic URL phishing scam for level {level} difficulty.
        
        Return ONLY a JSON object with this exact structure:
        {{
            "url": "https://fake-example.com/path",
            "description": "Description of what the URL claims to be",
            "legitimateUrl": "https://real-example.com",
            "isPhishing": true,
            "redFlags": ["flag1", "flag2", "flag3"],
            "explanation": "Why this URL is suspicious"
        }}
        
        Make it realistic but clearly a scam for training purposes.
        """
        
        response = self._call_ollama(prompt, context)
        return self._parse_json_response(response, 'url', level)
    
    def generate_feedback(self, user_answer: bool, is_correct: bool, scam_type: str, content: Dict[str, Any]) -> str:
        """Generate personalized feedback using LLM"""
        result = "correct" if is_correct else "incorrect"
        
        prompt = f"""
        A user just answered a {scam_type} phishing question {result}ly.
        
        User's answer: {"Identified as phishing" if user_answer else "Thought it was legitimate"}
        Correct answer: {"It was phishing" if content.get('isPhishing', True) else "It was legitimate"}
        
        Content details: {json.dumps(content, indent=2)}
        
        Generate encouraging, educational feedback that:
        1. Acknowledges their answer
        2. Explains key red flags they should look for
        3. Provides practical tips for the future
        4. Keeps it concise (2-3 sentences)
        
        Be supportive and educational.
        """
        
        response = self._call_ollama(prompt)
        return response if response and not response.startswith("Error") else self._get_fallback_feedback(is_correct, scam_type)
    
    def _parse_json_response(self, response: str, scam_type: str, level: int) -> Dict[str, Any]:
        """Parse JSON response from LLM with fallback"""
        try:
            # Try to extract JSON from the response
            if '{' in response and '}' in response:
                start = response.find('{')
                end = response.rfind('}') + 1
                json_str = response[start:end]
                return json.loads(json_str)
        except (json.JSONDecodeError, ValueError):
            pass
        
        # Fallback to generated content
        return self._generate_fallback_content(scam_type, level)
    
    def _generate_fallback_content(self, scam_type: str, level: int) -> Dict[str, Any]:
        """Generate fallback content if LLM fails"""
        if scam_type == 'email':
            return {
                "subject": f"Urgent: Account Verification Required - Level {level}",
                "sender": f"security@fake-bank-{level}.com",
                "content": f"Your account requires immediate verification. Click here to verify or your account will be suspended.",
                "isPhishing": True,
                "redFlags": ["Urgency tactics", "Suspicious domain", "Threatening language"],
                "explanation": "This email uses pressure tactics and a fake domain to steal credentials."
            }
        else:  # URL
            return {
                "url": f"https://bank-0f-america-{level}.com/verify",
                "description": "Bank account verification page",
                "legitimateUrl": "https://bankofamerica.com",
                "isPhishing": True,
                "redFlags": ["Domain spoofing", "Zero instead of 'o'", "Suspicious verification page"],
                "explanation": "This URL uses character substitution to mimic a legitimate banking site."
            }
    
    def _get_fallback_feedback(self, is_correct: bool, scam_type: str) -> str:
        """Provide fallback feedback if LLM fails"""
        if is_correct:
            return f"Great job! You correctly identified this {scam_type} scam. Keep looking for red flags like suspicious domains and urgent language."
        else:
            return f"Not quite right. This was a {scam_type} scam. Look for red flags like misspelled domains, urgent language, and requests for personal information."

# Initialize the service
ollama_service = OllamaService("gemma3:4b")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "model": ollama_service.model_name})

@app.route('/generate/email', methods=['POST'])
def generate_email():
    """Generate email phishing scam"""
    data = request.get_json()
    level = data.get('level', 1)
    
    result = ollama_service.generate_email_scam(level)
    return jsonify(result)

@app.route('/generate/url', methods=['POST'])
def generate_url():
    """Generate URL phishing scam"""
    data = request.get_json()
    level = data.get('level', 1)
    
    result = ollama_service.generate_url_scam(level)
    return jsonify(result)

@app.route('/feedback', methods=['POST'])
def generate_feedback():
    """Generate personalized feedback"""
    data = request.get_json()
    user_answer = data.get('userAnswer')
    is_correct = data.get('isCorrect')
    scam_type = data.get('scamType')
    content = data.get('content', {})
    
    feedback = ollama_service.generate_feedback(user_answer, is_correct, scam_type, content)
    return jsonify({"feedback": feedback})

@app.route('/generate/email/bulk', methods=['POST'])
def generate_email_bulk():
    """Generate multiple email phishing scams for all levels"""
    try:
        emails_by_level = {}
        
        # Generate 3 emails for each of the 3 levels
        for level in range(1, 4):
            emails = []
            for i in range(3):
                email = ollama_service.generate_email_scam(level)
                emails.append(email)
            emails_by_level[level] = emails
        
        return jsonify({"emails_by_level": emails_by_level})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generate/url/bulk', methods=['POST'])
def generate_url_bulk():
    """Generate multiple URL phishing scams for all levels"""
    try:
        urls_by_level = {}
        
        # Generate 3 URLs for each of the 3 levels
        for level in range(1, 4):
            urls = []
            for i in range(3):
                url = ollama_service.generate_url_scam(level)
                urls.append(url)
            urls_by_level[level] = urls
            
        return jsonify({"urls_by_level": urls_by_level})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Ollama Phishing Simulation Service...")
    print(f"Using model: {ollama_service.model_name}")
    print("Make sure Ollama is running with: ollama serve")
    app.run(host='0.0.0.0', port=5000, debug=True)
