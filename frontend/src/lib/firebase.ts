/* istanbul ignore file */

// frontend/src/lib/firebase.ts

import { initializeApp, FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import {
  getAnalytics,
  Analytics,
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

export const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
let analyticsInstance: Analytics | undefined;

export async function initializeAnalytics() {
  try {
    const isSupported = await isAnalyticsSupported();
    if (isSupported) {
      analyticsInstance = getAnalytics(app);
      console.log(`Firebase Analytics initialized`);
    }
    return analyticsInstance;
  } catch (error) {
    console.error("Analytics initialization error:", error);
    return undefined;
  }
}

export function getFirebaseAnalytics(): Analytics | undefined {
  return analyticsInstance;
}
