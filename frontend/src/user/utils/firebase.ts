/* istanbul ignore file */

// firebase.ts

import { initializeApp, FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
} from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhUhxhy6_sHjOvR2vbfT-09mF5fLT1Hjc",
  authDomain: "travel-stream.firebaseapp.com",
  projectId: "travel-stream",
  storageBucket: "travel-stream.firebasestorage.app",
  messagingSenderId: "733203797875",
  appId: "1:733203797875:web:a210785cf4c5716ac3d706",
  measurementId: "G-LGT73Z8SLV",
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

// Initialize analytics if supported
isAnalyticsSupported()
  .then((isSupported) => {
    if (isSupported) {
      getAnalytics(app);
    }
  })
  .catch((error: unknown) => {
    console.error("Analytics initialization error:", error);
  });

export { auth };
