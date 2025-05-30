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

export interface CommunityReport {
  id?: string;
  type: string;
  description: string;
  location?: string;
  reportedBy: string;
  timestamp: string;
  upvotes: number;
  verified: boolean;
  upvotedBy?: string[];
}

export interface FirebaseCommunityReport
  extends Omit<CommunityReport, "timestamp"> {
  timestamp: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class FirebaseService {
  // Collection references
  private static USERS_COLLECTION = "users";
  private static GAME_PROGRESS_COLLECTION = "gameProgress";
  private static COMMUNITY_REPORTS_COLLECTION = "communityReports";

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
  /**
   * Save user data (including money) to Firebase
   */
  static async saveUserData(
    userId: string,
    userData: Partial<{
      username: string;
      email: string;
      money: number;
      photoURL?: string;
    }>
  ): Promise<void> {
    try {
      console.log(`Saving user data for ${userId}:`, userData);
      const userRef = doc(db, this.USERS_COLLECTION, userId);

      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp(),
      });

      console.log(`User data saved successfully for ${userId}`);
    } catch (error) {
      console.error("Error saving user data:", error);
      throw new Error("Failed to save user data");
    }
  }

  /**
   * Get user data (including money) from Firebase
   */
  static async getUserData(userId: string): Promise<{
    username: string;
    email: string;
    money: number;
    photoURL?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  } | null> {
    try {
      console.log(`Fetching user data for ${userId}`);
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log(`User data retrieved for ${userId}:`, data);
        return data as {
          username: string;
          email: string;
          money: number;
          photoURL?: string;
          createdAt?: Timestamp;
          updatedAt?: Timestamp;
        };
      } else {
        console.log(`No user data found for ${userId}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw new Error("Failed to fetch user data");
    }
  }

  /**
   * Initialize user document with default money amount
   */
  static async initializeUserData(
    userId: string,
    userData: {
      username: string;
      email: string;
      photoURL?: string;
    }
  ): Promise<void> {
    try {
      console.log(`Initializing user data for ${userId}`);
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          ...userData,
          money: 100, // Default starting money
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        console.log(
          `User data initialized for ${userId} with $100 starting money`
        );
      } else {
        console.log(`User data already exists for ${userId}`);
      }
    } catch (error) {
      console.error("Error initializing user data:", error);
      throw new Error("Failed to initialize user data");
    }
  }

  /**
   * Update user's virtual money
   */
  static async updateUserMoney(
    userId: string,
    newMoneyAmount: number
  ): Promise<void> {
    try {
      console.log(`Updating money for ${userId} to $${newMoneyAmount}`);
      const userRef = doc(db, this.USERS_COLLECTION, userId);

      await updateDoc(userRef, {
        money: newMoneyAmount,
        updatedAt: serverTimestamp(),
      });

      console.log(
        `Money updated successfully for ${userId}: $${newMoneyAmount}`
      );
    } catch (error) {
      console.error("Error updating user money:", error);
      throw new Error("Failed to update user money");
    }
  }

  /**
   * Submit a community scam report
   */
  static async submitCommunityReport(
    report: Omit<CommunityReport, "id">
  ): Promise<string> {
    try {
      console.log("Submitting community report:", report);

      const reportsRef = collection(db, this.COMMUNITY_REPORTS_COLLECTION);
      const docRef = doc(reportsRef);

      const reportData: FirebaseCommunityReport = {
        ...report,
        timestamp: Timestamp.fromDate(new Date(report.timestamp)),
        upvotedBy: [],
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      };

      await setDoc(docRef, reportData);

      console.log(
        "Community report submitted successfully with ID:",
        docRef.id
      );
      return docRef.id;
    } catch (error) {
      console.error("Error submitting community report:", error);
      throw new Error("Failed to submit community report");
    }
  }

  /**
   * Get all community reports, ordered by timestamp (newest first)
   */
  static async getCommunityReports(): Promise<CommunityReport[]> {
    try {
      console.log("Loading community reports...");

      const reportsRef = collection(db, this.COMMUNITY_REPORTS_COLLECTION);
      const q = query(reportsRef, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);

      const reports: CommunityReport[] = snapshot.docs.map((doc) => {
        const data = doc.data() as FirebaseCommunityReport;
        return {
          id: doc.id,
          type: data.type,
          description: data.description,
          location: data.location,
          reportedBy: data.reportedBy,
          timestamp: data.timestamp.toDate().toISOString(),
          upvotes: data.upvotes,
          verified: data.verified,
          upvotedBy: data.upvotedBy || [],
        };
      });

      console.log(`Loaded ${reports.length} community reports`);
      return reports;
    } catch (error) {
      console.error("Error loading community reports:", error);
      throw new Error("Failed to load community reports");
    }
  }

  /**
   * Upvote a community report
   */
  static async upvoteCommunityReport(
    reportId: string,
    userId: string
  ): Promise<void> {
    try {
      console.log(`Upvoting report ${reportId} by user ${userId}`);

      const reportRef = doc(db, this.COMMUNITY_REPORTS_COLLECTION, reportId);
      const reportDoc = await getDoc(reportRef);

      if (!reportDoc.exists()) {
        throw new Error("Report not found");
      }

      const reportData = reportDoc.data() as FirebaseCommunityReport;
      const upvotedBy = reportData.upvotedBy || [];

      // Check if user already upvoted
      if (upvotedBy.includes(userId)) {
        console.log("User has already upvoted this report");
        return;
      }

      // Add user to upvotedBy array and increment upvotes
      await updateDoc(reportRef, {
        upvotes: reportData.upvotes + 1,
        upvotedBy: [...upvotedBy, userId],
        updatedAt: serverTimestamp(),
      });

      console.log("Report upvoted successfully");
    } catch (error) {
      console.error("Error upvoting community report:", error);
      throw new Error("Failed to upvote community report");
    }
  }

  /**
   * Mark a community report as verified (admin function)
   */
  static async verifyReport(reportId: string): Promise<void> {
    try {
      console.log(`Verifying report ${reportId}`);

      const reportRef = doc(db, this.COMMUNITY_REPORTS_COLLECTION, reportId);
      await updateDoc(reportRef, {
        verified: true,
        updatedAt: serverTimestamp(),
      });

      console.log("Report verified successfully");
    } catch (error) {
      console.error("Error verifying report:", error);
      throw new Error("Failed to verify report");
    }
  }
}
