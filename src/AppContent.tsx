import { SignInWithGoogle } from "./components/SignInWithGoogle.tsx";
import { User } from "firebase/auth";

function AppContent({
  user,
  loading,
  error,
}: {
  user: User | null | undefined;
  loading: boolean;
  error: Error | undefined;
}) {
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
    </>
  );
}

export { AppContent };
