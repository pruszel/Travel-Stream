// frontend/src/pages/LoginPage.tsx

import { useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { useFlags } from "launchdarkly-react-client-sdk";
import { logEvent } from "firebase/analytics";
import GoogleButton from "react-google-button";

import { getFirebaseAnalytics } from "@/lib/firebase.ts";
import { AuthContext } from "@/contexts/authContext";

export const LOGIN_PAGE_SIGN_IN_TEXT = "Sign in to continue";
export const LOGIN_PAGE_LOADING_TEXT = "Loading...";
export const LOGIN_PAGE_SIGN_IN_DISABLED_TEXT = "Sign in currently disabled";

export function LoginPage() {
  const { firebaseUser, isAuthStateLoading, signInWithGoogle } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const { killSwitchEnableGoogleSignIn } = useFlags();

  // Redirect to Index Page if user is already authenticated
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
    return <p className="text-center">{LOGIN_PAGE_LOADING_TEXT}</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      {killSwitchEnableGoogleSignIn && (
        <>
          <p className="text-center">{LOGIN_PAGE_SIGN_IN_TEXT}</p>
          <GoogleButton onClick={handleGoogleButtonClick} />
        </>
      )}

      {!killSwitchEnableGoogleSignIn && (
        <p className="text-center">{LOGIN_PAGE_SIGN_IN_DISABLED_TEXT}</p>
      )}
    </div>
  );
}
