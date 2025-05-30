import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
} from "@google/generative-ai";
import offlineScamBot from "./offlineScamBot";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL_NAME || "gemini-1.5-flash";

const SYSTEM_PROMPT = `You are an expert digital safety advisor specialized in scam awareness, fraud detection, and public education about scams in India.

Your job is to **educate users about how to identify, avoid, and respond to scams**, including online, phone, investment, banking, romance, and cyber scams. All your responses must be accurate, recent, and highly focused on:
- 🚨 Common red flags in scam messages, emails, calls, and websites
- 🔍 Techniques scammers use (e.g., phishing, social engineering, OTP fraud, job scams, fake tech support)
- 🛡️ Prevention and response steps if someone suspects a scam or has been scammed
- 🗺️ Latest scam trends and news in India (including regional/state-level examples, if available)
- 📍 City-specific or state-specific scam alerts, if requested (e.g., Delhi, Mumbai, Bangalore, Chennai, etc.)

When a user asks a question, respond with a concise and direct answer—just enough to address their query clearly. After the initial response, ask: "Would you like me to elaborate?"

If the user says yes, provide a more detailed, in-depth explanation.
If the user says no, do not expand further.

The goal is to keep responses brief and to the point unless the user explicitly asks for more detail.

Always cite **only reliable, verified information**. Keep answers **clear, educational, and up-to-date**, especially in fast-changing scam patterns.

You may also use examples, checklists, and bullet points to make your advice easy to understand.

If unsure or outdated about any topic, say:  
*"This information may be outdated — please verify with official sources like RBI, Cybercrime.gov.in, or local police advisories."*

Never give vague or speculative answers. Stick to the facts. Be professional, helpful, and focused.`;

class ChatbotService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private chatSession: ChatSession | null = null;

  constructor() {
    console.log("🔮 Initializing Gemini ChatbotService...");
    console.log(
      "🔑 API_KEY loaded:",
      API_KEY ? `${API_KEY.substring(0, 10)}...` : "Not found"
    );
    console.log("🤖 MODEL_NAME:", MODEL_NAME);

    if (!API_KEY) {
      throw new Error(
        "Gemini API key is not configured. Please check your environment variables."
      );
    }

    try {
      this.genAI = new GoogleGenerativeAI(API_KEY);
      this.model = this.genAI.getGenerativeModel({
        model: MODEL_NAME,
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        },
      });
      console.log("✅ Gemini AI model initialized successfully");
      console.log("🎉 Gemini chatbot is working");
    } catch (error) {
      console.error("❌ Error initializing Gemini AI:", error);
      throw error;
    }
  }

  async initializeChat() {
    if (!this.chatSession) {
      console.log("🚀 Starting new Gemini chat session...");
      this.chatSession = this.model.startChat({
        history: [],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        },
      });
      console.log("✅ Gemini chat session initialized");
    }
    return this.chatSession;
  }

  async sendMessage(message: string): Promise<string> {
    try {
      // Add validation
      if (!API_KEY) {
        throw new Error("API key is not configured");
      }

      if (!message.trim()) {
        throw new Error("Message cannot be empty");
      }

      console.log("📤 Sending to Gemini:", message.substring(0, 50) + "...");
      console.log("🤖 Using model:", MODEL_NAME);

      // Initialize or get existing chat session
      const chat = await this.initializeChat();

      // Send message and get response
      const result = await chat.sendMessage(message);
      const response = result.response;
      const responseText = response.text();

      console.log("📥 Gemini response received");
      console.log("📊 Response length:", responseText.length, "characters");
      console.log(
        "📝 Response preview:",
        responseText.substring(0, 100) + "..."
      );

      if (!responseText || responseText.trim().length === 0) {
        throw new Error("Empty response from Gemini API");
      }

      return responseText.trim();
    } catch (error: unknown) {
      console.error("💥 Gemini API Error:", error);
      console.log("🔄 Falling back to offline chatbot...");
      
      // Fallback to offline chatbot for guaranteed response
      try {
        const fallbackResponse = await offlineScamBot.sendMessage(message);
        console.log("✅ Offline chatbot responded successfully");
        return fallbackResponse;
      } catch (fallbackError) {
        console.error("❌ Offline chatbot also failed:", fallbackError);
        
        // Ultimate fallback - basic safety message
        return `I apologize, but I'm having trouble connecting right now. Here are some basic safety tips:

🚨 *Never share OTP, PIN, or passwords* with anyone
🛡 *Banks never ask for OTP* over phone/SMS  
📞 *Report scams to 1930* (cybercrime helpline)
🌐 *File complaints at cybercrime.gov.in*

Please try asking your question again in a moment.`;
      }
    }
  }

  async resetChat() {
    console.log("🔄 Resetting Gemini chat session...");
    this.chatSession = null;
    
    try {
      await this.initializeChat();
      console.log("✅ Gemini chat session reset complete");
    } catch (error) {
      console.error("❌ Failed to reset Gemini chat:", error);
    }
    
    // Also reset offline bot
    await offlineScamBot.resetChat();
  }
}

export default new ChatbotService();