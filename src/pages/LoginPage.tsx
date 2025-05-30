import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Shield, Chrome } from "lucide-react";
import { useUser } from "../context/UserContext";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import PageTransition from "../components/PageTransition";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, state } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Force redirect to dashboard if user is authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      console.log("User is authenticated, redirecting to dashboard");
      window.location.href = "/dashboard";
    }
  }, [state.isAuthenticated]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
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

    try {
      console.log("Attempting to login with email:", email);
      const success = await login(email, password);
      if (success) {
        console.log("Email/password login successful, setting success state");
        setLoginSuccess(true);
        // The useEffect hook will handle the redirection
      } else {
        // The specific error message is logged in the UserContext
        setErrors({
          password:
            "Invalid email or password. Please check your credentials and try again.",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Display more specific error messages based on the error
      if (error.code) {
        switch (error.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential":
            setErrors({ password: "Invalid email or password" });
            break;
          case "auth/invalid-email":
            setErrors({ email: "Invalid email format" });
            break;
          case "auth/user-disabled":
            setErrors({ email: "This account has been disabled" });
            break;
          case "auth/too-many-requests":
            setErrors({
              password:
                "Too many unsuccessful login attempts. Please try again later",
            });
            break;
          default:
            setErrors({ password: "An error occurred during login" });
        }
      } else {
        setErrors({ password: "An error occurred during login" });
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
        setLoginSuccess(true);
        // The useEffect hook will handle the redirection
      } else {
        setErrors({ password: "Google sign-in failed" });
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setErrors({ password: "An error occurred during Google sign-in" });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // If login was successful or user is authenticated, redirect to dashboard
  if (loginSuccess || state.isAuthenticated) {
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
              Welcome Back
            </h1>
            <p className="text-gray-400 mt-2">
              Sign in to continue your cybersecurity training
            </p>
          </motion.div>

          <Card className="p-6">
            <form onSubmit={handleSubmit}>
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

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-dark-600 bg-dark-700 text-primary-600 focus:ring-primary-500"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-300"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="text-primary-400 hover:text-primary-300"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                leftIcon={<LogIn size={18} />}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-4 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-800 text-gray-400">
                  Or continue with
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
                {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary-400 hover:text-primary-300 font-medium"
                >
                  Sign up
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

export default LoginPage;
