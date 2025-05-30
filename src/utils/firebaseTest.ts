import { FirebaseService } from "../services/firebaseService";
import { GameMode } from "../types/game";

/**
 * Test Firebase functionality
 * This function can be called from the browser console for debugging
 */
export const testFirebase = async (userId: string) => {
  console.log("🔥 Starting Comprehensive Firebase Test...");
  console.log("User ID:", userId);

  try {
    // Test 1: Initialize user progress
    console.log("\n📝 Test 1: Initializing user progress...");
    await FirebaseService.initializeUserProgress(userId);
    console.log("✅ User progress initialized successfully");

    // Test 2: Save progress for multiple modes
    console.log("\n📝 Test 2: Saving test progress data for multiple modes...");

    // Standard mode progress
    await FirebaseService.saveGameProgress(userId, "standard", {
      completed: false,
      highestLevel: 3,
      score: 150,
      correctAnswers: 8,
      totalAnswers: 10,
    });
    console.log("✅ Standard mode progress saved");

    // Email mode progress
    await FirebaseService.saveGameProgress(userId, "email", {
      completed: true,
      highestLevel: 5,
      score: 200,
      correctAnswers: 15,
      totalAnswers: 20,
    });
    console.log("✅ Email mode progress saved");

    // Social mode progress
    await FirebaseService.saveGameProgress(userId, "social", {
      completed: false,
      highestLevel: 2,
      score: 100,
      correctAnswers: 5,
      totalAnswers: 8,
    });
    console.log("✅ Social mode progress saved");

    // Test 3: Retrieve all user progress
    console.log("\n📝 Test 3: Retrieving all user progress...");
    const allProgress = await FirebaseService.getUserGameProgress(userId);
    console.log("✅ All user progress retrieved:");
    console.table(allProgress);

    // Test 4: Get specific mode progress
    console.log("\n📝 Test 4: Getting specific mode progress...");
    const modes: GameMode[] = ["standard", "email", "social", "url"];

    for (const mode of modes) {
      const modeProgress = await FirebaseService.getUserModeProgress(
        userId,
        mode
      );
      console.log(`✅ ${mode} mode progress:`, modeProgress);
    }

    // Test 5: Get user statistics
    console.log("\n📝 Test 5: Getting user statistics...");
    const stats = await FirebaseService.getUserStats(userId);
    console.log("✅ User statistics:");
    console.table(stats);

    // Test 6: Update existing progress
    console.log("\n📝 Test 6: Updating existing progress...");
    await FirebaseService.saveGameProgress(userId, "standard", {
      completed: false,
      highestLevel: 4, // Higher level
      score: 200, // Higher score
      correctAnswers: 10,
      totalAnswers: 12,
    });

    const updatedProgress = await FirebaseService.getUserModeProgress(
      userId,
      "standard"
    );
    console.log("✅ Updated standard mode progress:", updatedProgress);

    console.log("\n🎉 All Firebase tests completed successfully!");
    return {
      success: true,
      allProgress,
      stats,
      updatedProgress,
    };
  } catch (error) {
    console.error("\n❌ Firebase test failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Test the complete user flow from login to progress tracking
 */
export const testUserFlow = async () => {
  console.log("🎮 Testing complete user flow...");

  // This would be called after a user logs in
  const testUserId = "test-user-" + Date.now();
  console.log("Using test user ID:", testUserId);

  const result = await testFirebase(testUserId);

  if (result.success) {
    console.log("\n✅ User flow test completed successfully!");
    console.log("Dashboard would show:");
    console.log("- Total Score:", result.stats?.totalScore);
    console.log("- Accuracy:", result.stats?.accuracy + "%");
    console.log("- Completed Modes:", result.stats?.completedModes);
  } else {
    console.log("\n❌ User flow test failed:", result.error);
  }

  return result;
};

/**
 * Test current user's progress loading
 */
export const testCurrentUserProgress = async () => {
  console.log("🧪 Testing current user progress loading...");

  // Get current user from context (this requires the app to be running)
  const userState = localStorage.getItem("userState");
  if (!userState) {
    console.log("❌ No user state found in localStorage");
    return;
  }

  try {
    const parsed = JSON.parse(userState);
    if (!parsed.user || !parsed.user.id) {
      console.log("❌ No user ID found in localStorage");
      return;
    }

    const userId = parsed.user.id;
    console.log("📱 Current user ID:", userId);

    // Test Firebase directly
    console.log("📝 Testing direct Firebase access...");
    const progress = await FirebaseService.getUserGameProgress(userId);
    console.log("✅ Progress from Firebase:", progress);

    if (progress.length === 0) {
      console.log(
        "⚠️ No progress found for user - this might be expected for new users"
      );
    } else {
      console.log("📊 Progress summary:");
      progress.forEach((p) => {
        console.log(
          `  - ${p.mode}: Level ${p.highestLevel}, Score ${p.score}, Completed: ${p.completed}`
        );
      });
    }

    return { success: true, userId, progress };
  } catch (error) {
    console.error("❌ Error testing current user progress:", error);
    return { success: false, error };
  }
};

// Make test functions globally available for browser console testing
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).testFirebase = testFirebase;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).testUserFlow = testUserFlow;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).testCurrentUserProgress = testCurrentUserProgress;
}
