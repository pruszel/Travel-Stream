import { SignInWithGoogle } from "./components/SignInWithGoogle.tsx";
import { User } from "firebase/auth";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

function AppContent({
  user,
  loading,
  error,
}: {
  user: User | null | undefined;
  loading: boolean;
  error: Error | undefined;
}) {
  const [signOut] = useSignOut(auth);

  return (
    <>
      {!loading && (
        <h1 className="text-3xl font-bold">
          Hello, {user ? user.displayName : "World"}!
        </h1>
      )}
      <br />
      {error && (
        <>
          <p>Error authenticating with Google:</p>
          <pre>{error.message}</pre>
        </>
      )}
      {!loading && !user && <SignInWithGoogle />}
      {user && (
        <button
          className="btn btn-ghost"
          onClick={() => {
            void signOut();
          }}
        >
          Sign Out
        </button>
      )}
    </>
  );
}

export { AppContent };
