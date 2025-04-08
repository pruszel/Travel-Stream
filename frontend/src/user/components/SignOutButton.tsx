// SignOutButton.tsx

import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/user/utils/firebase";

export function SignOutButton() {
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
}
