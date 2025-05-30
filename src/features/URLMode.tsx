import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Link2,
  ShieldAlert,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useGame } from "../context/GameContext";
import { useUser } from "../context/UserContext";
import { GameLevel } from "../types/game";
import { ollamaService, URLScam } from "../services/ollamaService";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import ProgressBar from "../components/ProgressBar";
import GameOver from "../components/GameOver";
import PageTransition from "../components/PageTransition";

const URLMode: React.FC = () => {
  const navigate = useNavigate();
  const { saveGameProgress, state: userState } = useUser();
  const {
    state,
    answerQuestion,
    resetGame,
    resetLevel,
    setLevel,
    checkGameCompletion,
    completeGame,
    initializeWithProgress,
  } = useGame();

  const [allLevelURLs, setAllLevelURLs] = useState<{
    [key: number]: URLScam[];
  }>({});
  const [currentURLs, setCurrentURLs] = useState<URLScam[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<URLScam | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [levelCompleteModal, setLevelCompleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Initialize game with user's saved progress
  useEffect(() => {
    const userProgress = userState.gameProgress.find((p) => p.mode === "url");
    if (userProgress && !state.mode) {
      // Initialize with saved progress
      const nextLevel = userProgress.completed
        ? 1
        : Math.min(userProgress.highestLevel + 1, 3);
      initializeWithProgress(
        "url",
        nextLevel as GameLevel,
        userProgress.score,
        state.money
      );
    } else if (!state.mode) {
      // Initialize for first time
      initializeWithProgress("url", 1, 0, 100);
    }
  }, [userState.gameProgress, state.mode, initializeWithProgress, state.money]);

  // Generate URLs for all levels on initial load
  const generateAllLevelURLs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Use bulk generation for better performance
      const allURLs = await ollamaService.generateURLScamsBulk();
      setAllLevelURLs(allURLs);
      const currentLevelURLs = allURLs[state.level] || [];
      setCurrentURLs(currentLevelURLs);
      if (currentLevelURLs.length > 0) {
        setCurrentQuestion(currentLevelURLs[0]);
      }
      setInitialLoadComplete(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate URL scenarios"
      );
    } finally {
      setLoading(false);
    }
  }, [state.level]);

  // Load URLs for current level from pre-generated content
  const loadURLsForLevel = useCallback(
    (level: number) => {
      if (allLevelURLs[level]) {
        const urls = [...allLevelURLs[level]];
        setCurrentURLs(urls);
        if (urls.length > 0) {
          setCurrentQuestion(urls[0]);
        }
      }
    },
    [allLevelURLs]
  );

  // Generate all URLs on initial component mount
  useEffect(() => {
    if (!initialLoadComplete) {
      generateAllLevelURLs();
    }
  }, [initialLoadComplete, generateAllLevelURLs]);

  // Load URLs for current level when level changes
  useEffect(() => {
    if (initialLoadComplete) {
      loadURLsForLevel(state.level);
    }
  }, [state.level, initialLoadComplete, loadURLsForLevel]);

  const handleAnswer = async (isScam: boolean) => {
    if (!currentQuestion) return;

    const correct = isScam === currentQuestion.isPhishing;

    setIsCorrect(correct);
    answerQuestion(correct);

    // Generate personalized feedback using LLM
    try {
      const feedbackText = await ollamaService.generateFeedback({
        userAnswer: isScam,
        isCorrect: correct,
        scamType: "url",
        content: currentQuestion,
      });
      setFeedback(feedbackText);
    } catch {
      setFeedback(
        correct
          ? "Great job! You correctly identified this URL."
          : "Not quite right. Look for domain spoofing, suspicious subdomains, and character substitution tricks."
      );
    }

    setShowFeedback(true);
  };

  const handleContinue = () => {
    setShowFeedback(false);

    // Update current URLs list by removing answered URL
    const updatedURLs = [...currentURLs];
    updatedURLs.shift();
    setCurrentURLs(updatedURLs);

    if (updatedURLs.length > 0) {
      setCurrentQuestion(updatedURLs[0]);
    } else {
      // Check if enough correct answers to advance
      if (state.correctAnswers >= 2) {
        // Check if this was the final level
        if (checkGameCompletion()) {
          completeGame();
          // Save final progress to Firebase
          saveGameProgress("url", {
            completed: true,
            highestLevel: state.level,
            score: state.score,
            correctAnswers: state.overallCorrectAnswers,
            totalAnswers: state.overallTotalAnswers,
          });
        } else {
          // Save progress for completed level
          saveGameProgress("url", {
            completed: false,
            highestLevel: state.level,
            score: state.score,
            correctAnswers: state.overallCorrectAnswers,
            totalAnswers: state.overallTotalAnswers,
          });
          setLevelCompleteModal(true);
        }
      } else {
        // Not enough correct answers, repeat the level
        resetLevel();
        loadURLsForLevel(state.level);
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
    generateAllLevelURLs();
  };

  // Highlight parts of the URL for better visibility
  const highlightUrl = (url: string) => {
    // Try to split URL into protocol, domain, and path
    const protocolMatch = url.match(/(https?:\/\/)?([^/]+)(\/.*)?/);

    if (!protocolMatch) return url;

    const [, protocol = "", domain = "", path = ""] = protocolMatch;

    return (
      <span className="font-mono">
        {protocol && <span className="text-gray-400">{protocol}</span>}
        <span className="text-white font-medium">{domain}</span>
        {path && <span className="text-gray-400">{path}</span>}
      </span>
    );
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
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
                <Link2 size={18} className="text-orange-400 mr-2" />
                <h2 className="text-xl font-bold text-white">
                  URL Phishing Simulation
                </h2>
              </div>
              <div className="px-3 py-1 bg-dark-800 rounded-full text-sm">
                Level {state.level}
              </div>
            </div>
            <ProgressBar
              progress={3 - currentURLs.length}
              total={3}
              progressColor="bg-orange-500"
            />
          </div>

          {/* Loading state */}
          {loading && (
            <Card className="p-8 text-center">
              <Loader2
                className="animate-spin mx-auto mb-4 text-orange-400"
                size={48}
              />
              <h3 className="text-lg font-medium text-white mb-2">
                Generating URL Scenarios
              </h3>
              <p className="text-gray-400">
                AI is creating realistic phishing URLs for your training...
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
                  onClick={() => generateAllLevelURLs()}
                >
                  Try Again
                </Button>
              </div>
            </Card>
          )}

          {/* Game content */}
          {!state.gameCompleted && !loading && !error && currentQuestion ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`url-${currentURLs.length}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-6">
                  <div className="p-6 border-b border-dark-700">
                    <h3 className="text-lg font-medium text-white mb-4">
                      Scenario:
                    </h3>
                    <p className="text-gray-300 mb-6">
                      {currentQuestion.description}
                    </p>

                    <div className="bg-dark-900 p-4 rounded-lg border border-dark-700 break-all">
                      <div className="text-sm text-gray-500 mb-2">URL:</div>
                      <div className="text-lg">
                        {highlightUrl(currentQuestion.url)}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-medium text-white mb-4">
                      Is this URL safe or suspicious?
                    </h3>

                    {!showFeedback ? (
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          leftIcon={<CheckCircle size={16} />}
                          onClick={() => handleAnswer(false)}
                          fullWidth
                        >
                          Safe URL
                        </Button>
                        <Button
                          variant="outline"
                          leftIcon={<ShieldAlert size={16} />}
                          onClick={() => handleAnswer(true)}
                          fullWidth
                        >
                          Suspicious URL
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
                                isCorrect ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {isCorrect
                                ? "Correct Identification!"
                                : "Incorrect Identification"}
                            </span>
                          </div>
                          <p className="text-gray-300 mb-3">{feedback}</p>

                          {/* Show red flags for phishing URLs */}
                          {currentQuestion.isPhishing &&
                            currentQuestion.redFlags && (
                              <div className="mt-3">
                                <h4 className="text-sm font-medium text-gray-400 mb-2">
                                  Red Flags to Look For:
                                </h4>
                                <ul className="text-sm text-gray-300 space-y-1">
                                  {currentQuestion.redFlags.map((flag, idx) => (
                                    <li key={idx} className="flex items-center">
                                      <span className="text-red-400 mr-2">
                                        •
                                      </span>
                                      {flag}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          {/* Show trust indicators for legitimate URLs */}
                          {!currentQuestion.isPhishing &&
                            currentQuestion.trustIndicators && (
                              <div className="mt-3">
                                <h4 className="text-sm font-medium text-gray-400 mb-2">
                                  Trust Indicators:
                                </h4>
                                <ul className="text-sm text-gray-300 space-y-1">
                                  {currentQuestion.trustIndicators.map(
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

                          {currentQuestion.legitimateUrl && (
                            <div className="mt-3 p-3 bg-green-900/10 border border-green-700/50 rounded">
                              <div className="text-sm text-gray-400 mb-1">
                                Legitimate URL:
                              </div>
                              <div className="text-sm text-green-400 font-mono break-all">
                                {currentQuestion.legitimateUrl}
                              </div>
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
          ) : !loading && !error && !state.gameCompleted ? (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium text-white mb-2">
                No URL scenarios available
              </h3>
              <p className="text-gray-400 mb-4">
                Please try generating new scenarios.
              </p>
              <Button variant="primary" onClick={() => generateAllLevelURLs()}>
                Generate URLs
              </Button>
            </Card>
          ) : !loading && !error ? (
            <GameOver
              onPlayAgain={handlePlayAgain}
              onBackToMenu={handleBackToMenu}
            />
          ) : null}

          {/* Game stats */}
          {!loading && !error && (
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
                  <div className="text-lg font-medium text-orange-400">
                    {state.score}
                  </div>
                </div>
              </div>
            </Card>
          )}

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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-900/50 border-2 border-orange-500">
                  <span className="text-2xl font-bold text-orange-400">
                    {state.correctAnswers}/3
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 text-white">
                {state.correctAnswers === 3 ? "Perfect Score!" : "Good Job!"}
              </h3>

              <p className="text-gray-300 mb-4">
                {state.correctAnswers === 3
                  ? "You identified all URLs correctly! You're becoming a URL security expert."
                  : `You identified ${state.correctAnswers} out of 3 URLs correctly. Keep learning to improve further.`}
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

export default URLMode;
