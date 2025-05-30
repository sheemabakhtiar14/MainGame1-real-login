import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Chatbot from './Chatbot';

const ChatbotIcon = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Hide the chatbot icon when chat is open on mobile (<=640px)
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;
  return (
    <>
      {/* Chatbot toggle button: hide on mobile if open */}
      {!(isMobile && isOpen) && (
        <motion.button
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-secondary-600 text-white flex items-center justify-center shadow-lg hover:bg-secondary-500 z-50 border-2 border-secondary-700"
          onClick={toggleChat}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle chatbot"
        >
          <MessageCircle size={24} />
        </motion.button>
      )}

      {/* Render chatbot if open */}
      {isOpen && <Chatbot onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatbotIcon;