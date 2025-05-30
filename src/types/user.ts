export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  photoURL?: string;
}

export interface GameProgress {
  userId: string;
  mode: "standard" | "email" | "social" | "url";
  completed: boolean;
  highestLevel: number;
  score: number;
  correctAnswers: number;
  totalAnswers: number;
  lastPlayed: string;
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  gameProgress: GameProgress[];
}
