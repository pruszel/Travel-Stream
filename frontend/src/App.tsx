// App.tsx

import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@user/utils/firebase";
import { AuthDisplay } from "@user/components/AuthDisplay";
import { useBackendAuth } from "@user/hooks/useBackendAuth";

export function App() {
  const { handleFirebaseUserChange } = useBackendAuth();
  const [user, loading, error] = useAuthState(auth, {
    onUserChanged: handleFirebaseUserChange,
  });

  return (
    <>
      <AuthDisplay user={user} loading={loading} error={error} />
    </>
  );
}
