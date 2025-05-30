// Offline scam safety knowledge base - always works, no API needed
interface ScamKnowledge {
  keywords: string[];
  response: string;
}

const SCAM_KNOWLEDGE_BASE: ScamKnowledge[] = [
  {
    keywords: ["otp", "pin", "password", "cvv"],
    response: `🚨 *OTP/PIN Safety Rules:*

• *NEVER share OTP* with anyone - even "bank officials"
• Real banks *NEVER ask for OTP* over phone
• Scammers call pretending to be from your bank
• If asked for OTP, *hang up immediately*

🛡 *Remember:* You are the only one who should enter your OTP`,
  },
  {
    keywords: ["phishing", "email", "link", "suspicious"],
    response: `🔍 *Phishing Email Red Flags:*

• Urgent language: "Act now!", "Account suspended"
• Generic greetings: "Dear customer" instead of your name
• Suspicious sender addresses
• Grammar/spelling mistakes
• Asks for passwords/personal info

🛡 *Action:* Don't click links, visit official website directly`,
  },
  {
    keywords: ["investment", "money", "profit", "returns", "scheme"],
    response: `💰 *Investment Scam Warning Signs:*

• *Guaranteed high returns* (10%+ monthly)
• Pressure to invest immediately
• Celebrity endorsements (often fake)
• Unregistered investment schemes
• "Get rich quick" promises

🛡 *Action:* Check company with SEBI before investing`,
  },
  {
    keywords: ["call", "phone", "caller", "bank official"],
    response: `📞 *Phone Scam Prevention:*

• Banks *don't call* asking for card details
• Never give CVV/expiry date over phone
• Scammers use caller ID spoofing
• "Verify account" calls are usually fake

🛡 *Action:* Hang up, call bank using number on your card`,
  },
  {
    keywords: ["whatsapp", "social media", "facebook", "instagram"],
    response: `💬 *Social Media Scam Alerts:*

• Fake customer care accounts
• "You've won a prize" messages
• Friend's account asking for money
• Fake job offers with advance fees

🛡 *Action:* Verify through official channels, not social media`,
  },
  {
    keywords: ["job", "work from home", "earn money", "part time"],
    response: `💼 *Job Scam Red Flags:*

• Asks for money upfront
• "Earn ₹5000 daily from home"
• No interview process
• Data entry/copy-paste jobs
• Payment before starting work

🛡 *Action:* Real jobs never ask for money first`,
  },
  {
    keywords: ["latest", "recent", "new", "trending", "current"],
    response: `🆕 *Latest Scam Trends in India 2025:*

• *Digital arrest scams* - fake police calls
• *AI voice cloning* - fake family emergency calls
• *QR code frauds* - malicious payment links
• *Fake UPI apps* - stealing banking credentials

🛡 *Stay updated:* Follow @CyberDost on Twitter`,
  },
  {
    keywords: ["report", "help", "victim", "scammed", "fraud"],
    response: `🆘 *If You've Been Scammed:*

• *Immediately:* Call your bank to block cards
• *Report:* File complaint on cybercrime.gov.in
• *Call:* 1930 (National Cybercrime Helpline)
• *Document:* Save all evidence (messages, calls, receipts)

⏰ *Time is critical* - act within 24 hours for best recovery chances`,
  },
];

class OfflineScamBot {
  findBestResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Find matching knowledge based on keywords
    for (const knowledge of SCAM_KNOWLEDGE_BASE) {
      if (
        knowledge.keywords.some((keyword) => lowerMessage.includes(keyword))
      ) {
        return knowledge.response;
      }
    }

    // Default response if no specific match
    return `🛡 *General Scam Prevention Tips:*

• *Never share:* OTP, PIN, passwords, CVV
• *Verify independently:* Call official numbers
• *Be skeptical:* If it sounds too good to be true, it probably is
• *Report scams:* Call 1930 or visit cybercrime.gov.in

*Ask me about:* OTP safety, phishing emails, investment scams, phone fraud, job scams, or how to report scams`;
  }

  async sendMessage(message: string): Promise<string> {
    // Simulate slight delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.findBestResponse(message);
  }

  async resetChat() {
    // Nothing to reset for offline bot
  }
}

export default new OfflineScamBot();