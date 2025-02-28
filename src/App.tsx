import "./App.css";
import React from "react";
import { SignInWithGoogle } from "./components/SignInWithGoogle.tsx";
import { User } from "firebase/auth";

function App() {
  const [user, setUser] = React.useState<undefined | User>();

  return (
    <>
      <h1 className="text-3xl font-bold">
        Hello, {user ? user.displayName : "World"}!
      </h1>
      <br />
      {!user && <SignInWithGoogle setUser={setUser} />}
    </>
  );
}

export default App;
