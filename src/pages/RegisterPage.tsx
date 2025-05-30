import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Shield, UserPlus, Chrome } from "lucide-react";
import { useUser } from "../context/UserContext";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import PageTransition from "../components/PageTransition";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, state } = useUser();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string | React.ReactNode;
    email?: string | React.ReactNode;
    password?: string | React.ReactNode;
    confirmPassword?: string | React.ReactNode;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Force redirect to dashboard if user is authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      console.log("User is authenticated, redirecting to dashboard");
      window.location.href = "/dashboard";
    }
  }, [state.isAuthenticated]);

  const validateForm = () => {
    const newErrors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!username) {
      newErrors.username = "Username is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    console.log("Starting registration process...");

    try {
      console.log("Calling register with:", { username, email });
      const success = await register(username, email, password);
      console.log("Registration result:", success);

      if (success) {
        console.log("Registration successful, setting success state");
        setRegistrationSuccess(true);
        // The useEffect hook will handle the redirection
      } else {
        console.log("Registration failed");
        setErrors({ email: "Registration failed. Please try again." });
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      // Display more specific error messages based on the error
      if (error.code) {
        switch (error.code) {
          case "auth/email-already-in-use":
            // Create a more helpful message with a link to the login page
            setErrors({
              email: (
                <span>
                  You are already registered. Please{" "}
                  <Link
                    to="/login"
                    className="text-primary-400 hover:text-primary-300 font-medium"
                  >
                    log in
                  </Link>{" "}
                  with your email and password.
                </span>
              ),
            });
            break;
          case "auth/invalid-email":
            setErrors({
              email:
                "Invalid email format. Please enter a valid email address.",
            });
            break;
          case "auth/weak-password":
            setErrors({
              password: "Password is too weak. Please use a stronger password.",
            });
            break;
          case "auth/operation-not-allowed":
            setErrors({ email: "Email/password registration is not enabled." });
            break;
          case "auth/missing-password":
            setErrors({ password: "Password is required." });
            break;
          case "auth/admin-restricted-operation":
            setErrors({ email: "This operation is restricted." });
            break;
          default:
            setErrors({
              email: "An error occurred during registration. Please try again.",
            });
        }
      } else {
        setErrors({
          email: "An error occurred during registration. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    try {
      const success = await loginWithGoogle();
      if (success) {
        console.log("Google sign-in successful, setting success state");
        setRegistrationSuccess(true);
        // The useEffect hook will handle the redirection
      } else {
        setErrors({ email: "Google sign-in failed" });
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setErrors({ email: "An error occurred during Google sign-in" });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // If registration was successful or user is authenticated, redirect to dashboard
  if (registrationSuccess || state.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-accent-500" />
            </div>
            <h1 className="text-3xl font-bold text-white font-heading">
              Create Account
            </h1>
            <p className="text-gray-400 mt-2">
              Join CyberSafe and start your cybersecurity journey
            </p>
          </motion.div>

          <Card className="p-6">
            <form onSubmit={handleSubmit}>
              <Input
                type="text"
                label="Username"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={errors.username}
                fullWidth
                leftIcon={<User size={18} />}
              />

              <Input
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                fullWidth
                leftIcon={<Mail size={18} />}
              />

              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                fullWidth
                leftIcon={<Lock size={18} />}
              />

              <Input
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                fullWidth
                leftIcon={<Lock size={18} />}
              />

              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 rounded border-dark-600 bg-dark-700 text-primary-600 focus:ring-primary-500"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-gray-300"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-primary-400 hover:text-primary-300"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-primary-400 hover:text-primary-300"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                leftIcon={<UserPlus size={18} />}
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-4 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-800 text-gray-400">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                fullWidth
                leftIcon={<Chrome size={18} />}
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? "Signing in..." : "Sign up with Google"}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary-400 hover:text-primary-300 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Card>

          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-gray-400 hover:text-white">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RegisterPage;
