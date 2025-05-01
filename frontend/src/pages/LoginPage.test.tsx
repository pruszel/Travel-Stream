// frontend/src/pages/LoginPage.test.tsx

import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router";

import { AuthContext } from "@/contexts/authContext";
import { IndexPage } from "@/pages/IndexPage";
import { TripListPage } from "@/pages/TripListPage";
import {
  LoginPage,
  LOGIN_PAGE_SIGN_IN_TEXT,
  LOGIN_PAGE_LOADING_TEXT,
  LOGIN_PAGE_SIGN_IN_DISABLED_TEXT,
} from "@/pages/LoginPage";
import {
  authContextLoading,
  authContextLoggedIn,
  authContextLoggedOut,
  mockSignInWithGoogle,
  mockGetIdToken,
  mockAnalytics,
} from "@/test-utils";

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

// Mock tripService
vi.mock("@/utils/tripService", () => ({
  getTrips: vi.fn(),
}));

import { useFlags } from "launchdarkly-react-client-sdk";
import { logEvent } from "firebase/analytics";
import { getFirebaseAnalytics } from "@/lib/firebase";
import { getTrips } from "@/utils/tripService";

/**
 * LoginPage tests
 */
describe("<LoginPage />", () => {
  const mockedLogEvent = logEvent as Mock;

  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();

    // Provide default return value for mocked functions
    vi.mocked(useFlags).mockReturnValue({
      killSwitchEnableGoogleSignIn: true,
    });
    vi.mocked(getFirebaseAnalytics).mockReturnValue(mockAnalytics);
    vi.mocked(mockGetIdToken).mockResolvedValue("fake-token");
  });

  it("renders loading state when auth state is loading", () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextLoading}>
          <LoginPage />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(LOGIN_PAGE_LOADING_TEXT)).toBeInTheDocument();
  });

  it("renders sign in disabled message when feature flag is off", () => {
    // Mock useFlags with killSwitchEnableGoogleSignIn set to false
    vi.mocked(useFlags).mockReturnValue({
      killSwitchEnableGoogleSignIn: false,
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextLoggedOut}>
          <LoginPage />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(
      screen.getByText(LOGIN_PAGE_SIGN_IN_DISABLED_TEXT),
    ).toBeInTheDocument();
  });

  it("renders sign in button when feature flag is on", () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextLoggedOut}>
          <LoginPage />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(LOGIN_PAGE_SIGN_IN_TEXT)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("redirects to index page when user is already logged in", async () => {
    vi.mocked(getTrips).mockResolvedValue({
      data: [],
      error: undefined,
    });

    render(
      <AuthContext.Provider value={authContextLoggedIn}>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/trips" element={<TripListPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    // Wait for the redirect to happen
    await waitFor(() => {
      expect(
        screen.queryByText(LOGIN_PAGE_SIGN_IN_TEXT),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(LOGIN_PAGE_LOADING_TEXT),
      ).not.toBeInTheDocument();
    });
  });

  it("starts Google sign-in process when button clicked", async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextLoggedOut}>
          <LoginPage />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    // Click the Google button
    const googleButton = screen.getByRole("button");
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });
  });

  it("logs the login analytics event", async () => {
    mockSignInWithGoogle.mockResolvedValue({}); // Resolve with a truthy value like an empty object
    const mockAnalytics = getFirebaseAnalytics();

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextLoggedOut}>
          <LoginPage />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    // Click the Google button
    const googleButton = screen.getByRole("button");
    fireEvent.click(googleButton);

    // Verify that signInWithGoogle was called
    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });

    // Verify that logEvent was called with the correct parameters
    await waitFor(() => {
      expect(mockedLogEvent).toHaveBeenCalledWith(mockAnalytics, "login", {
        method: "Google",
      });
    });
  });
});
