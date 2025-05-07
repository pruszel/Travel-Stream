// frontend/src/components/UserDisplay.tsx

import { useCallback, useContext } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
import GoogleButton from "react-google-button";

import { AuthContext } from "@/contexts/authContext.ts";
import { trackEvent } from "@/lib/firebase.ts";

export const SIGN_OUT_BUTTON_TEXT = "Sign Out";

export function UserDisplay() {
  const {
    firebaseUser,
    isAuthStateLoading,
    authError,
    signInWithGoogle,
    signOut,
  } = useContext(AuthContext);
  const { killSwitchEnableGoogleSignIn } = useFlags();

  const handleGoogleButtonClick = useCallback(() => {
    async function performSignIn() {
      const user = await signInWithGoogle();
      if (user) void trackEvent("login", { method: "Google" });
      return;
    }

    void performSignIn();
  }, [signInWithGoogle]);

  if (isAuthStateLoading || authError) return null;

  if (firebaseUser) {
    const displayText = firebaseUser.displayName ?? firebaseUser.email;

    return (
      <>
        <div className="flex gap-4 items-end flex-row">
          <p className="hidden sm:inline-block">{displayText}</p>
          <button
            className="btn btn-outline"
            type={"button"}
            onClick={() => {
              void signOut();
            }}
          >
            {SIGN_OUT_BUTTON_TEXT}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {killSwitchEnableGoogleSignIn && (
        <GoogleButton onClick={handleGoogleButtonClick} />
      )}
    </>
  );
}
