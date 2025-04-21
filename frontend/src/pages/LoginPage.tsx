// frontend/src/pages/LoginPage.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useFlags } from "launchdarkly-react-client-sdk";
import { logEvent } from "firebase/analytics";
import GoogleButton from "react-google-button";

import { auth, getFirebaseAnalytics } from "@/lib/firebase.ts";

export function LoginPage() {
  const [firebaseUser, isAuthStateLoading] = useAuthState(auth);
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const navigate = useNavigate();
  const { killSwitchEnableGoogleSignIn } = useFlags();

  useEffect(() => {
    if (firebaseUser) {
      void navigate("/");
    }
  }, [firebaseUser, navigate]);

  const handleGoogleButtonClick = () => {
    const handleGoogleSignIn = async () => {
      const result = await signInWithGoogle();
      if (result) {
        const analytics = getFirebaseAnalytics();
        if (analytics) {
          logEvent(analytics, "login", { method: "Google" });
        }
      }
    };

    void handleGoogleSignIn();
  };

  if (isAuthStateLoading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      {killSwitchEnableGoogleSignIn && (
        <>
          <p className="text-center">Sign in to continue</p>
          <GoogleButton onClick={handleGoogleButtonClick} />
        </>
      )}

      {!killSwitchEnableGoogleSignIn && (
        <p className="text-center">Sign in currently disabled.</p>
      )}
    </div>
  );
}
