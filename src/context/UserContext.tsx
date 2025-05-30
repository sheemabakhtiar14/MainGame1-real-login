import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { User, UserState, GameProgress } from "../types/user";

// Initial state
const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  gameProgress: [],
};

// Load state from localStorage if available
const loadState = (): UserState => {
  try {
    const savedState = localStorage.getItem("userState");
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error("Error loading state from localStorage:", error);
  }
  return initialState;
};

// Action types
type UserAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "REGISTER"; payload: User }
  | { type: "UPDATE_PROGRESS"; payload: GameProgress };

// Reducer
const userReducer = (state: UserState, action: UserAction): UserState => {
  console.log("UserReducer: Processing action:", action.type);

  switch (action.type) {
    case "LOGIN":
      console.log("UserReducer: LOGIN action with payload:", action.payload);
      const loginState = {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
      console.log("UserReducer: New state after LOGIN:", loginState);
      return loginState;

    case "LOGOUT":
      console.log("UserReducer: LOGOUT action");
      return {
        ...initialState,
      };

    case "REGISTER":
      console.log("UserReducer: REGISTER action with payload:", action.payload);
      const registerState = {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
      console.log("UserReducer: New state after REGISTER:", registerState);
      return registerState;
    case "UPDATE_PROGRESS":
      // Check if progress for this mode already exists
      const existingProgressIndex = state.gameProgress.findIndex(
        (p) =>
          p.userId === action.payload.userId && p.mode === action.payload.mode
      );

      let updatedProgress;
      if (existingProgressIndex >= 0) {
        // Update existing progress
        updatedProgress = [...state.gameProgress];
        updatedProgress[existingProgressIndex] = action.payload;
      } else {
        // Add new progress
        updatedProgress = [...state.gameProgress, action.payload];
      }

      return {
        ...state,
        gameProgress: updatedProgress,
      };
    default:
      return state;
  }
};

// Context type
interface UserContextType {
  state: UserState;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  updateGameProgress: (progress: GameProgress) => void;
}

// Create context
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(userReducer, loadState());
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        console.log("Auth state changed: User is signed in", firebaseUser);

        // Get user metadata
        const createdAt = firebaseUser.metadata.creationTime
          ? new Date(firebaseUser.metadata.creationTime).toISOString()
          : new Date().toISOString();

        // Create user object from Firebase user
        const user: User = {
          id: firebaseUser.uid,
          username:
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "User",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: createdAt,
        };

        console.log("Creating user object:", user);
        dispatch({ type: "LOGIN", payload: user });
      } else {
        // User is signed out
        console.log("Auth state changed: User is signed out");
        dispatch({ type: "LOGOUT" });
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    console.log("UserContext state changed:", state);
    localStorage.setItem("userState", JSON.stringify(state));
  }, [state]);

  // Login with email and password
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log("Attempting to sign in with email and password:", email);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // User data is handled by the auth state listener
      console.log("User logged in successfully:", firebaseUser);

      // Return true to indicate successful login
      return true;
    } catch (error: any) {
      console.error("Login error:", error);

      // Provide more specific error messages based on Firebase error codes
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        console.error("Invalid email or password");
      } else if (error.code === "auth/invalid-email") {
        console.error("Invalid email format");
      } else if (error.code === "auth/user-disabled") {
        console.error("This account has been disabled");
      } else if (error.code === "auth/too-many-requests") {
        console.error(
          "Too many unsuccessful login attempts. Please try again later"
        );
      } else if (error.code === "auth/invalid-credential") {
        console.error(
          "Invalid credentials. Please check your email and password."
        );
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      // User data is handled by the auth state listener
      console.log("User logged in with Google:", firebaseUser);
      return true;
    } catch (error) {
      console.error("Google login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register with email and password
  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      console.log("UserContext: Register function called with:", {
        username,
        email,
      });

      setLoading(true);

      // Create user with email and password
      console.log("Creating user with email and password");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Update the user's display name
      console.log("Updating user profile with display name:", username);
      await firebaseUser.updateProfile({
        displayName: username,
      });

      // User data is handled by the auth state listener
      console.log("User registered successfully:", firebaseUser);
      return true;
    } catch (error: any) {
      console.error("Register error:", error);

      // Provide more specific error messages based on Firebase error codes
      if (error.code === "auth/email-already-in-use") {
        console.error(
          "Email is already in use - User should log in instead of registering"
        );
      } else if (error.code === "auth/invalid-email") {
        console.error("Invalid email format");
      } else if (error.code === "auth/weak-password") {
        console.error("Password is too weak");
      } else if (error.code === "auth/operation-not-allowed") {
        console.error("Email/password accounts are not enabled");
      } else if (error.code === "auth/missing-password") {
        console.error("Password is required");
      } else if (error.code === "auth/admin-restricted-operation") {
        console.error("This operation is restricted");
      } else {
        console.error("Unknown error during registration:", error.message);
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      // Auth state listener will handle the state update
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Update game progress
  const updateGameProgress = (progress: GameProgress) => {
    dispatch({ type: "UPDATE_PROGRESS", payload: progress });
  };

  return (
    <UserContext.Provider
      value={{
        state,
        login,
        loginWithGoogle,
        register,
        logout,
        updateGameProgress,
      }}
    >
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
