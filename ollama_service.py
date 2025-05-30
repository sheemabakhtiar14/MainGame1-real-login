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
            'url': self._load_training_data('url_scams.txt'),
            'legitimate_email': self._load_training_data('legitimate_emails.txt'),
            'legitimate_url': self._load_training_data('legitimate_urls.txt')
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
        elif scam_type == 'email_legitimate':
            return {
                "subject": f"Monthly Newsletter - Company Updates",
                "sender": f"newsletter@company.com",
                "content": f"Here's your monthly company update with recent news and updates. We've added new features and improved security.",
                "isPhishing": False,
                "trustIndicators": ["Legitimate domain", "No urgent requests", "Clear sender identity", "Professional tone"],
                "explanation": "This email comes from a legitimate company domain with no suspicious requests."
            }
        elif scam_type == 'url_legitimate':
            return {
                "url": f"https://www.microsoft.com/security",
                "description": "Microsoft official security information page",
                "legitimateUrl": "https://www.microsoft.com/security",
                "isPhishing": False,
                "trustIndicators": ["Official domain", "HTTPS encryption", "Clear path structure", "Well-known company"],
                "explanation": "This URL is from the official Microsoft domain with proper security and clear structure."
            }
        else:  # URL scam
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
    
    def generate_legitimate_email(self, level: int) -> Dict[str, Any]:
        """Generate legitimate email for educational comparison"""
        legitimate_contexts = {
            1: "Create a simple, clearly legitimate business email with obvious trust indicators",
            2: "Create a professional legitimate email with proper security practices", 
            3: "Create a sophisticated legitimate email that demonstrates best security practices"
        }
        
        context = f"""
        Training Data Examples:
        {self.training_data.get('legitimate_email', 'No training data available')}
        
        Level {level} Difficulty: {legitimate_contexts.get(level, legitimate_contexts[1])}
        """
        
        prompt = f"""
        Generate a legitimate, safe business email for level {level} educational purposes.
        This should demonstrate what a REAL, SAFE email looks like.
        
        Return ONLY a JSON object with this exact structure:
        {{
            "subject": "Email subject line",
            "sender": "sender@legitimate-domain.com",
            "content": "Email body content",
            "isPhishing": false,
            "trustIndicators": ["indicator1", "indicator2", "indicator3"],
            "explanation": "Why this email is legitimate and safe"
        }}
        
        Focus on: proper domains, no urgency tactics, clear sender identity, no suspicious links.
        {legitimate_contexts.get(level, legitimate_contexts[1])}
        """
        
        response = self._call_ollama(prompt, context)
        result = self._parse_json_response(response, 'email_legitimate', level)
        result['isPhishing'] = False  # Ensure this is set correctly
        return result

    def generate_legitimate_url(self, level: int) -> Dict[str, Any]:
        """Generate legitimate URL for educational comparison"""
        legitimate_contexts = {
            1: "Create a simple, clearly legitimate website URL with obvious trust indicators",
            2: "Create a professional legitimate URL with proper security practices", 
            3: "Create a sophisticated legitimate URL that demonstrates best security practices"
        }
        
        context = f"""
        Training Data Examples:
        {self.training_data.get('legitimate_url', 'No training data available')}
        
        Level {level} Difficulty: {legitimate_contexts.get(level, legitimate_contexts[1])}
        """
        
        prompt = f"""
        Generate a legitimate, safe website URL for level {level} educational purposes.
        This should demonstrate what a REAL, SAFE URL looks like.
        
        Return ONLY a JSON object with this exact structure:
        {{
            "url": "https://legitimate-domain.com/path",
            "description": "What this URL actually is",
            "legitimateUrl": "https://legitimate-domain.com/path",
            "isPhishing": false,
            "trustIndicators": ["indicator1", "indicator2", "indicator3"],
            "explanation": "Why this URL is legitimate and safe"
        }}
        
        Focus on: proper HTTPS, legitimate domains, clear paths, official company URLs.
        {legitimate_contexts.get(level, legitimate_contexts[1])}
        """
        
        response = self._call_ollama(prompt, context)
        result = self._parse_json_response(response, 'url_legitimate', level)
        result['isPhishing'] = False  # Ensure this is set correctly
        return result

    def generate_email_content(self, level: int, is_scam: bool) -> Dict[str, Any]:
        """Generate either scam or legitimate email based on is_scam parameter"""
        if is_scam:
            return self.generate_email_scam(level)
        else:
            return self.generate_legitimate_email(level)

    def generate_url_content(self, level: int, is_scam: bool) -> Dict[str, Any]:
        """Generate either scam or legitimate URL based on is_scam parameter"""
        if is_scam:
            return self.generate_url_scam(level)
        else:
            return self.generate_legitimate_url(level)

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
    """Generate multiple emails (mix of legitimate and scam) for all levels"""
    try:
        emails_by_level = {}
        
        # Generate mixed content for each level (2 scams, 1 legitimate per level)
        for level in range(1, 4):
            emails = []
            
            # Generate 2 scam emails
            for i in range(2):
                email = ollama_service.generate_email_content(level, is_scam=True)
                emails.append(email)
            
            # Generate 1 legitimate email
            legitimate_email = ollama_service.generate_email_content(level, is_scam=False)
            emails.append(legitimate_email)
            
            # Shuffle to randomize order
            random.shuffle(emails)
            emails_by_level[level] = emails
        
        return jsonify({"emails_by_level": emails_by_level})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generate/url/bulk', methods=['POST'])
def generate_url_bulk():
    """Generate multiple URLs (mix of legitimate and scam) for all levels"""
    try:
        urls_by_level = {}
        
        # Generate mixed content for each level (2 scams, 1 legitimate per level)
        for level in range(1, 4):
            urls = []
            
            # Generate 2 scam URLs
            for i in range(2):
                url = ollama_service.generate_url_content(level, is_scam=True)
                urls.append(url)
            
            # Generate 1 legitimate URL
            legitimate_url = ollama_service.generate_url_content(level, is_scam=False)
            urls.append(legitimate_url)
            
            # Shuffle to randomize order
            random.shuffle(urls)
            urls_by_level[level] = urls
            
        return jsonify({"urls_by_level": urls_by_level})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Ollama Phishing Simulation Service...")
    print(f"Using model: {ollama_service.model_name}")
    print("Make sure Ollama is running with: ollama serve")
    app.run(host='0.0.0.0', port=5000, debug=True)
