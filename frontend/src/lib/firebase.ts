/* istanbul ignore file */

// frontend/src/lib/firebase.ts

import { initializeApp, FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import {
  getAnalytics,
  Analytics,
  isSupported as isAnalyticsSupported,
  logEvent,
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

/**
 * Returns the Firebase Analytics instance if it has been initialized.
 * Or initializes it if not already done.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | undefined> {
  analyticsInstance ??= await initializeAnalytics();
  return analyticsInstance;
}

/**
 * Tracks the login event in Firebase Analytics.
 */
export async function trackLoginEvent() {
  const analytics = await getFirebaseAnalytics();
  if (!analytics) return;
  logEvent(analytics, "login", { method: "Google" });
  return;
}
