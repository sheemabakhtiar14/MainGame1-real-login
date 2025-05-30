# Firebase Integration Test Plan

## Overview

This document outlines the comprehensive testing plan for Firebase Firestore integration in the phishing simulation game.

## Test Environment

- **Project**: MainGame1-real-login
- **Firebase Project**: scambusters-d5ce4
- **Development Server**: http://localhost:5175

## Components Under Test

### 1. Firebase Configuration (`src/config/firebase.ts`)

- ✅ Firebase app initialization
- ✅ Authentication service setup
- ✅ Firestore database initialization
- ✅ Environment variables loaded correctly

### 2. Firebase Service (`src/services/firebaseService.ts`)

- ✅ `saveGameProgress()` - Save/update user progress
- ✅ `getUserGameProgress()` - Retrieve all user progress
- ✅ `getUserModeProgress()` - Get specific mode progress
- ✅ `getUserStats()` - Calculate user statistics
- ✅ `initializeUserProgress()` - Initialize default progress
- ✅ `deleteUserProgress()` - Clean up user data (for testing)

### 3. User Context (`src/context/UserContext.tsx`)

- ✅ Firebase integration in auth state listener
- ✅ Progress loading on login
- ✅ Progress saving functionality
- ✅ Proper error handling
- ✅ Local state synchronization

### 4. Game Modes

- ✅ **StandardMode**: Firebase progress tracking
- ✅ **EmailMode**: Firebase progress tracking
- ✅ **SocialMediaMode**: Firebase progress tracking
- ✅ **URLMode**: Firebase progress tracking

### 5. Dashboard (`src/pages/DashboardPage.tsx`)

- ✅ Real Firebase data display
- ✅ Progress statistics calculation
- ✅ Mode completion tracking

## Test Cases

### Manual Test Cases

#### Test Case 1: User Registration and Initialization

1. Register a new user account
2. Verify user progress is initialized for all modes
3. Check that dashboard shows zero progress initially

**Expected Results:**

- User document created in Firebase
- Progress documents created for all 4 game modes
- Dashboard displays initial state (0 scores, not completed)

#### Test Case 2: Game Progress Tracking

1. Play Standard Mode and complete level 1
2. Verify progress is saved to Firebase
3. Check dashboard updates with new progress
4. Logout and login again
5. Verify progress persists

**Expected Results:**

- Progress saved after level completion
- Dashboard shows updated scores and level
- Progress persists across login sessions

#### Test Case 3: Multiple Mode Progress

1. Play different game modes (Standard, Email, Social, URL)
2. Complete various levels in each mode
3. Verify individual mode progress tracking
4. Check aggregate statistics on dashboard

**Expected Results:**

- Each mode tracks progress independently
- Total statistics calculated correctly
- Completed modes counter accurate

#### Test Case 4: Progress Updates

1. Play a mode that was previously completed
2. Achieve a higher score
3. Verify progress updates with new high score
4. Ensure level progression is maintained

**Expected Results:**

- Higher scores replace lower scores
- Level progression never decreases
- Last played timestamp updates

### Automated Test Cases

#### Browser Console Tests

Use the following commands in browser console:

```javascript
// Test basic Firebase functionality
testFirebase("test-user-123");

// Test complete user flow
testUserFlow();
```

## Firebase Security Rules

Ensure Firestore rules allow authenticated users to read/write their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own game progress
    match /gameProgress/{progressId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## Key Metrics to Verify

### Data Persistence

- [ ] Progress saves correctly after level completion
- [ ] Progress saves correctly after game completion
- [ ] Progress persists across logout/login cycles
- [ ] Multiple users don't interfere with each other

### Performance

- [ ] Firebase operations complete within 2 seconds
- [ ] Dashboard loads user data efficiently
- [ ] No unnecessary Firebase calls

### Error Handling

- [ ] Graceful handling of Firebase connection issues
- [ ] Proper error messages for users
- [ ] Fallback behavior when offline
- [ ] No app crashes due to Firebase errors

## Test Results Log

### Test Session: [DATE/TIME]

**Tester:** [NAME]
**Environment:** [DEV/STAGING/PROD]

#### Test Results:

- [ ] User Registration and Initialization: ✅/❌
- [ ] Game Progress Tracking: ✅/❌
- [ ] Multiple Mode Progress: ✅/❌
- [ ] Progress Updates: ✅/❌
- [ ] Browser Console Tests: ✅/❌
- [ ] Data Persistence: ✅/❌
- [ ] Performance: ✅/❌
- [ ] Error Handling: ✅/❌

#### Issues Found:

1. [Issue description]
2. [Issue description]

#### Recommendations:

1. [Recommendation]
2. [Recommendation]

## Next Steps

1. **Execute Manual Tests** - Complete all manual test cases
2. **Run Automated Tests** - Use browser console test functions
3. **Performance Testing** - Monitor Firebase operation times
4. **User Acceptance Testing** - Have users test the complete flow
5. **Production Deployment** - Deploy with confidence after testing

## Firebase Console Verification

### Collections to Check:

- `gameProgress` - Contains all user progress documents
- Document ID format: `{userId}_{gameMode}`
- Fields: userId, mode, completed, highestLevel, score, correctAnswers, totalAnswers, lastPlayed, createdAt, updatedAt

### Queries to Run:

```
// Get all progress for a user
gameProgress where userId == "user123"

// Get completed modes only
gameProgress where completed == true

// Get recent activity
gameProgress order by updatedAt desc limit 10
```
