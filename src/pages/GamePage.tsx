import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Share2, Link2 } from 'lucide-react';
import Card from '../components/Card';
import PageTransition from '../components/PageTransition';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { selectMode } = useGame();

  const gameModes = [
    {
      id: 'standard',
      title: 'Standard Mode',
      description: 'Learn to identify scam messages and respond appropriately',
      icon: <MessageCircle size={24} className="text-blue-400" />,
      color: 'from-blue-500/20 to-blue-700/20',
      borderColor: 'border-blue-700/30',
      path: '/game/standard',
    },
    {
      id: 'email',
      title: 'Email Simulation',
      description: 'Identify phishing emails in a simulated inbox environment',
      icon: <Mail size={24} className="text-green-400" />,
      color: 'from-green-500/20 to-green-700/20',
      borderColor: 'border-green-700/30',
      path: '/game/email',
    },
    {
      id: 'social',
      title: 'Social Media Simulation',
      description: 'Spot scams in social media posts and profiles',
      icon: <Share2 size={24} className="text-purple-400" />,
      color: 'from-purple-500/20 to-purple-700/20',
      borderColor: 'border-purple-700/30',
      path: '/game/social',
    },
    {
      id: 'url',
      title: 'URL Phishing Simulation',
      description: 'Learn to identify suspicious and dangerous URLs',
      icon: <Link2 size={24} className="text-orange-400" />,
      color: 'from-orange-500/20 to-orange-700/20',
      borderColor: 'border-orange-700/30',
      path: '/game/url',
    },
  ];

  const handleSelectMode = (id: string, path: string) => {
    selectMode(id as any);
    navigate(path);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <motion.h1 
            className="text-3xl font-bold mb-2 text-white text-center font-heading"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Choose Your Game Mode
          </motion.h1>
          <motion.p 
            className="text-gray-400 mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Each mode features different challenges to test and improve your cybersecurity awareness
          </motion.p>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4"
          >
            {gameModes.map((mode) => (
              <motion.div key={mode.id} variants={item}>
                <Card 
                  interactive
                  className={`p-6 bg-gradient-to-r ${mode.color} border ${mode.borderColor}`}
                  onClick={() => handleSelectMode(mode.id, mode.path)}
                >
                  <div className="flex items-center">
                    <div className="mr-4 bg-dark-800/50 p-3 rounded-full">
                      {mode.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1 text-white">{mode.title}</h3>
                      <p className="text-gray-300">{mode.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-8 p-6 bg-dark-800 rounded-lg border border-dark-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-lg font-medium mb-2 text-white">How to Play</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Each game mode has 3 levels with increasing difficulty</li>
              <li>You need to correctly answer at least 2 out of 3 questions to advance</li>
              <li>Correct answers earn you virtual money, while wrong answers cost you</li>
              <li>Complete all levels to master cybersecurity awareness!</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default GamePage;