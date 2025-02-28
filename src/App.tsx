import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { AppContent } from "./AppContent.tsx";

function App() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      <AppContent user={user} loading={loading} error={error} />
    </>
  );
}

export default App;
