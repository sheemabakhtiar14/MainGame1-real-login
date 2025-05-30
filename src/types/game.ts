export type GameMode = "standard" | "email" | "social" | "url";

export type GameLevel = 1 | 2 | 3;

export interface GameState {
  mode: GameMode | null;
  level: GameLevel;
  score: number;
  money: number;
  correctAnswers: number;
  totalAnswers: number;
  currentQuestion: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  // Track overall scores across all levels
  overallCorrectAnswers: number;
  overallTotalAnswers: number;
}

export interface Question {
  id: string;
  question: string;
  options: Option[];
  level: GameLevel;
  explanation: string;
  correct: number;
}

export interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface EmailQuestion {
  id: string;
  subject: string;
  sender: string;
  content: string;
  level: GameLevel;
  isScam: boolean;
  explanation: string;
}

export interface SocialMediaQuestion {
  id: string;
  username: string;
  profilePic: string;
  content: string;
  image?: string;
  level: GameLevel;
  isScam: boolean;
  explanation: string;
}

export interface URLQuestion {
  id: string;
  url: string;
  description: string;
  level: GameLevel;
  isScam: boolean;
  explanation: string;
}

export interface Answer {
  questionId: string;
  isCorrect: boolean;
}
