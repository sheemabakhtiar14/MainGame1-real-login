import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  ShieldAlert,
  CheckCircle,
  Heart,
  MessageCircle,
  Repeat2,
} from "lucide-react";
import { useGame } from "../context/GameContext";
import { useUser } from "../context/UserContext";
import { GameLevel } from "../types/game";
import { socialMediaQuestions } from "../data/socialMediaQuestions";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import ProgressBar from "../components/ProgressBar";
import GameOver from "../components/GameOver";
import PageTransition from "../components/PageTransition";

const SocialMediaMode: React.FC = () => {
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

  const [currentQuestions, setCurrentQuestions] = useState(
    socialMediaQuestions.filter((q) => q.level === state.level)
  );
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [levelCompleteModal, setLevelCompleteModal] = useState(false);

  // Initialize game with user's saved progress
  useEffect(() => {
    const userProgress = userState.gameProgress.find(
      (p) => p.mode === "social"
    );
    if (userProgress && !state.mode) {
      // Initialize with saved progress
      const nextLevel = userProgress.completed
        ? 1
        : Math.min(userProgress.highestLevel + 1, 3);
      initializeWithProgress(
        "social",
        nextLevel as GameLevel,
        userProgress.score,
        state.money
      );
    } else if (!state.mode) {
      // Initialize for first time
      initializeWithProgress("social", 1, 0, 100);
    }
  }, [userState.gameProgress, state.mode, initializeWithProgress, state.money]);

  useEffect(() => {
    // Filter questions for the current level
    const questions = socialMediaQuestions.filter(
      (q) => q.level === state.level
    );
    setCurrentQuestions(questions);
  }, [state.level]);

  const handleSelectPost = (index: number) => {
    setSelectedPost(index);
  };

  const handleAnswer = (isScam: boolean) => {
    if (selectedPost === null) return;

    const post = currentQuestions[selectedPost];
    const correct = isScam === post.isScam;

    setIsCorrect(correct);
    answerQuestion(correct);
    setShowFeedback(true);
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setSelectedPost(null);

    // Update current questions list by removing answered question
    if (selectedPost !== null) {
      const updatedQuestions = [...currentQuestions];
      updatedQuestions.splice(selectedPost, 1);
      setCurrentQuestions(updatedQuestions);
    }

    // Check if all questions for this level have been answered
    if (currentQuestions.length <= 1) {
      if (state.correctAnswers >= 2) {
        // Check if this was the final level
        if (checkGameCompletion()) {
          completeGame();
          // Save final progress to Firebase
          saveGameProgress("social", {
            completed: true,
            highestLevel: state.level,
            score: state.score,
            correctAnswers: state.overallCorrectAnswers,
            totalAnswers: state.overallTotalAnswers,
          });
        } else {
          // Save progress for completed level
          saveGameProgress("social", {
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
        setCurrentQuestions(
          socialMediaQuestions.filter((q) => q.level === state.level)
        );
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
    setCurrentQuestions(
      socialMediaQuestions.filter((q) => q.level === state.level)
    );
  };

  // Generate random engagement numbers
  const getRandomEngagement = () => {
    return {
      likes: Math.floor(Math.random() * 1000) + 10,
      comments: Math.floor(Math.random() * 100) + 5,
      shares: Math.floor(Math.random() * 50),
    };
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
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
                <Share2 size={18} className="text-purple-400 mr-2" />
                <h2 className="text-xl font-bold text-white">
                  Social Media Simulation
                </h2>
              </div>
              <div className="px-3 py-1 bg-dark-800 rounded-full text-sm">
                Level {state.level}
              </div>
            </div>
            <ProgressBar
              progress={3 - currentQuestions.length}
              total={3}
              progressColor="bg-purple-500"
            />
          </div>

          {/* Game content */}
          {!state.gameCompleted ? (
            <div className="grid grid-cols-1 gap-6">
              {selectedPost === null ? (
                <Card className="p-4">
                  <div className="p-2 border-b border-dark-700 mb-4">
                    <h3 className="text-lg font-medium text-white">
                      Social Feed
                    </h3>
                  </div>

                  {currentQuestions.length > 0 ? (
                    <div className="space-y-4">
                      {currentQuestions.map((post, index) => {
                        const engagement = getRandomEngagement();
                        return (
                          <motion.div
                            key={post.id}
                            whileHover={{ scale: 1.01 }}
                            className="rounded-lg overflow-hidden border border-dark-700 cursor-pointer hover:border-dark-600 transition-all"
                            onClick={() => handleSelectPost(index)}
                          >
                            <div className="p-3 bg-dark-800 flex items-center">
                              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                <img
                                  src={post.profilePic}
                                  alt={post.username}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-white">
                                  {post.username}
                                </div>
                                <div className="text-xs text-gray-500">
                                  2 hours ago
                                </div>
                              </div>
                            </div>

                            <div className="p-3 text-gray-300 text-sm">
                              {post.content}
                            </div>

                            {post.image && (
                              <div className="aspect-[4/3] overflow-hidden">
                                <img
                                  src={post.image}
                                  alt="Post content"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            <div className="p-3 bg-dark-800 flex items-center justify-between text-xs text-gray-400">
                              <div className="flex items-center">
                                <Heart size={14} className="mr-1" />
                                <span>{engagement.likes}</span>
                              </div>
                              <div className="flex items-center">
                                <MessageCircle size={14} className="mr-1" />
                                <span>{engagement.comments}</span>
                              </div>
                              <div className="flex items-center">
                                <Repeat2 size={14} className="mr-1" />
                                <span>{engagement.shares}</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center p-8 text-gray-400">
                      All posts reviewed. Let's see how you did!
                    </div>
                  )}
                </Card>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="post-detail"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="mb-6 overflow-hidden">
                      <div className="p-3 bg-dark-800 flex items-center justify-between border-b border-dark-700">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                            <img
                              src={currentQuestions[selectedPost]?.profilePic}
                              alt={currentQuestions[selectedPost]?.username}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {currentQuestions[selectedPost]?.username}
                            </div>
                            <div className="text-xs text-gray-500">
                              2 hours ago
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPost(null)}
                        >
                          Back to Feed
                        </Button>
                      </div>

                      <div className="p-4 text-gray-300">
                        {currentQuestions[selectedPost]?.content}
                      </div>

                      {currentQuestions[selectedPost]?.image && (
                        <div className="w-full">
                          <img
                            src={currentQuestions[selectedPost]?.image}
                            alt="Post content"
                            className="w-full object-cover"
                          />
                        </div>
                      )}

                      <div className="p-4 border-t border-dark-700">
                        {!showFeedback ? (
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              leftIcon={<CheckCircle size={16} />}
                              onClick={() => handleAnswer(false)}
                              fullWidth
                            >
                              Legitimate Post
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
                              <p className="text-gray-300">
                                {currentQuestions[selectedPost]?.explanation}
                              </p>
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
                    <div className="text-lg font-medium text-purple-400">
                      {state.score}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <GameOver
              onPlayAgain={handlePlayAgain}
              onBackToMenu={handleBackToMenu}
            />
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-900/50 border-2 border-purple-500">
                  <span className="text-2xl font-bold text-purple-400">
                    {state.correctAnswers}/3
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 text-white">
                {state.correctAnswers === 3 ? "Perfect Score!" : "Good Job!"}
              </h3>

              <p className="text-gray-300 mb-4">
                {state.correctAnswers === 3
                  ? "You identified all social media posts correctly! You're becoming a social media security expert."
                  : `You identified ${state.correctAnswers} out of 3 posts correctly. Keep learning to improve further.`}
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

export default SocialMediaMode;
