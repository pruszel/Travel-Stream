import GoogleButton from "react-google-button";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { User } from "firebase/auth";

function SignInWithGoogle({
  setUser,
}: {
  setUser: (user: User | undefined) => void;
}) {
  const [signInWithGoogle, , loading, error] = useSignInWithGoogle(auth);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <GoogleButton
        onClick={() => {
          signInWithGoogle()
            .then((result) => {
              if (result?.user) {
                setUser(result.user);
              }
            })
            .catch((error: unknown) => {
              console.error(error);
            });
        }}
      />
    </>
  );
}

export { SignInWithGoogle };
