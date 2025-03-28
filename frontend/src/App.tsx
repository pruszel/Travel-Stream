import "./App.css";
import {
  useAuthState,
} from "react-firebase-hooks/auth";
import { auth } from "@user/utils/firebase";
import { User } from "firebase/auth";
import {SignOutButton} from "@user/components/SignOutButton.tsx";
import {SignInWithGoogle} from "@user/components/SignInWithGoogle.tsx";

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


export default App;
