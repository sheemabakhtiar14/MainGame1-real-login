import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  ShieldAlert,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useGame } from "../context/GameContext";
import { ollamaService, EmailScam } from "../services/ollamaService";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import ProgressBar from "../components/ProgressBar";
import GameOver from "../components/GameOver";
import PageTransition from "../components/PageTransition";

const EmailMode: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    answerQuestion,
    resetGame,
    resetLevel,
    setLevel,
    checkGameCompletion,
    completeGame,
  } = useGame();

  const [allLevelEmails, setAllLevelEmails] = useState<{
    [key: number]: EmailScam[];
  }>({});
  const [currentEmails, setCurrentEmails] = useState<EmailScam[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [levelCompleteModal, setLevelCompleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Generate emails for all levels on initial load
  const generateAllLevelEmails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Use bulk generation for better performance
      const allEmails = await ollamaService.generateEmailScamsBulk();
      setAllLevelEmails(allEmails);
      setCurrentEmails(allEmails[state.level] || []);
      setInitialLoadComplete(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to generate emails"
      );
    } finally {
      setLoading(false);
    }
  }, [state.level]);

  // Load emails for current level from pre-generated content
  const loadEmailsForLevel = useCallback(
    (level: number) => {
      if (allLevelEmails[level]) {
        setCurrentEmails([...allLevelEmails[level]]);
      }
    },
    [allLevelEmails]
  );

  // Generate all emails on initial component mount
  useEffect(() => {
    if (!initialLoadComplete) {
      generateAllLevelEmails();
    }
  }, [initialLoadComplete, generateAllLevelEmails]);

  // Load emails for current level when level changes
  useEffect(() => {
    if (initialLoadComplete) {
      loadEmailsForLevel(state.level);
    }
  }, [state.level, initialLoadComplete, loadEmailsForLevel]);

  const handleSelectEmail = (index: number) => {
    setSelectedEmail(index);
  };

  const handleAnswer = async (isScam: boolean) => {
    if (selectedEmail === null) return;

    const email = currentEmails[selectedEmail];
    const correct = isScam === email.isPhishing;

    setIsCorrect(correct);
    answerQuestion(correct);

    // Generate personalized feedback using LLM
    try {
      const feedbackText = await ollamaService.generateFeedback({
        userAnswer: isScam,
        isCorrect: correct,
        scamType: "email",
        content: email,
      });
      setFeedback(feedbackText);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      setFeedback(
        correct
          ? "Great job! You correctly identified this email scam."
          : "Not quite right. This was a phishing email. Look for red flags like suspicious domains and urgent language."
      );
    }

    setShowFeedback(true);
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setSelectedEmail(null);

    // Update current emails list by removing answered email
    if (selectedEmail !== null) {
      const updatedEmails = [...currentEmails];
      updatedEmails.splice(selectedEmail, 1);
      setCurrentEmails(updatedEmails);
    }

    // Check if all emails for this level have been answered
    if (currentEmails.length <= 1) {
      if (state.correctAnswers >= 2) {
        // Check if this was the final level
        if (checkGameCompletion()) {
          completeGame();
        } else {
          setLevelCompleteModal(true);
        }
      } else {
        // Not enough correct answers, repeat the level
        resetLevel();
        loadEmailsForLevel(state.level);
      }
    }
  };

  const handleNextLevel = () => {
    setLevelCompleteModal(false);
    setLevel((state.level + 1) as 1 | 2 | 3);
  };

  const handleBackToMenu = () => {
    resetGame();
    navigate("/game");
  };

  const handlePlayAgain = () => {
    resetGame();
    resetLevel();
    generateAllLevelEmails();
  };

  // Format function to return truncated content for inbox view
  const formatEmailPreview = (content: string) => {
    return content.substring(0, 80) + (content.length > 80 ? "..." : "");
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft size={16} />}
              onClick={handleBackToMenu}
            >
              Back to Game Menu
            </Button>
            <div className="flex items-center space-x-2 bg-dark-800 rounded-full px-4 py-1">
              <span className="text-green-400">$</span>
              <span>{state.money}</span>
            </div>
          </div>

          {/* Level and progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Mail size={18} className="text-blue-400 mr-2" />
                <h2 className="text-xl font-bold text-white">
                  Email Simulation
                </h2>
              </div>
              <div className="px-3 py-1 bg-dark-800 rounded-full text-sm">
                Level {state.level}
              </div>
            </div>
            <ProgressBar
              progress={3 - currentEmails.length}
              total={3}
              progressColor="bg-blue-500"
            />
          </div>

          {/* Loading state */}
          {loading && (
            <Card className="p-8 text-center">
              <Loader2
                className="animate-spin mx-auto mb-4 text-blue-400"
                size={48}
              />
              <h3 className="text-lg font-medium text-white mb-2">
                Generating Email Scenarios
              </h3>
              <p className="text-gray-400">
                AI is creating realistic phishing simulations for your
                training...
              </p>
            </Card>
          )}

          {/* Error state */}
          {error && (
            <Card className="p-6">
              <div className="text-center">
                <div className="text-red-400 mb-4">⚠️ Connection Error</div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Cannot Connect to AI Service
                </h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <Button
                  variant="primary"
                  onClick={() => generateAllLevelEmails()}
                >
                  Try Again
                </Button>
              </div>
            </Card>
          )}

          {/* Game content */}
          {!state.gameCompleted && !loading && !error ? (
            <div className="grid grid-cols-1 gap-6">
              {selectedEmail === null ? (
                <Card className="p-4">
                  <div className="p-2 border-b border-dark-700 mb-4">
                    <h3 className="text-lg font-medium text-white">
                      Email Inbox
                    </h3>
                  </div>

                  {currentEmails.length > 0 ? (
                    <div className="space-y-2">
                      {currentEmails.map((email, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.01 }}
                          className="p-3 bg-dark-800 border border-dark-700 rounded-lg cursor-pointer hover:bg-dark-700 transition-colors"
                          onClick={() => handleSelectEmail(index)}
                        >
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-white">
                              {email.sender}
                            </span>
                            <span className="text-sm text-gray-500">Today</span>
                          </div>
                          <div className="font-medium text-gray-300 mb-1">
                            {email.subject}
                          </div>
                          <div className="text-sm text-gray-400">
                            {formatEmailPreview(email.content)}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 text-gray-400">
                      All emails processed. Let's see how you did!
                    </div>
                  )}
                </Card>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="email-detail"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="mb-6">
                      <div className="p-4 border-b border-dark-700">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-white">
                            {currentEmails[selectedEmail]?.subject}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedEmail(null)}
                          >
                            Back to Inbox
                          </Button>
                        </div>

                        <div className="flex justify-between mb-2">
                          <div>
                            <span className="text-gray-400">From: </span>
                            <span className="text-white">
                              {currentEmails[selectedEmail]?.sender}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Today, 10:42 AM
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-400">To: </span>
                          <span className="text-white">you@example.com</span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="whitespace-pre-line text-gray-300 mb-6">
                          {currentEmails[selectedEmail]?.content}
                        </div>

                        {!showFeedback ? (
                          <div className="flex gap-3 mt-6">
                            <Button
                              variant="outline"
                              leftIcon={<CheckCircle size={16} />}
                              onClick={() => handleAnswer(false)}
                              fullWidth
                            >
                              Legitimate Email
                            </Button>
                            <Button
                              variant="outline"
                              leftIcon={<ShieldAlert size={16} />}
                              onClick={() => handleAnswer(true)}
                              fullWidth
                            >
                              This is a Scam
                            </Button>
                          </div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4"
                          >
                            <div
                              className={`p-4 rounded-lg ${
                                isCorrect
                                  ? "bg-green-900/20 border border-green-700"
                                  : "bg-red-900/20 border border-red-700"
                              }`}
                            >
                              <div className="flex items-center mb-2">
                                <div
                                  className={`w-2 h-2 rounded-full mr-2 ${
                                    isCorrect ? "bg-green-500" : "bg-red-500"
                                  }`}
                                ></div>
                                <span
                                  className={`font-medium ${
                                    isCorrect
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {isCorrect
                                    ? "Correct Identification!"
                                    : "Incorrect Identification"}
                                </span>
                              </div>
                              <p className="text-gray-300 mb-3">{feedback}</p>
                              
                              {/* Show red flags for phishing emails */}
                              {currentEmails[selectedEmail]?.isPhishing && 
                               currentEmails[selectedEmail]?.redFlags && (
                                <div className="mt-3">
                                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                                    Red Flags to Look For:
                                  </h4>
                                  <ul className="text-sm text-gray-300 space-y-1">
                                    {currentEmails[selectedEmail].redFlags.map(
                                      (flag, idx) => (
                                        <li
                                          key={idx}
                                          className="flex items-center"
                                        >
                                          <span className="text-red-400 mr-2">
                                            •
                                          </span>
                                          {flag}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}

                              {/* Show trust indicators for legitimate emails */}
                              {!currentEmails[selectedEmail]?.isPhishing && 
                               currentEmails[selectedEmail]?.trustIndicators && (
                                <div className="mt-3">
                                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                                    Trust Indicators:
                                  </h4>
                                  <ul className="text-sm text-gray-300 space-y-1">
                                    {currentEmails[selectedEmail].trustIndicators.map(
                                      (indicator, idx) => (
                                        <li
                                          key={idx}
                                          className="flex items-center"
                                        >
                                          <span className="text-green-400 mr-2">
                                            ✓
                                          </span>
                                          {indicator}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>

                            <Button
                              variant="primary"
                              fullWidth
                              onClick={handleContinue}
                            >
                              Continue
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Game stats */}
              <Card className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-2">
                    <div className="text-sm text-gray-400 mb-1">
                      Correct Answers
                    </div>
                    <div className="text-lg font-medium text-green-400">
                      {state.correctAnswers}/{state.totalAnswers}
                    </div>
                  </div>
                  <div className="text-center p-2">
                    <div className="text-sm text-gray-400 mb-1">
                      Current Score
                    </div>
                    <div className="text-lg font-medium text-blue-400">
                      {state.score}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : !loading && !error ? (
            <GameOver
              onPlayAgain={handlePlayAgain}
              onBackToMenu={handleBackToMenu}
            />
          ) : null}

          {/* Level complete modal */}
          <Modal
            isOpen={levelCompleteModal}
            onClose={() => setLevelCompleteModal(false)}
            title={`Level ${state.level} Completed!`}
            footer={
              <Button variant="primary" fullWidth onClick={handleNextLevel}>
                Continue to Level {state.level + 1}
              </Button>
            }
          >
            <div className="text-center py-4">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-900/50 border-2 border-blue-500">
                  <span className="text-2xl font-bold text-blue-400">
                    {state.correctAnswers}/3
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 text-white">
                {state.correctAnswers === 3 ? "Perfect Score!" : "Good Job!"}
              </h3>

              <p className="text-gray-300 mb-4">
                {state.correctAnswers === 3
                  ? "You identified all emails correctly! You're becoming an email security expert."
                  : `You identified ${state.correctAnswers} out of 3 emails correctly. Keep learning to improve further.`}
              </p>

              <div className="py-2 px-4 bg-dark-700 rounded-lg inline-block">
                <span className="text-green-400">
                  +${state.correctAnswers * 25}
                </span>{" "}
                added to your balance
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </PageTransition>
  );
};

export default EmailMode;
