/**
 * Debug Progress Loading Issues
 *
 * This script helps identify why progress isn't loading when users log back in
 */

// Check if user is logged in and what their state looks like
export const debugProgressLoading = () => {
  console.log("🔍 DEBUGGING PROGRESS LOADING ISSUE");
  console.log("=====================================");

  // Check localStorage
  const userState = localStorage.getItem("userState");
  console.log("📱 localStorage userState:", userState);

  if (userState) {
    try {
      const parsed = JSON.parse(userState);
      console.log("📱 Parsed userState:", parsed);
      console.log("📱 User ID:", parsed.user?.id);
      console.log("📱 Is Authenticated:", parsed.isAuthenticated);
      console.log("📱 Game Progress in localStorage:", parsed.gameProgress);
    } catch (e) {
      console.error("❌ Error parsing userState:", e);
    }
  }

  // Check if React context has the user
  console.log("🔍 Checking React context...");
  console.log("Note: Open React DevTools to inspect UserContext state");

  // Instructions for manual testing
  console.log("\n📋 MANUAL TESTING STEPS:");
  console.log("1. Open browser DevTools (F12)");
  console.log("2. Go to Console tab");
  console.log("3. Login to your account");
  console.log("4. Look for these log messages:");
  console.log('   - "🔄 Starting progress initialization for user: [userID]"');
  console.log('   - "📊 Retrieved progress from Firebase: [array]"');
  console.log('   - "✅ Progress loaded into state successfully"');
  console.log("5. If you see errors, copy them and report back");

  console.log("\n🧪 ADDITIONAL TESTS TO RUN:");
  console.log("1. testCurrentUserProgress() - after logging in");
  console.log('2. testFirebase("your-user-id") - replace with actual user ID');
  console.log("3. Check Firebase Console for data");
};

// Test if Firebase service is working independently
export const testFirebaseConnection = async () => {
  console.log("🔥 Testing Firebase connection...");

  try {
    // Try to access Firebase
    const { FirebaseService } = await import("../services/firebaseService");
    console.log("✅ Firebase service imported successfully");

    // Test with a dummy user ID to see if we get proper errors
    try {
      const result = await FirebaseService.getUserGameProgress(
        "test-connection"
      );
      console.log("✅ Firebase connection working, result:", result);
    } catch (error) {
      console.log("⚠️ Firebase query failed (expected for test user):", error);
      console.log(
        "This is normal - it means Firebase is connected but no data exists"
      );
    }
  } catch (error) {
    console.error("❌ Firebase service import failed:", error);
  }
};

// Check what's in Firebase Console
export const checkFirebaseConsole = () => {
  console.log("🌐 FIREBASE CONSOLE CHECKLIST:");
  console.log("==============================");
  console.log("1. Go to: https://console.firebase.google.com/");
  console.log("2. Select project: scambusters-d5ce4");
  console.log("3. Go to Firestore Database");
  console.log("4. Look for collection: gameProgress");
  console.log("5. Check if documents exist with format: userID_gameMode");
  console.log("6. Verify document structure has these fields:");
  console.log(
    "   - userId, mode, completed, highestLevel, score, correctAnswers, totalAnswers"
  );
  console.log("   - createdAt, updatedAt, lastPlayed (timestamps)");

  console.log("\n🔧 FIRESTORE RULES TO CHECK:");
  console.log(
    "Make sure these rules allow authenticated users to read their data:"
  );
  console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /gameProgress/{progressId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
  `);
};

if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).debugProgressLoading = debugProgressLoading;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).testFirebaseConnection = testFirebaseConnection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).checkFirebaseConsole = checkFirebaseConsole;
}
