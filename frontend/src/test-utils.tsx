// frontend/src/test-utils.tsx

import { vi } from "vitest";
import { User } from "firebase/auth";
import { Analytics } from "firebase/analytics";
import { AuthContextType } from "@/contexts/authContext";

export const mockAnalytics = {} as Analytics;

export const mockSignInWithGoogle = vi.fn().mockResolvedValue({});
export const mockGetIdToken = vi.fn().mockResolvedValue("fake-token");
const mockSignOut = vi.fn();

export const mockUser = {
  uid: "12345",
  displayName: "Test User",
  getIdToken: mockGetIdToken,
} as unknown as User;

export const mockFirebaseToken = "test-firebase-token";

export const authContextLoading: AuthContextType = {
  firebaseUser: null,
  isAuthStateLoading: true,
  authError: undefined,
  signInWithGoogle: mockSignInWithGoogle,
  signOut: mockSignOut,
};

export const authContextLoggedOut: AuthContextType = {
  firebaseUser: null,
  isAuthStateLoading: false,
  authError: undefined,
  signInWithGoogle: mockSignInWithGoogle,
  signOut: mockSignOut,
};

export const authContextLoggedIn: AuthContextType = {
  firebaseUser: mockUser,
  isAuthStateLoading: false,
  authError: undefined,
  signInWithGoogle: mockSignInWithGoogle,
  signOut: mockSignOut,
};

export const mockAddToast = vi.fn();
export const mockRemoveToast = vi.fn();
export const mockClearToasts = vi.fn();

export const toastContextValue = {
  addToast: mockAddToast,
  removeToast: mockRemoveToast,
  clearToasts: mockClearToasts,
  toasts: [],
};
