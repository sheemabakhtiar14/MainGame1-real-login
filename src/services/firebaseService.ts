import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { GameProgress } from "../types/user";
import { GameMode } from "../types/game";

export interface FirebaseGameProgress extends Omit<GameProgress, "lastPlayed"> {
  lastPlayed: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class FirebaseService {
  // Collection references
  private static USERS_COLLECTION = "users";
  private static GAME_PROGRESS_COLLECTION = "gameProgress";

  /**
   * Save or update game progress for a user
   */
  static async saveGameProgress(
    userId: string,
    mode: GameMode,
    progressData: {
      completed: boolean;
      highestLevel: number;
      score: number;
      correctAnswers: number;
      totalAnswers: number;
    }
  ): Promise<void> {
    try {
      const progressId = `${userId}_${mode}`;
      const progressRef = doc(db, this.GAME_PROGRESS_COLLECTION, progressId);

      // Check if document exists
      const progressDoc = await getDoc(progressRef);
      const now = serverTimestamp();

      if (progressDoc.exists()) {
        // Update existing progress
        const existingData = progressDoc.data() as FirebaseGameProgress;

        // Only update if new score is higher or progress is more advanced
        const shouldUpdate =
          progressData.score > existingData.score ||
          progressData.highestLevel > existingData.highestLevel ||
          progressData.completed !== existingData.completed;

        if (shouldUpdate) {
          await updateDoc(progressRef, {
            ...progressData,
            lastPlayed: now,
            updatedAt: now,
          });
          console.log(
            `Updated game progress for user ${userId} in ${mode} mode`
          );
        }
      } else {
        // Create new progress document
        await setDoc(progressRef, {
          userId,
          mode,
          ...progressData,
          lastPlayed: now,
          createdAt: now,
          updatedAt: now,
        });
        console.log(
          `Created new game progress for user ${userId} in ${mode} mode`
        );
      }
    } catch (error) {
      console.error("Error saving game progress:", error);
      throw new Error("Failed to save game progress");
    }
  }
  /**
   * Get all game progress for a specific user
   */
  static async getUserGameProgress(userId: string): Promise<GameProgress[]> {
    try {
      console.log(`Fetching game progress for user: ${userId}`);

      // Try with orderBy first
      let progressQuery = query(
        collection(db, this.GAME_PROGRESS_COLLECTION),
        where("userId", "==", userId),
        orderBy("updatedAt", "desc")
      );

      let progressSnapshot;
      try {
        progressSnapshot = await getDocs(progressQuery);
        console.log(
          `Retrieved ${progressSnapshot.docs.length} progress documents with orderBy`
        );
      } catch (indexError) {
        console.warn(
          "OrderBy query failed, trying without orderBy:",
          indexError
        );
        // Fallback to query without orderBy if composite index doesn't exist
        progressQuery = query(
          collection(db, this.GAME_PROGRESS_COLLECTION),
          where("userId", "==", userId)
        );
        progressSnapshot = await getDocs(progressQuery);
        console.log(
          `Retrieved ${progressSnapshot.docs.length} progress documents without orderBy`
        );
      }

      const results = progressSnapshot.docs.map((doc) => {
        const data = doc.data() as FirebaseGameProgress;
        console.log(`Processing document ${doc.id}:`, data);
        return {
          ...data,
          lastPlayed: data.lastPlayed
            ? data.lastPlayed.toDate().toISOString()
            : "",
        };
      });

      console.log(`Returning ${results.length} progress records:`, results);
      return results;
    } catch (error) {
      console.error("Error fetching user game progress:", error);
      throw new Error("Failed to fetch game progress");
    }
  }

  /**
   * Get game progress for a specific user and mode
   */
  static async getUserModeProgress(
    userId: string,
    mode: GameMode
  ): Promise<GameProgress | null> {
    try {
      const progressId = `${userId}_${mode}`;
      const progressRef = doc(db, this.GAME_PROGRESS_COLLECTION, progressId);
      const progressDoc = await getDoc(progressRef);

      if (!progressDoc.exists()) {
        return null;
      }

      const data = progressDoc.data() as FirebaseGameProgress;
      return {
        ...data,
        lastPlayed: data.lastPlayed
          ? data.lastPlayed.toDate().toISOString()
          : "",
      };
    } catch (error) {
      console.error("Error fetching user mode progress:", error);
      throw new Error("Failed to fetch mode progress");
    }
  }

  /**
   * Delete all game progress for a user (useful for testing or account deletion)
   */
  static async deleteUserProgress(userId: string): Promise<void> {
    try {
      const progressQuery = query(
        collection(db, this.GAME_PROGRESS_COLLECTION),
        where("userId", "==", userId)
      );

      const progressSnapshot = await getDocs(progressQuery);

      const deletePromises = progressSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );

      await Promise.all(deletePromises);
      console.log(`Deleted all progress for user ${userId}`);
    } catch (error) {
      console.error("Error deleting user progress:", error);
      throw new Error("Failed to delete user progress");
    }
  }

  /**
   * Get user statistics (totals across all modes)
   */
  static async getUserStats(userId: string): Promise<{
    totalScore: number;
    totalCorrectAnswers: number;
    totalQuestions: number;
    completedModes: number;
    accuracy: number;
  }> {
    try {
      const allProgress = await this.getUserGameProgress(userId);

      const totalScore = allProgress.reduce(
        (sum, progress) => sum + progress.score,
        0
      );
      const totalCorrectAnswers = allProgress.reduce(
        (sum, progress) => sum + progress.correctAnswers,
        0
      );
      const totalQuestions = allProgress.reduce(
        (sum, progress) => sum + progress.totalAnswers,
        0
      );
      const completedModes = allProgress.filter(
        (progress) => progress.completed
      ).length;
      const accuracy =
        totalQuestions > 0
          ? Math.round((totalCorrectAnswers / totalQuestions) * 100)
          : 0;

      return {
        totalScore,
        totalCorrectAnswers,
        totalQuestions,
        completedModes,
        accuracy,
      };
    } catch (error) {
      console.error("Error calculating user stats:", error);
      return {
        totalScore: 0,
        totalCorrectAnswers: 0,
        totalQuestions: 0,
        completedModes: 0,
        accuracy: 0,
      };
    }
  }
  /**
   * Initialize default progress for all game modes for a new user
   */
  static async initializeUserProgress(userId: string): Promise<void> {
    try {
      console.log(`🔄 Initializing progress for user: ${userId}`);
      const modes: GameMode[] = ["standard", "email", "social", "url"];
      const now = serverTimestamp();

      const initPromises = modes.map(async (mode) => {
        const progressId = `${userId}_${mode}`;
        const progressRef = doc(db, this.GAME_PROGRESS_COLLECTION, progressId);

        // Check if document already exists
        const progressDoc = await getDoc(progressRef);

        if (!progressDoc.exists()) {
          console.log(
            `📝 Creating initial progress for ${userId} - ${mode} mode`
          );
          await setDoc(progressRef, {
            userId,
            mode,
            completed: false,
            highestLevel: 0,
            score: 0,
            correctAnswers: 0,
            totalAnswers: 0,
            lastPlayed: null,
            createdAt: now,
            updatedAt: now,
          });
          console.log(
            `✅ Created initial progress for ${userId} - ${mode} mode`
          );
        } else {
          console.log(
            `ℹ️ Progress already exists for ${userId} - ${mode} mode`
          );
        }
      });

      await Promise.all(initPromises);
      console.log(`✅ Progress initialization completed for user ${userId}`);
    } catch (error) {
      console.error("❌ Error initializing user progress:", error);
      // Don't throw error here as this is not critical for login
    }
  }
}
