// frontend/src/App.tsx

import "./App.css";
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
  const [firebaseUser, authStateLoading, authError] = useAuthState(auth);

  // Initialize Firebase Analytics
  useEffect(() => {
    void initializeAnalytics();
  }, []);

  return (
    <>
      <LDProvider clientSideID={LD_CLIENT_ID}>
        <AuthDisplay
          firebaseUser={firebaseUser}
          authStateLoading={authStateLoading}
          authError={authError}
        />
      </LDProvider>
    </>
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
  const [signInWithGoogle, , ,] = useSignInWithGoogle(auth);
  const [signOut, ,] = useSignOut(auth);
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
