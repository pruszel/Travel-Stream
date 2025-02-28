import "./App.css";
import { SignInWithGoogle } from "./components/SignInWithGoogle.tsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

function App() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      {!loading && (
        <h1 className="text-3xl font-bold">
          Hello, {user ? user.displayName : "World"}!
        </h1>
      )}
      <br />
      {error && <p>Error authenticating with Google: <pre>{error.message}</pre></p>}
      {!loading && !user && <SignInWithGoogle />}
    </>
  );
}

export default App;
