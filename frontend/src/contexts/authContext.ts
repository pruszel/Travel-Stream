// frontend/src/contexts/authContext.ts

import { createContext } from "react";
import { User, UserCredential } from "firebase/auth";

export interface AuthContextType {
  firebaseUser: User | null | undefined;
  isAuthStateLoading: boolean;
  authError: Error | undefined;
  signInWithGoogle: () => Promise<UserCredential | undefined>;
  signOut: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);
