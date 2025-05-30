import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  Zap,
  Award,
  LogIn,
  UserPlus,
  Phone,
} from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import PageTransition from "../components/PageTransition";
import { useUser } from "../context/UserContext";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useUser();

  const features = [
    {
      title: "Learn By Playing",
      description:
        "Interactive gameplay that teaches you how to identify and avoid scams in real-world scenarios.",
      icon: <Zap className="text-yellow-400" size={24} />,
    },
    {
      title: "Multiple Simulation Modes",
      description:
        "Practice with text messages, emails, social media, and URL identification challenges.",
      icon: <Shield className="text-primary-400" size={24} />,
    },
    {
      title: "Progressive Difficulty",
      description:
        "Start with basic scenarios and progress to more sophisticated scam techniques.",
      icon: <AlertTriangle className="text-accent-400" size={24} />,
    },
    {
      title: "Performance Tracking",
      description:
        "Track your progress and see how your cybersecurity awareness improves over time.",
      icon: <Award className="text-green-400" size={24} />,
    },
  ];

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        {/* Hero section */}
        <section className="mb-12">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-dark-800 to-secondary-900 p-8 md:p-12">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500"></div>
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-secondary-600/20 blur-3xl"></div>
            <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-primary-600/20 blur-3xl"></div>

            <div className="relative max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white font-heading">
                  Learn to protect yourself in the{" "}
                  <span className="text-accent-500">digital world</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-6">
                  Master cybersecurity awareness through interactive gameplay.
                  Practice identifying scams, phishing, and social engineering
                  attempts in a safe environment.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                {state.isAuthenticated ? (
                  <>
                    <Button
                      size="lg"
                      onClick={() => navigate("/game")}
                      className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                    >
                      Start Playing Now
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate("/dashboard")}
                    >
                      View Dashboard
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={() => navigate("/login")}
                      className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                      leftIcon={<LogIn size={20} />}
                    >
                      Login to Play
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate("/register")}
                      leftIcon={<UserPlus size={20} />}
                    >
                      Register
                    </Button>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-white font-heading">
              Why Play CyberSafe?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our game-based learning approach makes cybersecurity education
              engaging and effective
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-start">
                    <div className="mr-4 bg-dark-700 p-3 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Emergency Helpline Section */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-xl border border-red-700/50 p-8"
          >
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-red-600 rounded-full p-3">
                  <Phone className="text-white" size={32} />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white font-heading">
                Need Help? We're Here for You
              </h2>
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                If you've encountered a scam or need immediate assistance,
                access our helpline with government resources and community
                support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/helpline")}
                  className="bg-red-600 hover:bg-red-700"
                  leftIcon={<Phone size={20} />}
                >
                  Access Helpline
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/resources")}
                >
                  View Resources
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Call to action */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center p-8 bg-gradient-to-r from-dark-800 to-dark-900 rounded-xl border border-dark-700"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white font-heading">
              Ready to test your cybersecurity awareness?
            </h2>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              Jump into our interactive games and see if you can spot the scams
              before they get you!
            </p>
            {state.isAuthenticated ? (
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/game")}
                  className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700"
                >
                  Start Game
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700"
                  leftIcon={<LogIn size={20} />}
                >
                  Login to Play
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/register")}
                  leftIcon={<UserPlus size={20} />}
                >
                  Register Now
                </Button>
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </PageTransition>
  );
};

export default HomePage;
