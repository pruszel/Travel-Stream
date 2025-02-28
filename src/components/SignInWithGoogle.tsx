import GoogleButton from "react-google-button";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

function SignInWithGoogle() {
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  return (
    <>
      <GoogleButton
        onClick={() => {
          signInWithGoogle()
            .then()
            .catch((error: unknown) => {
              console.error(error);
            });
        }}
      />
    </>
  );
}

export { SignInWithGoogle };
