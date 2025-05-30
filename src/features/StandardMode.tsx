import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useGame } from "../context/GameContext";
import { useUser } from "../context/UserContext";
import { GameLevel } from "../types/game";
import { standardQuestions } from "../data/standardQuestions";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import ProgressBar from "../components/ProgressBar";
import GameOver from "../components/GameOver";
import PageTransition from "../components/PageTransition";

const StandardMode: React.FC = () => {
  const navigate = useNavigate();
  const { saveGameProgress, state: userState } = useUser();
  const {
    state,
    answerQuestion,
    nextQuestion,
    resetGame,
    resetLevel,
    setLevel,
    checkLevelCompletion,
    checkGameCompletion,
    completeGame,
    initializeWithProgress,
  } = useGame();

  const [currentQuestions, setCurrentQuestions] = useState(
    standardQuestions.filter((q) => q.level === state.level)
  );
  const [currentQuestion, setCurrentQuestion] = useState(
    currentQuestions[state.currentQuestion]
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [levelCompleteModal, setLevelCompleteModal] = useState(false);

  // Initialize game with user's saved progress
  useEffect(() => {
    const userProgress = userState.gameProgress.find(
      (p) => p.mode === "standard"
    );
    if (userProgress && !state.mode) {
      // Initialize with saved progress
      const nextLevel = userProgress.completed
        ? 1
        : Math.min(userProgress.highestLevel + 1, 3);
      initializeWithProgress(
        "standard",
        nextLevel as GameLevel,
        userProgress.score,
        state.money
      );
    } else if (!state.mode) {
      // Initialize for first time
      initializeWithProgress("standard", 1, 0, 100);
    }
  }, [userState.gameProgress, state.mode, initializeWithProgress, state.money]);

  useEffect(() => {
    // Filter questions for the current level
    const questions = standardQuestions.filter((q) => q.level === state.level);
    setCurrentQuestions(questions);
    setCurrentQuestion(questions[state.currentQuestion]);
  }, [state.level, state.currentQuestion]);

  const handleAnswer = (isCorrect: boolean) => {
    setIsCorrect(isCorrect);
    answerQuestion(isCorrect);
    setShowFeedback(true);
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setIsCorrect(null);

    // Check if all questions for this level have been answered
    if (checkLevelCompletion()) {
      // Check if enough correct answers to advance
      if (state.correctAnswers >= 2) {
        // Check if this was the final level
        if (checkGameCompletion()) {
          completeGame();
          // Save final progress to Firebase
          saveGameProgress("standard", {
            completed: true,
            highestLevel: state.level,
            score: state.score,
            correctAnswers: state.overallCorrectAnswers,
            totalAnswers: state.overallTotalAnswers,
          });
        } else {
          // Save progress for completed level
          saveGameProgress("standard", {
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
      }
    } else {
      // Move to the next question
      nextQuestion();
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
                <MessageSquare size={18} className="text-secondary-400 mr-2" />
                <h2 className="text-xl font-bold text-white">Standard Mode</h2>
              </div>
              <div className="px-3 py-1 bg-dark-800 rounded-full text-sm">
                Level {state.level}
              </div>
            </div>
            <ProgressBar
              progress={state.currentQuestion + (showFeedback ? 1 : 0)}
              total={3}
              progressColor="bg-secondary-500"
            />
          </div>

          {/* Game content */}
          {!state.gameCompleted ? (
            <Card className="mb-6">
              <div className="p-6 border-b border-dark-700">
                <h3 className="text-lg font-medium text-white mb-3">
                  Message from Unknown Sender:
                </h3>
                <p className="p-4 bg-dark-700 rounded-lg text-gray-300">
                  {currentQuestion?.question}
                </p>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-medium text-white mb-3">
                  How would you respond?
                </h3>

                <div className="space-y-3">
                  <AnimatePresence mode="wait">
                    {!showFeedback ? (
                      <motion.div
                        key="options"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        {currentQuestion?.options.map((option) => (
                          <Button
                            key={option.id}
                            variant="outline"
                            fullWidth
                            className="justify-start py-3 text-left"
                            onClick={() => handleAnswer(option.isCorrect)}
                          >
                            {option.text}
                          </Button>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="feedback"
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
                                ? "Correct Answer!"
                                : "Incorrect Answer"}
                            </span>
                          </div>
                          <p className="text-gray-300">
                            {currentQuestion?.explanation}
                          </p>

                          {!isCorrect && (
                            <div className="mt-3 p-3 bg-dark-800 rounded border border-dark-700">
                              <p className="text-sm font-medium text-primary-400 mb-1">
                                The correct response would be:
                              </p>
                              <p className="text-gray-300">
                                {
                                  currentQuestion?.options.find(
                                    (o) => o.isCorrect
                                  )?.text
                                }
                              </p>
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
                  </AnimatePresence>
                </div>
              </div>
            </Card>
          ) : (
            <GameOver
              onPlayAgain={handlePlayAgain}
              onBackToMenu={handleBackToMenu}
            />
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
                <div className="text-sm text-gray-400 mb-1">Current Score</div>
                <div className="text-lg font-medium text-secondary-400">
                  {state.score}
                </div>
              </div>
            </div>
          </Card>

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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-900/50 border-2 border-primary-500">
                  <span className="text-2xl font-bold text-primary-400">
                    {state.correctAnswers}/3
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 text-white">
                {state.correctAnswers === 3 ? "Perfect Score!" : "Good Job!"}
              </h3>

              <p className="text-gray-300 mb-4">
                {state.correctAnswers === 3
                  ? "You answered all questions correctly! You're mastering cybersecurity awareness."
                  : `You got ${state.correctAnswers} out of 3 questions correct. Keep learning to improve further.`}
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

export default StandardMode;
