// AuthDisplay.tsx

import { User } from "firebase/auth";
import { UserGreeting } from "@user/components/UserGreeting.tsx";
import { SignOutButton } from "@user/components/SignOutButton.tsx";
import { SignInWithGoogle } from "@user/components/SignInWithGoogle.tsx";

export function AuthDisplay({
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
        <div className="flex gap-8 items-center flex-row">
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
