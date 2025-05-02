// frontend/src/components/UserDisplay.test.tsx

import { beforeEach, describe, expect, it, vi, Mock } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { User } from "firebase/auth";
import { Analytics } from "firebase/analytics";

import { UserDisplay, SIGN_OUT_BUTTON_TEXT } from "./UserDisplay";
import { AuthContext, AuthContextType } from "@/contexts/authContext";

const mockAnalytics = {} as Analytics;
const mockSignInWithGoogle = vi.fn().mockResolvedValue({});
const mockGetIdToken = vi.fn().mockResolvedValue("fake-token");
const mockSignOut = vi.fn();

const mockUser = {
  uid: "12345",
  displayName: "Test User",
  getIdToken: mockGetIdToken,
} as unknown as User;

const authContextLoading: AuthContextType = {
  firebaseUser: null,
  isAuthStateLoading: true,
  authError: undefined,
  signInWithGoogle: mockSignInWithGoogle,
  signOut: mockSignOut,
};

const authContextLoggedOut: AuthContextType = {
  firebaseUser: null,
  isAuthStateLoading: false,
  authError: undefined,
  signInWithGoogle: mockSignInWithGoogle,
  signOut: mockSignOut,
};

const authContextLoggedIn: AuthContextType = {
  firebaseUser: mockUser,
  isAuthStateLoading: false,
  authError: undefined,
  signInWithGoogle: mockSignInWithGoogle,
  signOut: mockSignOut,
};

// Mock the LaunchDarkly useFlags hook
vi.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: vi.fn().mockReturnValue({ killSwitchEnableGoogleSignIn: true }), // default mock return value
}));

// Mock Firebase Analytics
vi.mock("firebase/analytics", () => ({
  logEvent: vi.fn(),
}));

// Mock Firebase lib
vi.mock("@/lib/firebase", () => ({
  getFirebaseAnalytics: vi.fn().mockReturnValue({}),
}));

// Import mocked libraries after mocking them
import { useFlags } from "launchdarkly-react-client-sdk";
import { logEvent } from "firebase/analytics";
import { getFirebaseAnalytics } from "@/lib/firebase";

/**
 * UserDisplay tests
 */
describe("UserDisplay", () => {
  const mockedLogEvent = logEvent as Mock;

  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();

    // Provide default return value for mocked functions
    vi.mocked(useFlags).mockReturnValue({
      killSwitchEnableGoogleSignIn: true,
    });
    vi.mocked(getFirebaseAnalytics).mockReturnValue(mockAnalytics);
  });

  it("should render nothing when auth state is loading", () => {
    const { container } = render(
      <AuthContext.Provider value={authContextLoading}>
        <UserDisplay />
      </AuthContext.Provider>,
    );
    expect(container.innerHTML).toBe("");
  });

  it("should render nothing when auth error occurs", () => {
    const authContextWithError = {
      ...authContextLoggedOut,
      authError: new Error("Auth error"),
    };

    const { container } = render(
      <AuthContext.Provider value={authContextWithError}>
        <UserDisplay />
      </AuthContext.Provider>,
    );
    expect(container.innerHTML).toBe("");
  });

  it("should render user display name and sign out button when logged in", () => {
    render(
      <AuthContext.Provider value={authContextLoggedIn}>
        <UserDisplay />
      </AuthContext.Provider>,
    );

    // Verify user display name is rendered
    expect(screen.getByText(mockUser.displayName ?? "")).toBeInTheDocument();

    // Verify sign out button is rendered
    const signOutButton = screen.getByText(SIGN_OUT_BUTTON_TEXT);
    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton.closest("button")).toHaveClass("btn", "btn-outline");
  });

  it("should call signOut when sign out button is clicked", () => {
    render(
      <AuthContext.Provider value={authContextLoggedIn}>
        <UserDisplay />
      </AuthContext.Provider>,
    );

    const signOutButton = screen.getByText(SIGN_OUT_BUTTON_TEXT);
    fireEvent.click(signOutButton);

    // Check that signOut was called
    expect(authContextLoggedIn.signOut).toHaveBeenCalled();
  });

  it("should render Google sign-in button when logged out and feature flag is enabled", () => {
    render(
      <AuthContext.Provider value={authContextLoggedOut}>
        <UserDisplay />
      </AuthContext.Provider>,
    );

    // Check for Google button
    const googleButton = screen.getByRole("button");
    expect(googleButton).toBeInTheDocument();
  });

  it("should not render Google sign-in button when feature flag is disabled", () => {
    // Mock useFlags with killSwitchEnableGoogleSignIn set to false
    vi.mocked(useFlags).mockReturnValue({
      killSwitchEnableGoogleSignIn: false,
    });

    const { container } = render(
      <AuthContext.Provider value={authContextLoggedOut}>
        <UserDisplay />
      </AuthContext.Provider>,
    );

    // Check that no button is rendered
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(container.innerHTML).toBe("");
  });

  it("should call signInWithGoogle and log event when Google button is clicked", async () => {
    mockSignInWithGoogle.mockResolvedValue({ uid: "test-uid" }); // Mock successful sign-in

    render(
      <AuthContext.Provider value={authContextLoggedOut}>
        <UserDisplay />
      </AuthContext.Provider>,
    );

    // Click the Google button
    const googleButton = screen.getByRole("button");
    fireEvent.click(googleButton);

    // Check that signInWithGoogle was called
    expect(mockSignInWithGoogle).toHaveBeenCalled();

    // Wait for the async operation to complete
    await vi.waitFor(() => {
      // Check that logEvent was called with the correct parameters
      expect(mockedLogEvent).toHaveBeenCalledWith(mockAnalytics, "login", {
        method: "Google",
      });
    });
  });

  it("should not log event if analytics is not available", async () => {
    mockSignInWithGoogle.mockResolvedValue({ uid: "test-uid" }); // Mock successful sign-in
    vi.mocked(getFirebaseAnalytics).mockReturnValue(undefined); // Mock analytics not available

    render(
      <AuthContext.Provider value={authContextLoggedOut}>
        <UserDisplay />
      </AuthContext.Provider>,
    );

    // Click the Google button
    const googleButton = screen.getByRole("button");
    fireEvent.click(googleButton);

    // Check that signInWithGoogle was called
    expect(mockSignInWithGoogle).toHaveBeenCalled();

    // Wait for the async operation to complete
    await vi.waitFor(() => {
      // Check that logEvent was not called
      expect(mockedLogEvent).not.toHaveBeenCalled();
    });
  });
});
