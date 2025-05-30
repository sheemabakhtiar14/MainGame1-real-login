import React, { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Shield,
  Home,
  Gamepad2,
  Wrench,
  BookOpen,
  Info,
  LogIn,
  LogOut,
  User,
  DollarSign,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";
import Button from "./Button";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, logout } = useUser();

  const navItems = [
    { to: "/", label: "Home", icon: <Home size={20} /> },
    { to: "/game", label: "Game", icon: <Gamepad2 size={20} /> },
    { to: "/services", label: "Services", icon: <Wrench size={20} /> },
    { to: "/resources", label: "Resources", icon: <BookOpen size={20} /> },
    { to: "/helpline", label: "Helpline", icon: <Phone size={20} /> },
    { to: "/community", label: "Community", icon: <User size={20} /> },
    { to: "/about", label: "About", icon: <Info size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-gray-100">
      {/* Header */}
      <header className="bg-dark-900 border-b border-dark-800 shadow-lg py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="text-accent-500 h-8 w-8" />
            <span className="text-2xl font-bold font-heading text-white">
              CyberSafe
            </span>
          </Link>

          {/* Mobile Money Indicator - only show when authenticated */}
          {state.isAuthenticated && (
            <div className="flex md:hidden items-center space-x-1 bg-dark-800 rounded-full px-3 py-1 border border-dark-600">
              <DollarSign size={14} className="text-green-400" />
              <span className="text-green-400 font-medium text-sm">
                {state.user?.money || 100}
              </span>
            </div>
          )}

          <div className="hidden md:flex items-center space-x-3 text-sm font-medium">
            {state.isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Virtual Money Indicator */}
                <div className="flex items-center space-x-1 bg-dark-800 rounded-full px-3 py-1 border border-dark-600">
                  <DollarSign size={14} className="text-green-400" />
                  <span className="text-green-400 font-medium">
                    {state.user?.money || 100}
                  </span>
                </div>
                <Link to="/dashboard">
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<User size={16} />}
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<LogOut size={16} />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<LogIn size={16} />}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    variant="primary"
                    leftIcon={<User size={16} />}
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-dark-900 border-b border-dark-800 shadow-md">
        <div className="container mx-auto px-4">
          <ul className="flex justify-between md:justify-center md:space-x-8">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex flex-col items-center py-3 px-2 relative ${
                    location.pathname === item.to
                      ? "text-accent-500"
                      : "text-gray-400 hover:text-white"
                  } transition-colors duration-200`}
                >
                  {item.icon}
                  <span className="text-xs mt-1">{item.label}</span>
                  {location.pathname === item.to && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 w-full h-0.5 bg-accent-500"
                      initial={false}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main content */}
      <motion.main
        className="flex-grow"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>

      {/* Footer */}
      <footer className="bg-dark-900 border-t border-dark-800 py-6 text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          <p>
            © 2025 CyberSafe - Learn to protect yourself in the digital world
          </p>
          <div className="flex justify-center space-x-4 mt-3">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
