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
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { User, UserState, GameProgress } from "../types/user";
import { FirebaseService } from "../services/firebaseService";
import { GameMode } from "../types/game";

// Initial state
const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  gameProgress: [],
};

// Load state from localStorage if available (only user auth state, not progress)
const loadState = (): UserState => {
  try {
    const savedState = localStorage.getItem("userState");
    if (savedState) {
      const parsed = JSON.parse(savedState);
      // Only restore user and auth state, not gameProgress (Firebase handles that)
      return {
        user: parsed.user || null,
        isAuthenticated: parsed.isAuthenticated || false,
        gameProgress: [], // Always start with empty progress, Firebase will load it
      };
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
  | { type: "UPDATE_PROGRESS"; payload: GameProgress }
  | { type: "LOAD_PROGRESS"; payload: GameProgress[] }
  | { type: "UPDATE_USER"; payload: Partial<User> };

// Reducer
const userReducer = (state: UserState, action: UserAction): UserState => {
  console.log("UserReducer: Processing action:", action.type);

  switch (action.type) {
    case "LOGIN": {
      console.log("UserReducer: LOGIN action with payload:", action.payload);
      const loginState = {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
      console.log("UserReducer: New state after LOGIN:", loginState);
      return loginState;
    }

    case "LOGOUT":
      console.log("UserReducer: LOGOUT action");
      return {
        user: null,
        isAuthenticated: false,
        gameProgress: [], // Clear progress but keep structure
      };

    case "REGISTER": {
      console.log("UserReducer: REGISTER action with payload:", action.payload);
      const registerState = {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
      console.log("UserReducer: New state after REGISTER:", registerState);
      return registerState;
    }

    case "UPDATE_PROGRESS": {
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
    }

    case "LOAD_PROGRESS": {
      console.log(
        "UserReducer: LOAD_PROGRESS action with payload:",
        action.payload
      );
      const loadState = {
        ...state,
        gameProgress: action.payload,
      };
      console.log("UserReducer: New state after LOAD_PROGRESS:", loadState);
      return loadState;
    }

    case "UPDATE_USER": {
      console.log(
        "UserReducer: UPDATE_USER action with payload:",
        action.payload
      );
      if (!state.user) {
        console.log("UserReducer: No user to update");
        return state;
      }

      const updatedUser = {
        ...state.user,
        ...action.payload,
      };

      const updatedState = {
        ...state,
        user: updatedUser,
      };

      console.log("UserReducer: New state after UPDATE_USER:", updatedState);
      return updatedState;
    }

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
  updateGameProgress: (progress: GameProgress) => Promise<void>;
  loadUserProgress: () => Promise<void>;
  saveGameProgress: (
    mode: GameMode,
    progressData: {
      completed: boolean;
      highestLevel: number;
      score: number;
      correctAnswers: number;
      totalAnswers: number;
    }
  ) => Promise<void>;
  updateUserMoney: (newAmount: number) => Promise<void>;
  loadUserData: () => Promise<void>;
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
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
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
            money: 100, // Initialize with default money
          };

          console.log("Creating user object:", user);
          dispatch({ type: "LOGIN", payload: user });

          // Initialize progress for new users and load existing progress
          try {
            console.log(
              "🔄 Starting progress initialization for user:",
              user.id
            );
            await FirebaseService.initializeUserProgress(user.id);
            console.log("✅ Progress initialization completed");

            // Load user data including money
            console.log("🔄 Loading user data for user:", user.id);
            const userData = await FirebaseService.getUserData(user.id);
            if (userData) {
              console.log("📊 Retrieved user data from Firebase:", userData);

              // Convert Firebase Timestamp to string for compatibility
              const userDataUpdate: Partial<User> = {
                username: userData.username,
                email: userData.email,
                money: userData.money,
                photoURL: userData.photoURL,
                // Convert Timestamp to string if needed
                ...(userData.createdAt && {
                  createdAt: userData.createdAt.toDate().toISOString(),
                }),
              };

              dispatch({ type: "UPDATE_USER", payload: userDataUpdate });
            } else {
              console.log("No user data found, initializing with defaults");
              await FirebaseService.initializeUserData(user.id, {
                username: user.username,
                email: user.email,
                photoURL: user.photoURL,
              });
            }

            console.log("🔄 Loading existing progress for user:", user.id);
            const progress = await FirebaseService.getUserGameProgress(user.id);
            console.log("📊 Retrieved progress from Firebase:", progress);
            console.log("📊 Progress count:", progress.length);

            dispatch({ type: "LOAD_PROGRESS", payload: progress });
            console.log("✅ Progress loaded into state successfully");
          } catch (error) {
            console.error(
              "❌ Error during progress initialization/loading:",
              error
            );
          }
        } else {
          // User is signed out
          console.log("Auth state changed: User is signed out");
          dispatch({ type: "LOGOUT" });
        }
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Save state to localStorage whenever it changes (only user auth state, not progress)
  useEffect(() => {
    console.log("UserContext state changed:", state);
    // Only save user and auth state to localStorage, not gameProgress
    const stateToSave = {
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      // Don't save gameProgress to localStorage, Firebase handles that
    };
    localStorage.setItem("userState", JSON.stringify(stateToSave));
  }, [state.user, state.isAuthenticated, state]); // Include state to avoid warning

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
    } catch (error: unknown) {
      console.error("Login error:", error);

      // Provide more specific error messages based on Firebase error codes
      const firebaseError = error as { code?: string };
      if (
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/wrong-password"
      ) {
        console.error("Invalid email or password");
      } else if (firebaseError.code === "auth/invalid-email") {
        console.error("Invalid email format");
      } else if (firebaseError.code === "auth/user-disabled") {
        console.error("This account has been disabled");
      } else if (firebaseError.code === "auth/too-many-requests") {
        console.error(
          "Too many unsuccessful login attempts. Please try again later"
        );
      } else if (firebaseError.code === "auth/invalid-credential") {
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
      await updateProfile(firebaseUser, {
        displayName: username,
      });

      // User data is handled by the auth state listener
      console.log("User registered successfully:", firebaseUser);
      return true;
    } catch (error: unknown) {
      console.error("Register error:", error);

      // Provide more specific error messages based on Firebase error codes
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError.code === "auth/email-already-in-use") {
        console.error(
          "Email is already in use - User should log in instead of registering"
        );
      } else if (firebaseError.code === "auth/invalid-email") {
        console.error("Invalid email format");
      } else if (firebaseError.code === "auth/weak-password") {
        console.error("Password is too weak");
      } else if (firebaseError.code === "auth/operation-not-allowed") {
        console.error("Email/password accounts are not enabled");
      } else if (firebaseError.code === "auth/missing-password") {
        console.error("Password is required");
      } else if (firebaseError.code === "auth/admin-restricted-operation") {
        console.error("This operation is restricted");
      } else {
        console.error(
          "Unknown error during registration:",
          firebaseError.message || "Unknown error"
        );
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

  // Load user progress from Firebase
  const loadUserProgress = async (): Promise<void> => {
    if (!state.user) {
      console.log("loadUserProgress: No user logged in");
      return;
    }

    try {
      console.log(
        "loadUserProgress: Loading progress for user:",
        state.user.id
      );
      const progress = await FirebaseService.getUserGameProgress(state.user.id);
      console.log("loadUserProgress: Retrieved progress:", progress);
      dispatch({ type: "LOAD_PROGRESS", payload: progress });
      console.log("loadUserProgress: Progress loaded successfully");
    } catch (error) {
      console.error("loadUserProgress: Error loading user progress:", error);
    }
  }; // Save game progress to Firebase
  const saveGameProgress = async (
    mode: GameMode,
    progressData: {
      completed: boolean;
      highestLevel: number;
      score: number;
      correctAnswers: number;
      totalAnswers: number;
    }
  ): Promise<void> => {
    if (!state.user) {
      console.error("Cannot save progress: No user logged in");
      return;
    }

    try {
      console.log("Saving game progress to Firebase:", {
        userId: state.user.id,
        mode,
        progressData,
      });

      await FirebaseService.saveGameProgress(state.user.id, mode, progressData);

      // Update local state as well
      const updatedProgress: GameProgress = {
        userId: state.user.id,
        mode,
        ...progressData,
        lastPlayed: new Date().toISOString(),
      };

      console.log("Updating local state with progress:", updatedProgress);
      dispatch({ type: "UPDATE_PROGRESS", payload: updatedProgress });

      console.log("Game progress saved successfully");
    } catch (error) {
      console.error("Error saving game progress:", error);
      throw error;
    }
  };

  // Update game progress (legacy function - now uses Firebase)
  const updateGameProgress = async (progress: GameProgress): Promise<void> => {
    try {
      await saveGameProgress(progress.mode, {
        completed: progress.completed,
        highestLevel: progress.highestLevel,
        score: progress.score,
        correctAnswers: progress.correctAnswers,
        totalAnswers: progress.totalAnswers,
      });
    } catch (error) {
      console.error("Error updating game progress:", error);
    }
  };

  // Update user money
  const updateUserMoney = async (newAmount: number): Promise<void> => {
    if (!state.user) {
      console.error("Cannot update money: No user logged in");
      return;
    }

    try {
      console.log("Updating user money:", { userId: state.user.id, newAmount });

      // Update in Firebase
      await FirebaseService.updateUserMoney(state.user.id, newAmount);

      // Update local state
      dispatch({ type: "UPDATE_USER", payload: { money: newAmount } });

      console.log("User money updated successfully");
    } catch (error) {
      console.error("Error updating user money:", error);
      throw error;
    }
  };

  // Load user data including money
  const loadUserData = async (): Promise<void> => {
    if (!state.user) {
      console.log("loadUserData: No user logged in");
      return;
    }

    try {
      console.log("Loading user data for user:", state.user.id);

      // Load user data from Firebase
      const userData = await FirebaseService.getUserData(state.user.id);

      if (userData) {
        console.log("Retrieved user data:", userData);

        // Convert Firebase Timestamp to string for compatibility
        const userDataUpdate: Partial<User> = {
          username: userData.username,
          email: userData.email,
          money: userData.money,
          photoURL: userData.photoURL,
          // Convert Timestamp to string if needed
          ...(userData.createdAt && {
            createdAt: userData.createdAt.toDate().toISOString(),
          }),
        };

        dispatch({ type: "UPDATE_USER", payload: userDataUpdate });
      } else {
        console.log("No user data found, initializing with defaults");
        // Initialize user data if it doesn't exist
        await FirebaseService.initializeUserData(state.user.id, {
          username: state.user.username,
          email: state.user.email,
          photoURL: state.user.photoURL,
        });
      }

      console.log("User data loaded successfully");
    } catch (error) {
      console.error("Error loading user data:", error);
    }
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
        loadUserProgress,
        saveGameProgress,
        updateUserMoney,
        loadUserData,
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
