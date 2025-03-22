import "./App.css";
import GoogleButton from "react-google-button";
import {
  useSignInWithGoogle,
  useAuthState,
  useSignOut,
} from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { User } from "firebase/auth";

function App() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      <AuthDisplay user={user} loading={loading} error={error} />
    </>
  );
}

function AuthDisplay({
  user,
  loading,
}: {
  user: User | null | undefined;
  loading: boolean;
  error: Error | undefined;
}) {
  if (user) {
    return (
      <>
        <div className="flex gap-8 items-center flex-col">
          <UserGreeting user={user} />
          <SignOutButton />
        </div>
      </>
    );
  }

  if (loading) {
    return;
  }

  return (
    <>
      <SignInWithGoogle />
    </>
  );
}

function UserGreeting({ user }: { user: User }) {
  return (
    <div>
      <h1>Hello, {user.displayName}</h1>
    </div>
  );
}

function SignInWithGoogle() {
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

const SignOutButton = () => {
  const [signOut, ,] = useSignOut(auth);

  return (
    <button
      type={"button"}
      onClick={() => {
        void signOut();
      }}
    >
      Sign Out
    </button>
  );
};

export default App;
