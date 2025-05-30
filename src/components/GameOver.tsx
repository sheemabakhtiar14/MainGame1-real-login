import React from "react";
import { ArrowLeft, RotateCw } from "lucide-react";
import { motion } from "framer-motion";
import { useGame } from "../context/GameContext";
import Button from "./Button";
import Card from "./Card";

interface GameOverProps {
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ onPlayAgain, onBackToMenu }) => {
  const { state } = useGame();

  const getPerformanceRating = () => {
    // Use overall scores instead of current level scores
    const percentage =
      (state.overallCorrectAnswers / state.overallTotalAnswers) * 100;

    if (percentage >= 90) return { label: "Expert", color: "text-green-400" };
    if (percentage >= 75) return { label: "Advanced", color: "text-blue-400" };
    if (percentage >= 50)
      return { label: "Intermediate", color: "text-yellow-400" };
    return { label: "Novice", color: "text-red-400" };
  };

  const performanceRating = getPerformanceRating();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="max-w-md mx-auto p-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <h2 className="text-2xl font-bold text-center mb-6 text-white">
              Game Report
            </h2>
          </motion.div>

          <motion.div variants={item} className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-dark-700 flex items-center justify-center border-4 border-secondary-600">
              <span className="text-2xl font-bold">
                {Math.round(
                  (state.overallCorrectAnswers / state.overallTotalAnswers) *
                    100
                )}
                %
              </span>
            </div>
          </motion.div>

          <motion.div variants={item} className="mb-6">
            <h3 className="text-xl text-center mb-2">
              Performance Rating:{" "}
              <span className={performanceRating.color}>
                {performanceRating.label}
              </span>
            </h3>
            <p className="text-center text-gray-400">
              You've completed all levels in {state.mode} mode!
            </p>
          </motion.div>

          <motion.div variants={item} className="space-y-3 mb-6">
            <div className="flex justify-between py-2 border-b border-dark-700">
              <span className="text-gray-300">Correct Answers:</span>
              <span className="font-medium text-green-400">
                {state.overallCorrectAnswers}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-dark-700">
              <span className="text-gray-300">Wrong Answers:</span>
              <span className="font-medium text-red-400">
                {state.overallTotalAnswers - state.overallCorrectAnswers}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-dark-700">
              <span className="text-gray-300">Current Money:</span>
              <span className="font-medium text-yellow-400">
                ${state.money}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-300">Score:</span>
              <span className="font-medium text-blue-400">{state.score}</span>
            </div>
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-2 gap-4 pt-2">
            <Button
              onClick={onBackToMenu}
              variant="outline"
              leftIcon={<ArrowLeft size={16} />}
            >
              Game Menu
            </Button>
            <Button
              onClick={onPlayAgain}
              variant="primary"
              leftIcon={<RotateCw size={16} />}
            >
              Play Again
            </Button>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default GameOver;
