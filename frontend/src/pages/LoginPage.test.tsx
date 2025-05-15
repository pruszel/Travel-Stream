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
import { useFlags } from "launchdarkly-react-client-sdk";
import { logEvent } from "firebase/analytics";

import { getFirebaseAnalytics } from "@/lib/firebase";
import { getTrips } from "@/utils/tripService";
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
  mockAuthContextLoading,
  mockAuthContextLoggedIn,
  mockAuthContextLoggedOut,
  mockSignInWithGoogle,
  mockGetIdToken,
  mockAnalytics,
} from "@/test-utils";

// Mock the LaunchDarkly useFlags hook
vi.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: vi.fn(),
}));

// Mock Firebase Analytics
vi.mock("firebase/analytics", () => ({
  logEvent: vi.fn(),
}));

// Mock Firebase lib
vi.mock("@/lib/firebase", () => ({
  getFirebaseAnalytics: vi.fn().mockResolvedValue({}),
}));

// Mock tripService
vi.mock("@/utils/tripService", () => ({
  getTrips: vi.fn(),
}));

/**
 * LoginPage tests
 */
describe("<LoginPage />", () => {
  // Keep reference to the mocked logEvent function for asserting calls
  const mockedLogEvent = logEvent as Mock;

  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();

    //
    // Default return value for mocked functions
    //
    vi.mocked(useFlags).mockReturnValue({
      killSwitchEnableGoogleSignIn: true,
    });
    vi.mocked(getFirebaseAnalytics).mockResolvedValue(mockAnalytics);
    vi.mocked(mockGetIdToken).mockResolvedValue("fake-token");
  });

  it("renders loading state when auth state is loading", () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContextLoading}>
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
        <AuthContext.Provider value={mockAuthContextLoggedOut}>
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
        <AuthContext.Provider value={mockAuthContextLoggedOut}>
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
      <AuthContext.Provider value={mockAuthContextLoggedIn}>
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
        <AuthContext.Provider value={mockAuthContextLoggedOut}>
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

  it("tracks the login analytics event", async () => {
    mockSignInWithGoogle.mockResolvedValue({});

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContextLoggedOut}>
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
