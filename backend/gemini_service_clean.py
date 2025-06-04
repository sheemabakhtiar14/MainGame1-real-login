import json
import random
import os
import time
from typing import Dict, Any, List
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

class OptimizedGeminiService:
    def __init__(self, model_name="gemini-1.5-pro"):
        self.model_name = model_name
        self.api_key = os.getenv('GEMINI_API_KEY')
        self.backup_api_key = os.getenv('GEMINI_API_KEY_BACKUP')
        
        # Quota optimization settings - API-only mode
        self.api_call_count = 0
        self.max_api_calls_per_hour = 100  # Increased limit since we're only using API
        self.cache = {}  # Simple in-memory cache for efficiency
        self.last_reset_time = time.time()
        self.current_key_index = 0  # For rotating between API keys
        
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")
        
        # Initialize with primary key
        self.api_keys = [self.api_key]
        if self.backup_api_key:
            self.api_keys.append(self.backup_api_key)
        
        try:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(model_name)
            self.current_key = "primary"
            print(f"✅ Initialized API-Only Gemini {model_name} with primary API key")
            print(f"🔒 API call limit: {self.max_api_calls_per_hour} calls/hour")
            print(f"🔄 Available API keys: {len(self.api_keys)}")
        except Exception as e:
            if self.backup_api_key:
                print(f"⚠️ Primary key failed, trying backup key...")
                genai.configure(api_key=self.backup_api_key)
                self.model = genai.GenerativeModel(model_name)
                self.current_key = "backup"
                print(f"✅ Initialized API-Only Gemini {model_name} with backup API key")
            else:
                raise ValueError(f"Failed to initialize Gemini API: {str(e)}")
        
        print(f"🚀 API-Only mode enabled - all content generated via Gemini API")
    
    def _reset_api_counter_if_needed(self):
        """Reset API counter every hour"""
        current_time = time.time()
        if current_time - self.last_reset_time >= 3600:  # 1 hour
            self.api_call_count = 0
            self.last_reset_time = current_time
            print("🔄 API call counter reset")
    
    def _rotate_api_key_if_needed(self):
        """Rotate to next API key if current one is exhausted"""
        if self.api_call_count >= (self.max_api_calls_per_hour // len(self.api_keys)):
            if len(self.api_keys) > 1:
                self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
                new_key = self.api_keys[self.current_key_index]
                genai.configure(api_key=new_key)
                self.model = genai.GenerativeModel(self.model_name)
                self.api_call_count = 0  # Reset counter for new key
                print(f"🔄 Rotated to API key {self.current_key_index + 1}")
    
    def _call_gemini_api(self, prompt: str, context: str = "") -> str:
        """Make optimized API call to Gemini with key rotation and caching"""
        # Check and reset counters
        self._reset_api_counter_if_needed()
        
        # Create cache key
        cache_key = hash(prompt + context)
        if cache_key in self.cache:
            print("📋 Using cached response")
            return self.cache[cache_key]
        
        # Check if we need to rotate keys
        self._rotate_api_key_if_needed()
        
        full_prompt = f"{context}\n\n{prompt}" if context else prompt
        
        try:
            self.api_call_count += 1
            print(f"🔄 Making API call ({self.api_call_count}/{self.max_api_calls_per_hour})")
            
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,  # Balanced creativity
                    top_p=0.8,       # Focused responses
                    max_output_tokens=400,  # Sufficient for detailed content
                )
            )
            
            result = response.text.strip()
            # Cache the response for future use
            self.cache[cache_key] = result
            return result
            
        except Exception as e:
            print(f"❌ API call failed: {str(e)}")
            # Try rotating to next key if available
            if len(self.api_keys) > 1:
                self._rotate_api_key_if_needed()
                try:
                    response = self.model.generate_content(full_prompt)
                    result = response.text.strip()
                    self.cache[cache_key] = result
                    return result
                except Exception as e2:
                    print(f"❌ Backup API call also failed: {str(e2)}")
            
            raise Exception(f"All API calls failed: {str(e)}")
    
    def _parse_json_response(self, response: str, scam_type: str, level: int) -> Dict[str, Any]:
        """Parse JSON response from Gemini API"""
        try:
            # Try to extract JSON from the response
            if '{' in response and '}' in response:
                start = response.find('{')
                end = response.rfind('}') + 1
                json_str = response[start:end]
                parsed = json.loads(json_str)
                
                # Ensure required fields are present
                if scam_type in ['email', 'email_legitimate']:
                    required_fields = ['subject', 'sender', 'content', 'explanation']
                    if all(field in parsed for field in required_fields):
                        return parsed
                elif scam_type in ['url', 'url_legitimate']:
                    required_fields = ['url', 'description', 'explanation']
                    if all(field in parsed for field in required_fields):
                        return parsed
                        
        except (json.JSONDecodeError, ValueError) as e:
            print(f"⚠️ JSON parsing failed: {e}")
        
        # If parsing fails, create a structured response from the text
        return self._create_structured_response_from_text(response, scam_type, level)
    
    def _create_structured_response_from_text(self, response: str, scam_type: str, level: int) -> Dict[str, Any]:
        """Create structured response from raw text when JSON parsing fails"""
        # Fallback to basic structure with the AI's text response
        if scam_type in ['email', 'email_legitimate']:
            is_phishing = scam_type == 'email'
            return {
                "subject": f"Generated Email - Level {level}",
                "sender": f"example@{'fake-domain' if is_phishing else 'company'}.com",
                "content": response[:200],  # Use first 200 chars of response
                "isPhishing": is_phishing,
                "redFlags" if is_phishing else "trustIndicators": ["Generated from AI response"],
                "explanation": f"AI-generated content for level {level}"
            }
        else:  # URL types
            is_phishing = scam_type == 'url'
            return {
                "url": f"https://{'fake-site' if is_phishing else 'legitimate-site'}.com",
                "description": response[:150],  # Use first 150 chars of response
                "legitimateUrl": "https://legitimate-site.com",
                "isPhishing": is_phishing,
                "redFlags" if is_phishing else "trustIndicators": ["Generated from AI response"],
                "explanation": f"AI-generated content for level {level}"
            }
    
    def generate_email_scam(self, level: int) -> Dict[str, Any]:
        """Generate email phishing scam using Gemini API"""
        print(f"🔍 Generating email scam (level {level}) via API")
        
        difficulty_context = {
            1: "Create a basic, obvious email scam with clear red flags",
            2: "Create a moderately convincing email scam with some subtle red flags", 
            3: "Create a sophisticated, highly convincing email scam with minimal obvious red flags"
        }
        
        prompt = f"""
        Generate a realistic email phishing scam for level {level} difficulty.
        {difficulty_context.get(level, difficulty_context[1])}
        
        Return ONLY a JSON object with this exact structure:
        {{
            "subject": "Email subject line",
            "sender": "sender@domain.com",
            "content": "Email body content (150-200 words)",
            "isPhishing": true,
            "redFlags": ["flag1", "flag2", "flag3"],
            "explanation": "Why this is a phishing attempt (50-80 words)"
        }}
        
        Make it realistic but clearly a scam for educational purposes.
        Focus on common tactics like urgency, fake domains, impersonation.
        """
        
        response = self._call_gemini_api(prompt)
        return self._parse_json_response(response, 'email', level)
    
    def generate_url_scam(self, level: int) -> Dict[str, Any]:
        """Generate URL phishing scam using Gemini API"""
        print(f"🔍 Generating URL scam (level {level}) via API")
        
        difficulty_context = {
            1: "Create an obviously fake URL with clear domain manipulation",
            2: "Create a moderately deceptive URL with subtle domain tricks",
            3: "Create a highly sophisticated URL that closely mimics legitimate sites"
        }
        
        prompt = f"""
        Generate a realistic URL phishing scam for level {level} difficulty.
        {difficulty_context.get(level, difficulty_context[1])}
        
        Return ONLY a JSON object with this exact structure:
        {{
            "url": "https://fake-example.com/path",
            "description": "Description of what the URL claims to be (100-150 words)",
            "legitimateUrl": "https://real-example.com",
            "isPhishing": true,
            "redFlags": ["flag1", "flag2", "flag3"],
            "explanation": "Why this URL is suspicious (50-80 words)"
        }}
        
        Make it realistic but clearly a scam for training purposes.
        Focus on domain spoofing, typosquatting, subdomain tricks.
        """
        
        response = self._call_gemini_api(prompt)
        return self._parse_json_response(response, 'url', level)
    
    def generate_legitimate_email(self, level: int) -> Dict[str, Any]:
        """Generate legitimate email using Gemini API"""
        print(f"🔍 Generating legitimate email (level {level}) via API")
        
        legitimate_contexts = {
            1: "Create a simple, clearly legitimate business email with obvious trust indicators",
            2: "Create a professional legitimate email with proper security practices", 
            3: "Create a sophisticated legitimate email that demonstrates best security practices"
        }
        
        prompt = f"""
        Generate a legitimate, safe business email for level {level} educational purposes.
        {legitimate_contexts.get(level, legitimate_contexts[1])}
        
        Return ONLY a JSON object with this exact structure:
        {{
            "subject": "Email subject line",
            "sender": "sender@legitimate-domain.com",
            "content": "Email body content (150-200 words)",
            "isPhishing": false,
            "trustIndicators": ["indicator1", "indicator2", "indicator3"],
            "explanation": "Why this email is legitimate and safe (50-80 words)"
        }}
        
        Focus on: proper domains, no urgency tactics, clear sender identity, no suspicious links.
        """
        
        response = self._call_gemini_api(prompt)
        result = self._parse_json_response(response, 'email_legitimate', level)
        result['isPhishing'] = False  # Ensure this is set correctly
        return result
    
    def generate_legitimate_url(self, level: int) -> Dict[str, Any]:
        """Generate legitimate URL using Gemini API"""
        print(f"🔍 Generating legitimate URL (level {level}) via API")
        
        legitimate_contexts = {
            1: "Create a simple, clearly legitimate website URL with obvious trust indicators",
            2: "Create a professional legitimate URL with proper security practices", 
            3: "Create a sophisticated legitimate URL that demonstrates best security practices"
        }
        
        prompt = f"""
        Generate a legitimate, safe website URL for level {level} educational purposes.
        {legitimate_contexts.get(level, legitimate_contexts[1])}
        
        Return ONLY a JSON object with this exact structure:
        {{
            "url": "https://legitimate-domain.com/path",
            "description": "What this URL actually is (100-150 words)",
            "legitimateUrl": "https://legitimate-domain.com/path",
            "isPhishing": false,
            "trustIndicators": ["indicator1", "indicator2", "indicator3"],
            "explanation": "Why this URL is legitimate and safe (50-80 words)"
        }}
        
        Focus on: proper HTTPS, legitimate domains, clear paths, official company URLs.
        """
        
        response = self._call_gemini_api(prompt)
        result = self._parse_json_response(response, 'url_legitimate', level)
        result['isPhishing'] = False  # Ensure this is set correctly
        return result
    
    def generate_feedback(self, user_answer: bool, is_correct: bool, scam_type: str, content: Dict[str, Any]) -> str:
        """Generate personalized feedback using Gemini API"""
        print(f"🔍 Generating feedback via API")
        
        prompt = f"""
        Generate personalized feedback for a phishing simulation educational game.
        
        User's answer: {"Correct" if is_correct else "Incorrect"}
        Content type: {scam_type}
        
        Provide constructive feedback in 2-3 sentences that:
        - Acknowledges their answer
        - Explains key red flags or trust indicators they should look for
        - Encourages continued learning
        
        Keep it educational and supportive.
        """
        
        try:
            response = self._call_gemini_api(prompt)
            return response if response else self._get_simple_feedback(is_correct, scam_type)
        except Exception as e:
            print(f"❌ Feedback generation failed: {e}")
            return self._get_simple_feedback(is_correct, scam_type)
    
    def _get_simple_feedback(self, is_correct: bool, scam_type: str) -> str:
        """Provide simple feedback when API fails"""
        if is_correct:
            return f"Great job! You correctly identified this {scam_type}. Keep looking for red flags like suspicious domains and urgent language."
        else:
            return f"Not quite right. This was a {scam_type}. Look for red flags like misspelled domains, urgent language, and requests for personal information."
    
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

# Initialize the optimized service
gemini_service = OptimizedGeminiService("gemini-1.5-pro")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy", 
        "model": gemini_service.model_name,
        "api_calls_used": gemini_service.api_call_count,
        "api_calls_limit": gemini_service.max_api_calls_per_hour,
        "mode": "API-only"
    })

@app.route('/generate/email', methods=['POST'])
def generate_email():
    """Generate email phishing scam"""
    data = request.get_json()
    level = data.get('level', 1)
    
    result = gemini_service.generate_email_scam(level)
    return jsonify(result)

@app.route('/generate/url', methods=['POST'])
def generate_url():
    """Generate URL phishing scam"""
    data = request.get_json()
    level = data.get('level', 1)
    
    result = gemini_service.generate_url_scam(level)
    return jsonify(result)

@app.route('/feedback', methods=['POST'])
def generate_feedback():
    """Generate personalized feedback"""
    data = request.get_json()
    user_answer = data.get('userAnswer')
    is_correct = data.get('isCorrect')
    scam_type = data.get('scamType')
    content = data.get('content', {})
    
    feedback = gemini_service.generate_feedback(user_answer, is_correct, scam_type, content)
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
                email = gemini_service.generate_email_content(level, is_scam=True)
                emails.append(email)
            
            # Generate 1 legitimate email
            legitimate_email = gemini_service.generate_email_content(level, is_scam=False)
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
                url = gemini_service.generate_url_content(level, is_scam=True)
                urls.append(url)
            
            # Generate 1 legitimate URL
            legitimate_url = gemini_service.generate_url_content(level, is_scam=False)
            urls.append(legitimate_url)
            
            # Shuffle to randomize order
            random.shuffle(urls)
            urls_by_level[level] = urls
            
        return jsonify({"urls_by_level": urls_by_level})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting API-Only Gemini Phishing Simulation Service...")
    print(f"📊 Using model: {gemini_service.model_name}")
    print(f"📱 API calls limit: {gemini_service.max_api_calls_per_hour}/hour")
    print(f"🔄 Available API keys: {len(gemini_service.api_keys)}")
    print("🔥 All content generated via Gemini API calls")
    print("Make sure to set GEMINI_API_KEY environment variable")
    app.run(host='0.0.0.0', port=5000, debug=True)
