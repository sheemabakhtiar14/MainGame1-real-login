import { useState, useRef, useEffect } from "react";
import chatbotService from "../services/chatbotService";
import { X, Send, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatbotProps {
  onClose: () => void;
}

interface Message {
  text: string;
  isUser: boolean;
}

const Chatbot = ({ onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text: "👋 Hi there! I'm ScamGuard AI, your digital safety expert. Ask me anything about scams, online safety, or how to protect yourself from fraud.",
          isUser: false,
        },
      ]);
    }
  }, [messages.length]);

  // Auto-scroll to bottom only for user messages or short bot messages
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    // Only scroll if last message is from user or bot message is short
    if (
      lastMsg.isUser ||
      (typeof lastMsg.text === "string" && lastMsg.text.length < 400)
    ) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    // For long bot messages, do not auto-scroll
  }, [messages]);

  // Show/hide scroll-to-bottom button for long content
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      // Show button if not at bottom (with a small threshold)
      setShowScrollButton(
        container.scrollHeight - container.scrollTop - container.clientHeight >
          80
      );
    };
    container.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }, []);

  const resetChat = async () => {
    await chatbotService.resetChat();
    setMessages([
      {
        text: "👋 Chat reset! I'm ScamGuard AI, your digital safety expert. How can I help you today?",
        isUser: false,
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    // Add user message to chat
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);

    // Show loading state
    setIsLoading(true);

    try {
      // Get response from chatbot service
      const response = await chatbotService.sendMessage(userMessage);

      // Add bot response to chat
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      console.error("Error getting chatbot response:", error);

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting. Please try again in a moment.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format message with paragraph and line breaks, and bold text
  const formatMessage = (text: string) => {
    // Split by double newlines for paragraphs
    const paragraphs = text.split(/\n{2,}/);
    return paragraphs.map((para, i) => {
      // Split by single newlines for line breaks
      const lines = para.split(/\n/);
      return (
        <p
          key={i}
          style={{ marginBottom: i < paragraphs.length - 1 ? "0.75em" : 0 }}
        >
          {lines.map((line, j) => {
            // Bold text between asterisks
            const boldFormatted = line.replace(
              /\*(.*?)\*/g,
              "<strong>$1</strong>"
            );
            return (
              <span
                key={j}
                dangerouslySetInnerHTML={{ __html: boldFormatted }}
              />
            );
          })}
          {i < paragraphs.length - 1 && <br />}
        </p>
      );
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 right-0 left-0 mx-auto w-full max-w-[420px] sm:max-w-[420px] md:right-6 md:left-auto md:bottom-24 md:w-80 md:sm:w-96 h-[70vh] max-h-[600px] bg-dark-800 rounded-t-xl md:rounded-xl shadow-2xl flex flex-col z-40 overflow-hidden border border-secondary-700"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="bg-secondary-700 text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="font-medium">ScamGuard AI</h3>
          </div>
          <div className="flex items-center">
            <button
              onClick={resetChat}
              className="text-white hover:text-secondary-300 mr-3 transition-colors"
              aria-label="Reset chat"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-secondary-300 transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 p-4 overflow-y-auto bg-dark-900 custom-scrollbar relative"
          style={{ scrollBehavior: "smooth" }}
        >
          {/* Scroll to bottom button */}
          {showScrollButton && (
            <button
              onClick={() =>
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="absolute right-4 bottom-4 bg-secondary-700 text-white rounded-full shadow-lg p-2 flex items-center justify-center animate-fade-in z-10 hover:bg-secondary-600 focus:outline-none"
              aria-label="Scroll to bottom"
              type="button"
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl shadow-md max-w-full break-words text-base font-sans transition-all duration-200 ${
                  msg.isUser
                    ? "bg-secondary-600 text-white rounded-br-md self-end min-w-[2.5rem] max-w-[70%]"
                    : "bg-dark-700 text-gray-100 rounded-bl-md self-start min-w-[2.5rem] max-w-[70%]"
                }`}
                style={{ width: "fit-content", minWidth: "2.5rem" }}
              >
                {formatMessage(msg.text)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center mb-4 max-w-[85%]">
              <div className="bg-dark-700 p-3 rounded-2xl">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full bg-secondary-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-secondary-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-secondary-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-secondary-800 bg-dark-900"
        >
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              rows={1}
              className="resize-none flex-1 px-4 py-2 border border-secondary-800 bg-dark-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-800 focus:border-transparent transition-all min-h-[2.5rem] max-h-32 font-sans text-base overflow-hidden"
              style={{ overflow: "hidden" }}
              disabled={isLoading}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "2.5rem";
                target.style.height = target.scrollHeight + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (inputValue.trim() && !isLoading) {
                    // Simulate form submit
                    handleSubmit(e as React.FormEvent);
                  }
                }
              }}
            />
            <button
              type="submit"
              className="bg-secondary-800 text-white p-3 rounded-xl hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-700 focus:ring-opacity-50 disabled:opacity-50 flex items-center justify-center transition-colors fixed right-4 bottom-24 md:static md:right-auto md:bottom-auto"
              disabled={!inputValue.trim() || isLoading}
              style={{ minWidth: 44, minHeight: 44, zIndex: 60 }}
            >
              <Send size={22} />
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default Chatbot;
