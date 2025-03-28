// SignInWithGoogle.tsx

import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@user/utils/firebase.ts";
import GoogleButton from "react-google-button";

export function SignInWithGoogle() {
  const [signInWithGoogle, , ,] = useSignInWithGoogle(auth);

  return (
    <>
      <GoogleButton
        onClick={() => {
          void signInWithGoogle();
        }}
      />
    </>
  );
}
