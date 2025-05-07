// frontend/src/components/UserDisplay.test.tsx

import { beforeEach, describe, expect, it, vi, Mock } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { useFlags } from "launchdarkly-react-client-sdk";

import {
  mockUser,
  mockAnalytics,
  mockSignInWithGoogle,
  authContextLoading,
  mockAuthContextLoggedOut,
  mockAuthContextLoggedIn,
} from "@/test-utils";
import { AuthContext } from "@/contexts/authContext";
import { getFirebaseAnalytics, trackEvent } from "@/lib/firebase";
import { UserDisplay, SIGN_OUT_BUTTON_TEXT } from "./UserDisplay";

// Mock the LaunchDarkly useFlags hook
vi.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: vi.fn().mockReturnValue({ killSwitchEnableGoogleSignIn: true }),
}));

// Mock Firebase Analytics
vi.mock("firebase/analytics", () => ({
  logEvent: vi.fn(),
}));

// Mock Firebase lib
vi.mock("@/lib/firebase", () => ({
  getFirebaseAnalytics: vi.fn().mockReturnValue({}),
  trackEvent: vi.fn(),
}));

/**
 * UserDisplay tests
 */
describe("UserDisplay", () => {
  // Keep reference to the mocked trackEvent function for asserting calls
  const mockedTrackEvent = trackEvent as Mock;

  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();

    //
    // Default return value for mocked functions
    //
    // enable Sign in with Google flag
    vi.mocked(useFlags).mockReturnValue({
      killSwitchEnableGoogleSignIn: true,
    });
    vi.mocked(getFirebaseAnalytics).mockResolvedValue(mockAnalytics);
    mockSignInWithGoogle.mockResolvedValue(mockUser);
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
      ...mockAuthContextLoggedOut,
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
      <AuthContext.Provider value={mockAuthContextLoggedIn}>
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
      <AuthContext.Provider value={mockAuthContextLoggedIn}>
        <UserDisplay />
      </AuthContext.Provider>,
    );

    // Click the sign-out button
    const signOutButton = screen.getByText(SIGN_OUT_BUTTON_TEXT);
    fireEvent.click(signOutButton);

    // Verify that signOut was called
    expect(mockAuthContextLoggedIn.signOut).toHaveBeenCalled();
  });

  it("should render Google sign-in button when logged out and feature flag is enabled", () => {
    render(
      <AuthContext.Provider value={mockAuthContextLoggedOut}>
        <UserDisplay />
      </AuthContext.Provider>,
    );

    // Verify for Google button
    const googleButton = screen.getByRole("button");
    expect(googleButton).toBeInTheDocument();
  });

  it("should not render Google sign-in button when feature flag is disabled", () => {
    // Mock useFlags with killSwitchEnableGoogleSignIn set to false
    vi.mocked(useFlags).mockReturnValue({
      killSwitchEnableGoogleSignIn: false,
    });

    const { container } = render(
      <AuthContext.Provider value={mockAuthContextLoggedOut}>
        <UserDisplay />
      </AuthContext.Provider>,
    );

    // Verify that no button is rendered
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(container.innerHTML).toBe("");
  });

  it("should call signInWithGoogle and log event when Google button is clicked", async () => {
    // Mock successful sign-in
    mockSignInWithGoogle.mockResolvedValue({ uid: "test-uid" });

    render(
      <AuthContext.Provider value={mockAuthContextLoggedOut}>
        <UserDisplay />
      </AuthContext.Provider>,
    );

    // Click the Google button
    const googleButton = screen.getByRole("button");
    fireEvent.click(googleButton);

    // Verify that signInWithGoogle was called
    expect(mockSignInWithGoogle).toHaveBeenCalled();

    // Verify that trackEvent was called
    await vi.waitFor(() => {
      expect(mockedTrackEvent).toHaveBeenCalled();
    });
  });
});
