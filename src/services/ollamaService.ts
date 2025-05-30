const OLLAMA_API_BASE = "http://localhost:5000";

interface EmailScam {
  subject: string;
  sender: string;
  content: string;
  isPhishing: boolean;
  redFlags?: string[];
  trustIndicators?: string[];
  explanation: string;
}

interface URLScam {
  url: string;
  description: string;
  legitimateUrl: string;
  isPhishing: boolean;
  redFlags?: string[];
  trustIndicators?: string[];
  explanation: string;
}

interface FeedbackRequest {
  userAnswer: boolean;
  isCorrect: boolean;
  scamType: "email" | "url";
  content: EmailScam | URLScam;
}

class OllamaService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async makeRequest(endpoint: string, data?: any): Promise<any> {
    try {
      const response = await fetch(`${OLLAMA_API_BASE}${endpoint}`, {
        method: data ? "POST" : "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      throw new Error(
        `Failed to connect to Ollama service. Make sure the Python service is running on port 5000.`
      );
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await this.makeRequest("/health");
      return response.status === "healthy"; // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      return false;
    }
  }

  async generateEmailScam(level: number): Promise<EmailScam> {
    const response = await this.makeRequest("/generate/email", { level });
    return response;
  }

  async generateEmailScamsBulk(): Promise<{ [key: number]: EmailScam[] }> {
    const response = await this.makeRequest("/generate/email/bulk", {});
    return response.emails_by_level;
  }

  async generateURLScam(level: number): Promise<URLScam> {
    const response = await this.makeRequest("/generate/url", { level });
    return response;
  }

  async generateURLScamsBulk(): Promise<{ [key: number]: URLScam[] }> {
    const response = await this.makeRequest("/generate/url/bulk", {});
    return response.urls_by_level;
  }

  async generateFeedback(request: FeedbackRequest): Promise<string> {
    const response = await this.makeRequest("/feedback", request);
    return response.feedback;
  }
}

export const ollamaService = new OllamaService();
export type { EmailScam, URLScam, FeedbackRequest };
