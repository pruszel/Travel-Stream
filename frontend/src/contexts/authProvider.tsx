// frontend/src/contexts/authProvider.tsx

import * as React from "react";
import { useMemo } from "react";
import {
  useAuthState,
  useSignInWithGoogle,
  useSignOut,
} from "react-firebase-hooks/auth";

import { auth } from "@/lib/firebase.ts";
import { AuthContext } from "@/contexts/authContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, isAuthStateLoading, authError] = useAuthState(auth);
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [signOut] = useSignOut(auth);

  const contextValue = useMemo(
    () => ({
      firebaseUser,
      isAuthStateLoading,
      authError,
      signInWithGoogle,
      signOut,
    }),
    [firebaseUser, isAuthStateLoading, authError, signInWithGoogle, signOut],
  );

  return (
    <>
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    </>
  );
};
