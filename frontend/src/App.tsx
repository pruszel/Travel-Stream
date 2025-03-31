// App.tsx

import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@user/utils/firebase";
import { AuthDisplay } from "@user/components/AuthDisplay.tsx";

export function App() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      <AuthDisplay user={user} loading={loading} error={error} />
    </>
  );
}
