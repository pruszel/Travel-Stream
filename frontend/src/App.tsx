// frontend/src/App.tsx

import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import {
  useAuthState,
  useSignInWithGoogle,
  useSignOut,
} from "react-firebase-hooks/auth";
import {
  auth,
  initializeAnalytics,
  getFirebaseAnalytics,
} from "@/lib/firebase";
import { logEvent } from "firebase/analytics";
import { User } from "firebase/auth";
import GoogleButton from "react-google-button";
import { LDProvider, useFlags } from "launchdarkly-react-client-sdk";
import { useEffect } from "react";

const LD_CLIENT_ID = import.meta.env.PROD
  ? `67f0bff500b7a80955249fc7`
  : `67f0bff500b7a80955249fc6`;

export function App() {
  // Initialize Firebase Analytics
  useEffect(() => {
    void initializeAnalytics();
  }, []);

  return (
    <>
      <BrowserRouter>
        <LDProvider clientSideID={LD_CLIENT_ID}>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LDProvider>
      </BrowserRouter>
    </>
  );
}

function IndexPage() {
  const [firebaseUser, authStateLoading, authError] = useAuthState(auth);

  return (
    <AuthDisplay
      firebaseUser={firebaseUser}
      authStateLoading={authStateLoading}
      authError={authError}
    />
  );
}

interface AuthDisplayProps {
  firebaseUser: User | null | undefined;
  authStateLoading: boolean;
  authError: Error | undefined;
}

export function AuthDisplay({
  firebaseUser,
  authStateLoading,
  authError,
}: AuthDisplayProps) {
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [signOut] = useSignOut(auth);
  const { killSwitchEnableGoogleSignIn } = useFlags();

  const handleGoogleButtonClick = () => {
    async function performSignIn() {
      const user = await signInWithGoogle();
      if (user) {
        const analytics = getFirebaseAnalytics();
        if (!analytics) return;
        logEvent(analytics, "login", { method: "Google" });
      }
    }

    void performSignIn();
  };

  if (firebaseUser) {
    return (
      <>
        <div className="flex gap-8 items-center flex-row">
          <p>Hello, {firebaseUser.displayName}</p>
          <button
            type={"button"}
            onClick={() => {
              void signOut();
            }}
          >
            Sign Out
          </button>
        </div>
      </>
    );
  }

  if (authStateLoading || authError) {
    return null;
  }

  return (
    <>
      {killSwitchEnableGoogleSignIn && (
        <GoogleButton onClick={handleGoogleButtonClick} />
      )}
    </>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl">Page not found</p>
    </div>
  );
}
