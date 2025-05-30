import React, { useState} from "react";
import { useUser } from "../context/UserContext";
import { FirebaseService } from "../services/firebaseService";
import Button from "../components/Button";
import Card from "../components/Card";

const FirebaseTestPage: React.FC = () => {
  const { state } = useUser();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const runFirebaseTest = async () => {
    if (!state.user) {
      addResult("❌ No user logged in - please login first");
      return;
    }

    setIsLoading(true);
    setTestResults([]);
    addResult("🔥 Starting Firebase connectivity test...");

    try {
      // Test 1: Initialize user progress
      addResult("📝 Test 1: Initializing user progress...");
      await FirebaseService.initializeUserProgress(state.user.id);
      addResult("✅ User progress initialized successfully");

      // Test 2: Save test progress
      addResult("📝 Test 2: Saving test progress...");
      await FirebaseService.saveGameProgress(state.user.id, "standard", {
        completed: false,
        highestLevel: 1,
        score: 50,
        correctAnswers: 3,
        totalAnswers: 5,
      });
      addResult("✅ Test progress saved successfully");

      // Test 3: Retrieve progress
      addResult("📝 Test 3: Retrieving user progress...");
      const progress = await FirebaseService.getUserGameProgress(state.user.id);
      addResult(`✅ Retrieved ${progress.length} progress records`);

      // Test 4: Get statistics
      addResult("📝 Test 4: Getting user statistics...");
      const stats = await FirebaseService.getUserStats(state.user.id);
      addResult(
        `✅ Stats - Score: ${stats.totalScore}, Accuracy: ${stats.accuracy}%`
      );

      addResult("🎉 All Firebase tests passed successfully!");
    } catch (error) {
      addResult(
        `❌ Firebase test failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            Firebase Test Page
          </h1>

          <div className="mb-6">
            <p className="text-gray-300 mb-4">
              This page allows you to test Firebase connectivity and
              functionality.
            </p>

            {state.user ? (
              <p className="text-green-400">
                ✅ Logged in as: {state.user.email}
              </p>
            ) : (
              <p className="text-red-400">
                ❌ Not logged in - please login first
              </p>
            )}
          </div>

          <div className="mb-6">
            <Button
              onClick={runFirebaseTest}
              disabled={!state.user || isLoading}
              className="mb-4"
            >
              {isLoading ? "Running Tests..." : "Run Firebase Test"}
            </Button>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-3">
              Test Results:
            </h3>
            {testResults.length === 0 ? (
              <p className="text-gray-400">
                No tests run yet. Click the button above to start testing.
              </p>
            ) : (
              <div className="space-y-1">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`text-sm font-mono ${
                      result.includes("❌")
                        ? "text-red-400"
                        : result.includes("✅")
                        ? "text-green-400"
                        : result.includes("🔥") || result.includes("🎉")
                        ? "text-blue-400"
                        : "text-gray-300"
                    }`}
                  >
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-400">
            <p>This test page verifies:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Firebase connection and authentication</li>
              <li>Firestore read/write operations</li>
              <li>Progress saving and retrieval</li>
              <li>Statistics calculation</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FirebaseTestPage;
