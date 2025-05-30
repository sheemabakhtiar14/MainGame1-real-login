import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { UserProvider, useUser } from "./context/UserContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import ServicesPage from "./pages/ServicesPage";
import ResourcesPage from "./pages/ResourcesPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import StandardMode from "./features/StandardMode";
import EmailMode from "./features/EmailMode";
import SocialMediaMode from "./features/SocialMediaMode";
import URLMode from "./features/URLMode";
import FirebaseTestPage from "./pages/FirebaseTestPage";
// Import Firebase test utilities for debugging
import "./utils/firebaseTest";
import "./utils/debugProgress";

// Create a protected route component that uses UserContext
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useUser();
  const isAuthenticated = state.isAuthenticated;

  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Create a wrapper component that includes the protected route
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      {/* Protect all game-related routes */}
      <Route
        path="/game"
        element={
          <ProtectedRoute>
            <GamePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/game/standard"
        element={
          <ProtectedRoute>
            <StandardMode />
          </ProtectedRoute>
        }
      />
      <Route
        path="/game/email"
        element={
          <ProtectedRoute>
            <EmailMode />
          </ProtectedRoute>
        }
      />
      <Route
        path="/game/social"
        element={
          <ProtectedRoute>
            <SocialMediaMode />
          </ProtectedRoute>
        }
      />
      <Route
        path="/game/url"
        element={
          <ProtectedRoute>
            <URLMode />
          </ProtectedRoute>
        }
      />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route
        path="/firebase-test"
        element={
          <ProtectedRoute>
            <FirebaseTestPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <GameProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </GameProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
