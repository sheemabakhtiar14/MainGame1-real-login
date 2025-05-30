import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { GameState, GameMode, GameLevel } from "../types/game";

const initialState: GameState = {
  mode: null,
  level: 1,
  score: 0,
  money: 100,
  correctAnswers: 0,
  totalAnswers: 0,
  currentQuestion: 0,
  gameStarted: false,
  gameCompleted: false,
  overallCorrectAnswers: 0,
  overallTotalAnswers: 0,
};

type GameAction =
  | { type: "SET_MODE"; payload: GameMode }
  | { type: "SET_LEVEL"; payload: GameLevel }
  | { type: "ANSWER_CORRECT" }
  | { type: "ANSWER_INCORRECT" }
  | { type: "NEXT_QUESTION" }
  | { type: "START_GAME" }
  | { type: "COMPLETE_GAME" }
  | { type: "RESET_GAME" }
  | { type: "RESET_LEVEL" }
  | {
      type: "INITIALIZE_WITH_PROGRESS";
      payload: {
        mode: GameMode;
        level: GameLevel;
        score: number;
        money: number;
      };
    };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "SET_MODE":
      return {
        ...state,
        mode: action.payload,
        level: 1,
        currentQuestion: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        gameCompleted: false,
        // Reset overall scores when starting a new game mode
        overallCorrectAnswers: 0,
        overallTotalAnswers: 0,
      };
    case "SET_LEVEL":
      return {
        ...state,
        level: action.payload,
        currentQuestion: 0,
        correctAnswers: 0,
        totalAnswers: 0,
      };
    case "ANSWER_CORRECT":
      return {
        ...state,
        score: state.score + 10,
        money: state.money + 25,
        correctAnswers: state.correctAnswers + 1,
        totalAnswers: state.totalAnswers + 1,
        // Update overall scores
        overallCorrectAnswers: state.overallCorrectAnswers + 1,
        overallTotalAnswers: state.overallTotalAnswers + 1,
      };
    case "ANSWER_INCORRECT":
      return {
        ...state,
        money: Math.max(0, state.money - 10),
        totalAnswers: state.totalAnswers + 1,
        // Update overall total answers
        overallTotalAnswers: state.overallTotalAnswers + 1,
      };
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
      };
    case "START_GAME":
      return {
        ...state,
        gameStarted: true,
        gameCompleted: false,
      };
    case "COMPLETE_GAME":
      return {
        ...state,
        gameCompleted: true,
      };
    case "RESET_GAME":
      return {
        ...initialState,
        money: state.money,
      };
    case "RESET_LEVEL":
      return {
        ...state,
        currentQuestion: 0,
        correctAnswers: 0,
        totalAnswers: 0,
      };
    case "INITIALIZE_WITH_PROGRESS":
      return {
        ...state,
        mode: action.payload.mode,
        level: action.payload.level,
        score: action.payload.score,
        money: action.payload.money,
        currentQuestion: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        gameStarted: false,
        gameCompleted: false,
      };
    default:
      return state;
  }
};

interface GameContextType {
  state: GameState;
  selectMode: (mode: GameMode) => void;
  setLevel: (level: GameLevel) => void;
  answerQuestion: (isCorrect: boolean) => void;
  nextQuestion: () => void;
  startGame: () => void;
  completeGame: () => void;
  resetGame: () => void;
  resetLevel: () => void;
  checkLevelCompletion: () => boolean;
  checkGameCompletion: () => boolean;
  initializeWithProgress: (
    mode: GameMode,
    level: GameLevel,
    score: number,
    money: number
  ) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const selectMode = (mode: GameMode) => {
    dispatch({ type: "SET_MODE", payload: mode });
  };

  const setLevel = (level: GameLevel) => {
    dispatch({ type: "SET_LEVEL", payload: level });
  };

  const answerQuestion = (isCorrect: boolean) => {
    if (isCorrect) {
      dispatch({ type: "ANSWER_CORRECT" });
    } else {
      dispatch({ type: "ANSWER_INCORRECT" });
    }
  };

  const nextQuestion = () => {
    dispatch({ type: "NEXT_QUESTION" });
  };

  const startGame = () => {
    dispatch({ type: "START_GAME" });
  };

  const completeGame = () => {
    dispatch({ type: "COMPLETE_GAME" });
  };

  const resetGame = () => {
    dispatch({ type: "RESET_GAME" });
  };

  const resetLevel = () => {
    dispatch({ type: "RESET_LEVEL" });
  };

  const checkLevelCompletion = () => {
    // Level is completed if user answered 3 questions
    // Move to next level if at least 2 questions are correct
    return state.totalAnswers === 3;
  };

  const checkGameCompletion = () => {
    // Game is completed if user is on level 3 and has answered all questions
    return state.level === 3 && state.totalAnswers === 3;
  };

  const initializeWithProgress = (
    mode: GameMode,
    level: GameLevel,
    score: number,
    money: number
  ) => {
    dispatch({
      type: "INITIALIZE_WITH_PROGRESS",
      payload: { mode, level, score, money },
    });
  };

  return (
    <GameContext.Provider
      value={{
        state,
        selectMode,
        setLevel,
        answerQuestion,
        nextQuestion,
        startGame,
        completeGame,
        resetGame,
        resetLevel,
        checkLevelCompletion,
        checkGameCompletion,
        initializeWithProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
