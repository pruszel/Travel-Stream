/* istanbul ignore file */

// frontend/src/test-utils.tsx

import { vi } from "vitest";
import { User } from "firebase/auth";
import { Analytics } from "firebase/analytics";
import { AuthContextType } from "@/contexts/authContext";
import { Trip } from "@/utils/tripService";

export const mockTrip: Trip = {
  id: 1,
  name: "Test Trip",
  destination: "Test Destination",
  description: "A trip for testing purposes",
  start_date: "2023-01-01",
  end_date: "2023-01-10",
};

export const mockTrips: Trip[] = [
  {
    id: 1,
    name: "Trip 1",
    destination: "Destination 1",
    description: "Description 1",
    start_date: "2023-01-01",
    end_date: "2023-01-05",
  },
  {
    id: 2,
    name: "Trip 2",
    destination: "Destination 2",
    description: "Description 2",
    start_date: new Date("2023-02-01").toISOString(),
    end_date: new Date("2023-02-10").toISOString(),
  },
];

export const mockUpdatedTrip: Trip = {
  id: 1,
  name: "Updated Trip Name",
  destination: "Updated Destination",
  description: "Updated description",
  start_date: "2023-02-01",
  end_date: "2023-02-10",
};

export const mockAnalytics = {} as Analytics;
export const mockTrackEvent = vi.fn();

export const mockSignInWithGoogle = vi.fn().mockResolvedValue({});
export const mockGetIdToken = vi.fn().mockResolvedValue("fake-token");
const mockSignOut = vi.fn();

export const mockUser = {
  uid: "12345",
  displayName: "Test User",
  getIdToken: mockGetIdToken,
} as unknown as User;

export const mockFirebaseToken = "test-firebase-token";

export const mockAuthContextLoading: AuthContextType = {
  firebaseUser: null,
  isAuthStateLoading: true,
  authError: undefined,
  signInWithGoogle: mockSignInWithGoogle,
  signOut: mockSignOut,
};

export const mockAuthContextLoggedOut: AuthContextType = {
  firebaseUser: null,
  isAuthStateLoading: false,
  authError: undefined,
  signInWithGoogle: mockSignInWithGoogle,
  signOut: mockSignOut,
};

export const mockAuthContextLoggedIn: AuthContextType = {
  firebaseUser: mockUser,
  isAuthStateLoading: false,
  authError: undefined,
  signInWithGoogle: mockSignInWithGoogle,
  signOut: mockSignOut,
};

export const mockToasts = [];
export const mockAddToast = vi.fn();
export const mockRemoveToast = vi.fn();
export const mockClearToasts = vi.fn();

export const mockToastContextValue = {
  addToast: mockAddToast,
  removeToast: mockRemoveToast,
  clearToasts: mockClearToasts,
  toasts: mockToasts,
};
