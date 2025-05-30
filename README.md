# CyberSafe - Cybersecurity Educational Game

CyberSafe is an interactive educational game designed to teach users about cybersecurity awareness through engaging gameplay. The application simulates various scenarios like phishing emails, suspicious text messages, social media scams, and malicious URLs to help users learn how to identify and avoid cyber threats.

## Features

- Multiple game modes (Standard, Email, Social Media, URL)
- Progressive difficulty levels
- User authentication with email/password and Google sign-in
- User dashboard to track progress
- Educational resources about cybersecurity

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Firebase Authentication
- Framer Motion for animations
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd cybersafe
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up Firebase:

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and set up Email/Password and Google sign-in methods
   - Get your Firebase configuration from Project Settings > General > Your Apps > Web App
   - Copy the `.env.example` file to `.env` and fill in your Firebase configuration:
     ```
     cp .env.example .env
     ```
   - Edit the `.env` file with your Firebase credentials

4. Start the development server:

   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Firebase Authentication Setup

### Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the steps to create a new project
3. Name your project (e.g., "CyberSafe")
4. Enable Google Analytics if you want (optional)
5. Click "Create project"

### Step 2: Register your web app

1. Once your project is created, click on the web icon (</>) to add a web app
2. Register your app with a nickname (e.g., "CyberSafe Web")
3. Check "Also set up Firebase Hosting" if you plan to deploy your app (optional)
4. Click "Register app"
5. Copy the Firebase configuration to your `.env` file. For this project, the configuration is:

```
VITE_FIREBASE_API_KEY=AIzaSyBTbfhgRJfaSraRCAUUZjnXCjLWjD1nV9E
VITE_FIREBASE_AUTH_DOMAIN=scambusters-d5ce4.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=scambusters-d5ce4
VITE_FIREBASE_STORAGE_BUCKET=scambusters-d5ce4.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=273674111035
VITE_FIREBASE_APP_ID=1:273674111035:web:d5b3db31a3fd68fd69341e
```

### Step 3: Enable Authentication Methods

1. In the Firebase Console, go to "Authentication" in the left sidebar
2. Click on "Get started" or "Sign-in method" tab
3. Enable "Email/Password" as a sign-in provider
4. Enable "Google" as a sign-in provider
5. For Google sign-in, provide a support email
6. Save your changes

## Building for Production

To build the app for production, run:

```
npm run build
```

The built files will be in the `dist` directory.

## License

[MIT](LICENSE)
