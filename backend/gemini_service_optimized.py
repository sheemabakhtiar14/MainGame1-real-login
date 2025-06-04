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

# Expanded fallback email questions with more variety
FALLBACK_EMAIL_QUESTIONS = [
    # Level 1 - Basic/Obvious scams
    {
        "id": "email-1-1",
        "subject": "Your Amazon Order #38942 has been shipped",
        "sender": "amazon-shipping@amazonn.com",
        "content": """Dear Customer,

We are confirming that your recent order #38942 has been shipped and is on its way. You can track your package by clicking the link below.

[Track Your Package Now]

If you did not make this purchase, please click here to report unauthorized activity.

Thank you for shopping with Amazon!

Amazon Customer Service""",
        "level": 1,
        "isScam": True,
        "explanation": "This is a scam email. The sender's email domain is 'amazonn.com' (note the double 'n'), which is not Amazon's official domain. Legitimate Amazon emails come from domains like amazon.com or amazon.co.uk."
    },
    {
        "id": "email-1-2",
        "subject": "Your Netflix subscription has expired",
        "sender": "accounts@netflix-billing.com",
        "content": """Dear Valued Customer,

Your Netflix subscription has expired. To continue enjoying our services without interruption, please update your payment information immediately by clicking the link below.

[Update Payment Information]

If you fail to update your payment information within 24 hours, your account will be permanently deactivated.

Netflix Support Team""",
        "level": 1,
        "isScam": True,
        "explanation": "This is a scam email. Netflix only sends emails from the netflix.com domain, not 'netflix-billing.com'. Additionally, legitimate companies don't typically threaten to permanently deactivate accounts with such short notice."
    },
    {
        "id": "email-1-3",
        "subject": "Your PayPal account: action required",
        "sender": "service@paypal.com",
        "content": """Dear PayPal Customer,

We noticed some unusual activity in your account. To ensure your account security, we've temporarily limited some features.

Please review your recent transactions and verify your identity by logging into your account through our secure website.

Thank you for your cooperation.

PayPal Customer Service""",
        "level": 1,
        "isScam": False,
        "explanation": "This is a legitimate email. The sender's domain is the official PayPal domain (paypal.com), and the email doesn't contain urgent threats or demands. It also doesn't include suspicious links or attachments. However, it's still best to access your PayPal account directly through the app or by typing the URL manually rather than clicking any links."
    },
    # Level 2 - Moderately convincing scams
    {
        "id": "email-2-1",
        "subject": "URGENT: Your account has been compromised",
        "sender": "security-alert@appIe.com",
        "content": """URGENT SECURITY ALERT

Our security systems have detected unauthorized access to your Apple ID. Your account has been temporarily suspended.

To restore access to your account, verify your information by clicking on the link below:

[Restore Account Access]

If you don't verify within 24 hours, your account will be permanently deleted.

Apple Support Team""",
        "level": 2,
        "isScam": True,
        "explanation": "This is a scam email. The sender's domain 'appIe.com' uses a capital 'I' instead of a lowercase 'l' to mimic 'apple.com'. Also, legitimate companies like Apple don't threaten to delete your account if you don't respond within a short timeframe."
    },
    {
        "id": "email-2-2",
        "subject": "Your recent purchase from Best Buy",
        "sender": "order-confirmation@bestbuy.com",
        "content": """Thank you for your recent purchase from Best Buy!

Order Number: BB-29845731
Date: May 15, 2023

Items Purchased:
- Samsung 55" 4K Smart TV - $699.99
- 3-Year Protection Plan - $89.99

Total: $789.98

Your order is being processed and will be ready for pickup at your selected store within 2-3 business days. We'll email you when it's ready.

Best Buy Customer Service
1-888-BEST-BUY""",
        "level": 2,
        "isScam": False,
        "explanation": "This appears to be a legitimate email. It's from the official Best Buy domain, contains specific order details without requesting personal information, and provides the official Best Buy customer service number rather than an unusual contact method."
    },
    # Level 3 - Sophisticated scams
    {
        "id": "email-3-1",
        "subject": "Invoice #INV-4298: Payment Due",
        "sender": "accounting@microsoft-billing.net",
        "content": """Microsoft Subscription Services
Invoice #INV-4298

Dear Customer,

Your recent Microsoft subscription renewal has been processed. Please find the invoice attached for your records.

Subscription: Microsoft 365 Business Premium
Period: June 2023 - June 2024
Amount: $299.99

If you did not authorize this charge, please call our billing department at 1-888-555-0123 immediately.

Microsoft Billing Department""",
        "level": 3,
        "isScam": True,
        "explanation": "This is a scam email. Microsoft doesn't send emails from 'microsoft-billing.net' domain. Also, the phone number provided is not an official Microsoft support number. Microsoft typically sends billing information from microsoft.com or office.com domains."
    }
]

# Expanded fallback URL questions
FALLBACK_URL_QUESTIONS = [
    {
        "id": "url-1-1",
        "url": "www.paypa1.com/account/security",
        "description": "You received an email claiming your PayPal account has been compromised. It contains this link to verify your account details.",
        "level": 1,
        "isScam": True,
        "explanation": "This is a phishing URL. Notice that it uses the number '1' instead of the letter 'l' in 'paypa1.com'. The legitimate PayPal URL is 'paypal.com'. This subtle difference is a common phishing tactic designed to trick users who don't examine URLs carefully."
    },
    {
        "id": "url-1-2",
        "url": "https://www.amazon.com/gp/css/order-history",
        "description": "You want to check your recent orders on Amazon and found this link in your bookmarks.",
        "level": 1,
        "isScam": False,
        "explanation": "This is a legitimate Amazon URL. It uses the correct domain (amazon.com) and points to the order history page, which is a real section of the Amazon website. The URL structure is consistent with Amazon's website organization."
    },
    {
        "id": "url-2-1",
        "url": "https://facebook-securityalert.com/verify",
        "description": "You received a notification that someone tried to log into your Facebook account. This link was provided to secure your account.",
        "level": 2,
        "isScam": True,
        "explanation": "This is a phishing URL. Despite containing 'facebook' in the domain name, 'facebook-securityalert.com' is not owned by Facebook. Facebook would only use domains ending with 'facebook.com' (like security.facebook.com). Hyphenated domains that contain a brand name are often phishing attempts."
    },
    {
        "id": "url-3-1",
        "url": "https://secure-bankofamerica.com.logon.verify-account.mobi/login",
        "description": "You received an urgent email from Bank of America asking you to verify your account through this link.",
        "level": 3,
        "isScam": True,
        "explanation": "This is a sophisticated phishing URL. The actual domain is 'verify-account.mobi', not 'bankofamerica.com'. The scammer has placed 'bankofamerica.com' as a subdomain to confuse users. Legitimate Bank of America URLs would use 'bankofamerica.com' as the actual domain (like secure.bankofamerica.com)."
    },
    {
        "id": "url-3-2",
        "url": "https://signin.ebay.com/ws/eBayISAPI.dll?SignIn&ru=",
        "description": "You clicked on 'Sign In' from the eBay homepage and were directed to this URL.",
        "level": 3,
        "isScam": False,
        "explanation": "This is a legitimate eBay sign-in URL. It uses the correct domain (ebay.com) with a subdomain ('signin') that's appropriate for the login function. The URL structure with 'eBayISAPI.dll?SignIn' is consistent with eBay's actual website architecture for authentication."
    }
]

class OptimizedGeminiService:
    def __init__(self, model_name="gemini-1.5-pro"):
        self.model_name = model_name
        self.api_key = os.getenv('GEMINI_API_KEY')
        self.backup_api_key = os.getenv('GEMINI_API_KEY_BACKUP')
        
        # Quota optimization settings
        self.use_fallback_first = True  # Use realistic examples 95% of the time
        self.api_call_count = 0
        self.max_api_calls_per_hour = 20  # Very conservative limit
        self.cache = {}  # Simple in-memory cache
        self.fallback_ratio = 0.95  # 95% fallback, 5% API calls
        self.last_reset_time = time.time()
        
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")
        
        try:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(model_name)
            self.current_key = "primary"
            print(f"✅ Initialized Optimized Gemini {model_name} with primary API key")
            print(f"📊 Quota optimization: {self.fallback_ratio*100}% fallback ratio")
            print(f"🔒 API call limit: {self.max_api_calls_per_hour} calls/hour")
        except Exception as e:
            if self.backup_api_key:
                print(f"⚠️ Primary key failed, trying backup key...")
                genai.configure(api_key=self.backup_api_key)
                self.model = genai.GenerativeModel(model_name)
                self.current_key = "backup"
                print(f"✅ Initialized Optimized Gemini {model_name} with backup API key")
            else:
                raise ValueError(f"Failed to initialize Gemini API: {str(e)}")
        
        print(f"📦 Loaded {len(FALLBACK_EMAIL_QUESTIONS)} email examples")
        print(f"📦 Loaded {len(FALLBACK_URL_QUESTIONS)} URL examples")
    
    def _reset_api_counter_if_needed(self):
        """Reset API counter every hour"""
        current_time = time.time()
        if current_time - self.last_reset_time >= 3600:  # 1 hour
            self.api_call_count = 0
            self.last_reset_time = current_time
            print("🔄 API call counter reset")
    
    def _should_use_api(self) -> bool:
        """Determine if we should use API or fallback"""
        self._reset_api_counter_if_needed()
        
        # Always use fallback if we've hit the limit
        if self.api_call_count >= self.max_api_calls_per_hour:
            return False
            
        # Use fallback most of the time based on ratio
        return random.random() > self.fallback_ratio
    
    def generate_email_scam(self, level: int) -> Dict[str, Any]:
        """Generate email phishing scam - optimized with fallback-first approach"""
        print(f"🔍 Generating email scam (level {level})")
        return self._generate_fallback_content('email', level)
    
    def generate_url_scam(self, level: int) -> Dict[str, Any]:
        """Generate URL phishing scam - optimized with fallback-first approach"""
        print(f"🔍 Generating URL scam (level {level})")
        return self._generate_fallback_content('url', level)
    
    def generate_legitimate_email(self, level: int) -> Dict[str, Any]:
        """Generate legitimate email - optimized with fallback-first approach"""
        print(f"🔍 Generating legitimate email (level {level})")
        result = self._generate_fallback_content('email_legitimate', level)
        result['isPhishing'] = False
        return result
    
    def generate_legitimate_url(self, level: int) -> Dict[str, Any]:
        """Generate legitimate URL - optimized with fallback-first approach"""
        print(f"🔍 Generating legitimate URL (level {level})")
        result = self._generate_fallback_content('url_legitimate', level)
        result['isPhishing'] = False
        return result
    
    def _generate_fallback_content(self, scam_type: str, level: int) -> Dict[str, Any]:
        """Generate fallback content using realistic examples from frontend questions"""
        if scam_type == 'email':
            # Filter email questions by level and scam type
            email_scams = [q for q in FALLBACK_EMAIL_QUESTIONS if q['level'] == level and q['isScam']]
            if email_scams:
                selected = random.choice(email_scams)
                return {
                    "subject": selected['subject'],
                    "sender": selected['sender'],
                    "content": selected['content'],
                    "isPhishing": True,
                    "redFlags": self._extract_red_flags_from_explanation(selected['explanation']),
                    "explanation": selected['explanation']
                }
            
        elif scam_type == 'email_legitimate':
            # Filter legitimate email questions by level
            legitimate_emails = [q for q in FALLBACK_EMAIL_QUESTIONS if q['level'] == level and not q['isScam']]
            if legitimate_emails:
                selected = random.choice(legitimate_emails)
                return {
                    "subject": selected['subject'],
                    "sender": selected['sender'],
                    "content": selected['content'],
                    "isPhishing": False,
                    "trustIndicators": self._extract_trust_indicators_from_explanation(selected['explanation']),
                    "explanation": selected['explanation']
                }
                
        elif scam_type == 'url':
            # Filter URL questions by level and scam type
            url_scams = [q for q in FALLBACK_URL_QUESTIONS if q['level'] == level and q['isScam']]
            if url_scams:
                selected = random.choice(url_scams)
                return {
                    "url": selected['url'],
                    "description": selected['description'],
                    "legitimateUrl": self._extract_legitimate_url(selected['url'], selected['explanation']),
                    "isPhishing": True,
                    "redFlags": self._extract_red_flags_from_explanation(selected['explanation']),
                    "explanation": selected['explanation']
                }
                
        elif scam_type == 'url_legitimate':
            # Filter legitimate URL questions by level
            legitimate_urls = [q for q in FALLBACK_URL_QUESTIONS if q['level'] == level and not q['isScam']]
            if legitimate_urls:
                selected = random.choice(legitimate_urls)
                return {
                    "url": selected['url'],
                    "description": selected['description'],
                    "legitimateUrl": selected['url'],
                    "isPhishing": False,
                    "trustIndicators": self._extract_trust_indicators_from_explanation(selected['explanation']),
                    "explanation": selected['explanation']
                }
        
        # Fallback to simple content if no matching questions found
        return self._generate_simple_fallback_content(scam_type, level)
    
    def _extract_red_flags_from_explanation(self, explanation: str) -> List[str]:
        """Extract red flags from explanation text"""
        red_flags = []
        explanation_lower = explanation.lower()
        
        if 'double' in explanation_lower or 'extra' in explanation_lower:
            red_flags.append("Suspicious domain characters")
        if 'domain' in explanation_lower and ('fake' in explanation_lower or 'not' in explanation_lower):
            red_flags.append("Fake domain")
        if 'urgency' in explanation_lower or 'immediate' in explanation_lower:
            red_flags.append("Urgency tactics")
        if 'threat' in explanation_lower or 'delete' in explanation_lower or 'suspend' in explanation_lower:
            red_flags.append("Threatening language")
        if 'subdomain' in explanation_lower:
            red_flags.append("Suspicious subdomain")
        if 'character substitution' in explanation_lower or 'number' in explanation_lower:
            red_flags.append("Character substitution")
        if 'typo' in explanation_lower or 'misspelling' in explanation_lower:
            red_flags.append("Domain typosquatting")
            
        return red_flags if red_flags else ["Suspicious characteristics", "Impersonation attempt", "Social engineering"]
    
    def _extract_trust_indicators_from_explanation(self, explanation: str) -> List[str]:
        """Extract trust indicators from explanation text"""
        trust_indicators = []
        explanation_lower = explanation.lower()
        
        if 'official domain' in explanation_lower or 'legitimate' in explanation_lower:
            trust_indicators.append("Official domain")
        if 'https' in explanation_lower or 'secure' in explanation_lower:
            trust_indicators.append("Secure connection")
        if 'no urgent' in explanation_lower or 'no threat' in explanation_lower:
            trust_indicators.append("No pressure tactics")
        if 'professional' in explanation_lower:
            trust_indicators.append("Professional communication")
        if 'specific' in explanation_lower or 'detail' in explanation_lower:
            trust_indicators.append("Specific information")
            
        return trust_indicators if trust_indicators else ["Legitimate domain", "Professional tone", "No urgent requests"]
    
    def _extract_legitimate_url(self, fake_url: str, explanation: str) -> str:
        """Extract the legitimate URL from explanation"""
        explanation_lower = explanation.lower()
        
        if 'paypal.com' in explanation_lower:
            return "https://www.paypal.com"
        elif 'amazon.com' in explanation_lower:
            return "https://www.amazon.com"
        elif 'netflix.com' in explanation_lower:
            return "https://www.netflix.com"
        elif 'facebook.com' in explanation_lower:
            return "https://www.facebook.com"
        elif 'bankofamerica.com' in explanation_lower:
            return "https://www.bankofamerica.com"
        elif 'ebay.com' in explanation_lower:
            return "https://www.ebay.com"
        elif 'google.com' in explanation_lower:
            return "https://www.google.com"
        else:
            # Extract domain from fake URL and make it legitimate
            if 'paypa1' in fake_url:
                return "https://www.paypal.com"
            elif 'netf1ix' in fake_url:
                return "https://www.netflix.com"
            else:
                return "https://www.example.com"
    
    def _generate_simple_fallback_content(self, scam_type: str, level: int) -> Dict[str, Any]:
        """Generate simple fallback content as last resort"""
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
    
    def generate_feedback(self, user_answer: bool, is_correct: bool, scam_type: str, content: Dict[str, Any]) -> str:
        """Generate personalized feedback - mostly using fallback to save quota"""
        return self._get_fallback_feedback(is_correct, scam_type)
    
    def _get_fallback_feedback(self, is_correct: bool, scam_type: str) -> str:
        """Provide fallback feedback"""
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
        "fallback_ratio": gemini_service.fallback_ratio
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
    print("🚀 Starting Optimized Gemini Phishing Simulation Service...")
    print(f"📊 Using model: {gemini_service.model_name}")
    print(f"🔒 Quota optimization: {gemini_service.fallback_ratio*100}% fallback")
    print(f"📱 API calls limit: {gemini_service.max_api_calls_per_hour}/hour")
    print("Make sure to set GEMINI_API_KEY environment variable")
    app.run(host='0.0.0.0', port=5000, debug=True)
