// frontend/src/components/UserDisplay.tsx

import { useContext } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
import { logEvent } from "firebase/analytics";
import GoogleButton from "react-google-button";

import { AuthContext } from "@/contexts/authContext.ts";
import { getFirebaseAnalytics } from "@/lib/firebase.ts";

export function UserDisplay() {
  // call exported use hook for auth context
  const {
    firebaseUser,
    isAuthStateLoading,
    authError,
    signInWithGoogle,
    signOut,
  } = useContext(AuthContext);
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
        <div className="flex gap-4 items-end flex-row">
          <p className="hidden sm:inline-block">
            Hello, {firebaseUser.displayName}
          </p>
          <button
            className="btn btn-outline"
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

  if (isAuthStateLoading || authError) {
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
