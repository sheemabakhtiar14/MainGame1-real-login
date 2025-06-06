import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  BarChart3,
  Calendar,
  MessageCircle,
  Mail,
  Share2,
  Link2,
  Clock,
  CheckCircle,
  Award,
  DollarSign,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { GameMode } from "../types/game";
import Button from "../components/Button";
import Card from "../components/Card";
import PageTransition from "../components/PageTransition";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useUser();

  // Debug: Log the current state
  console.log("📊 Dashboard: Current user state:", state);
  console.log("📊 Dashboard: Game progress:", state.gameProgress);
  console.log("📊 Dashboard: Progress count:", state.gameProgress.length);

  // Game mode configurations with icons and styling
  const modeConfigs = {
    standard: {
      title: "Standard Mode",
      icon: <MessageCircle size={20} className="text-blue-400" />,
      color: "from-blue-500/20 to-blue-700/20",
      borderColor: "border-blue-700/30",
    },
    email: {
      title: "Email Simulation",
      icon: <Mail size={20} className="text-green-400" />,
      color: "from-green-500/20 to-green-700/20",
      borderColor: "border-green-700/30",
    },
    social: {
      title: "Social Media Simulation",
      icon: <Share2 size={20} className="text-purple-400" />,
      color: "from-purple-500/20 to-purple-700/20",
      borderColor: "border-purple-700/30",
    },
    url: {
      title: "URL Phishing Simulation",
      icon: <Link2 size={20} className="text-orange-400" />,
      color: "from-orange-500/20 to-orange-700/20",
      borderColor: "border-orange-700/30",
    },
  };

  // Create progress display data from real user progress
  const progressData = Object.entries(modeConfigs).map(([mode, config]) => {
    const userProgress = state.gameProgress.find((p) => p.mode === mode);
    return {
      mode: mode as GameMode,
      ...config,
      completed: userProgress?.completed || false,
      highestLevel: userProgress?.highestLevel || 0,
      score: userProgress?.score || 0,
      correctAnswers: userProgress?.correctAnswers || 0,
      totalAnswers: userProgress?.totalAnswers || 0,
      lastPlayed: userProgress?.lastPlayed || "",
    };
  });

  // Calculate total stats from real data
  const totalScore = progressData.reduce((sum, mode) => sum + mode.score, 0);
  const totalCorrect = progressData.reduce(
    (sum, mode) => sum + mode.correctAnswers,
    0
  );
  const totalQuestions = progressData.reduce(
    (sum, mode) => sum + mode.totalAnswers,
    0
  );
  const completedModes = progressData.filter((mode) => mode.completed).length;

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not started";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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

  // Get user data from localStorage as a fallback
  const getUserData = () => {
    if (state.user) {
      return state.user;
    }

    try {
      const savedState = localStorage.getItem("userState");
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        console.log(
          "DashboardPage - Parsed state from localStorage:",
          parsedState
        );
        return parsedState.user || { username: "User" };
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }

    return { username: "User" };
  };

  const userData = getUserData();
  console.log("DashboardPage - User data:", userData);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white font-heading mb-2">
              Welcome, {userData.username}!
            </h1>
            <p className="text-gray-400">
              Track your progress and continue your cybersecurity training
            </p>
          </div>

          {/* Stats Overview */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Card className="p-4 flex-1 min-w-[200px]">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-900/50 mr-4">
                  <DollarSign className="text-green-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Virtual Money</p>
                  <p className="text-2xl font-bold text-white">
                    ${userData.money || 100}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 flex-1 min-w-[200px]">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary-900/50 mr-4">
                  <Trophy className="text-primary-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Score</p>
                  <p className="text-2xl font-bold text-white">{totalScore}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 flex-1 min-w-[200px]">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-900/50 mr-4">
                  <BarChart3 className="text-green-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Accuracy</p>
                  <p className="text-2xl font-bold text-white">
                    {totalQuestions > 0
                      ? Math.round((totalCorrect / totalQuestions) * 100)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 flex-1 min-w-[200px]">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-accent-900/50 mr-4">
                  <CheckCircle className="text-accent-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Modes Completed</p>
                  <p className="text-2xl font-bold text-white">
                    {completedModes}/4
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 flex-1 min-w-[200px]">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-secondary-900/50 mr-4">
                  <Calendar className="text-secondary-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="text-lg font-bold text-white">
                    {formatDate(userData.createdAt || new Date().toISOString())}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Game Modes Progress */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 font-heading">
              Game Modes Progress
            </h2>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4"
            >
              {progressData.map((mode) => (
                <motion.div key={mode.mode} variants={item}>
                  <Card
                    className={`p-4 bg-gradient-to-r ${mode.color} border ${mode.borderColor}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="flex items-center mb-4 md:mb-0 md:mr-6 md:w-1/4">
                        <div className="p-3 rounded-full bg-dark-800/50 mr-3">
                          {mode.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">
                            {mode.title}
                          </h3>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <Clock size={12} className="mr-1" />
                            <span>
                              {mode.lastPlayed
                                ? "Last played: " + formatDate(mode.lastPlayed)
                                : "Not started"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 md:w-2/4">
                        <div>
                          <p className="text-xs text-gray-400">Level</p>
                          <p className="font-medium text-white">
                            {mode.highestLevel > 0
                              ? `${mode.highestLevel}/3`
                              : "Not started"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Score</p>
                          <p className="font-medium text-white">{mode.score}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Accuracy</p>
                          <p className="font-medium text-white">
                            {mode.totalAnswers > 0
                              ? `${Math.round(
                                  (mode.correctAnswers / mode.totalAnswers) *
                                    100
                                )}%`
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 md:ml-auto">
                        <Button
                          size="sm"
                          variant={mode.completed ? "outline" : "primary"}
                          onClick={() => navigate(`/game/${mode.mode}`)}
                          leftIcon={
                            mode.completed ? (
                              <Award size={16} />
                            ) : (
                              <Play size={16} />
                            )
                          }
                        >
                          {mode.completed
                            ? "Play Again"
                            : mode.highestLevel > 0
                            ? "Continue"
                            : "Start"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 font-heading">
              Achievements
            </h2>

            <Card className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <Trophy className="h-16 w-16 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No Achievements Yet
              </h3>
              <p className="text-gray-400 mb-4">
                Complete game modes to unlock achievements and earn badges
              </p>
              <div className="flex justify-center">
                <Button variant="primary" onClick={() => navigate("/game")}>
                  Start Playing
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

// Add missing Play icon
const Play = ({
  size = 24,
  ...props
}: { size?: number } & React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export default DashboardPage;
