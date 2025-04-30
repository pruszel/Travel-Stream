// frontend/src/pages/LoginPage.test.tsx

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router";
import { User } from "firebase/auth";
import * as launchdarklyReactClientSdk from "launchdarkly-react-client-sdk";

import * as firebase from "@/lib/firebase";
import { AuthContext } from "@/contexts/authContext";
import {
  LoginPage,
  LOGIN_PAGE_SIGN_IN_TEXT,
  LOGIN_PAGE_LOADING_TEXT,
  LOGIN_PAGE_SIGN_IN_DISABLED_TEXT,
} from "@/pages/LoginPage";
import { IndexPage } from "@/pages/IndexPage";
import { TripListPage } from "@/pages/TripListPage.tsx";
import * as tripService from "@/utils/tripService.ts";
import * as firebaseAnalytics from "firebase/analytics";

// Mock the LaunchDarkly useFlags hook
vi.mock("launchdarkly-react-client-sdk", () => {
  return {
    useFlags: vi.fn(),
  };
});

// Mock Firebase Analytics
vi.mock("firebase/analytics", async () => {
  const actual = await import("firebase/analytics");
  return {
    ...actual,
    logEvent: vi.fn(),
  };
});

// Mock Firebase lib
vi.mock("@/lib/firebase", () => {
  return {
    getFirebaseAnalytics: vi.fn(),
  };
});

// Mock tripService
vi.mock("@/utils/tripService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/utils/tripService")>();
  return {
    ...actual,
    getTrips: vi.fn(),
  };
});

describe("<LoginPage />", () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("renders loading state when auth state is loading", () => {
    // Mock AuthContext to simulate loading state
    const authContextValue = {
      firebaseUser: null,
      isAuthStateLoading: true,
      authError: undefined,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    };

    // Mock useFlags
    vi.mocked(launchdarklyReactClientSdk.useFlags).mockReturnValue({
      killSwitchEnableGoogleSignIn: true,
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
          <LoginPage />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(LOGIN_PAGE_LOADING_TEXT)).toBeInTheDocument();
  });

  it("renders sign in disabled message when feature flag is off", () => {
    // Mock AuthContext to simulate not logged in state
    const authContextValue = {
      firebaseUser: null,
      isAuthStateLoading: false,
      authError: undefined,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    };

    // Mock useFlags with killSwitchEnableGoogleSignIn = false
    vi.mocked(launchdarklyReactClientSdk.useFlags).mockReturnValue({
      killSwitchEnableGoogleSignIn: false,
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
          <LoginPage />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(
      screen.getByText(LOGIN_PAGE_SIGN_IN_DISABLED_TEXT),
    ).toBeInTheDocument();
  });

  it("renders sign in button when feature flag is on", () => {
    // Mock AuthContext to simulate not logged in state
    const authContextValue = {
      firebaseUser: null,
      isAuthStateLoading: false,
      authError: undefined,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    };

    // Mock useFlags with killSwitchEnableGoogleSignIn = true
    vi.mocked(launchdarklyReactClientSdk.useFlags).mockReturnValue({
      killSwitchEnableGoogleSignIn: true,
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
          <LoginPage />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(LOGIN_PAGE_SIGN_IN_TEXT)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("redirects to index page when user is already logged in", async () => {
    // Mock AuthContext to simulate logged in state
    const mockUser = {
      uid: "12345",
      getIdToken: vi.fn().mockResolvedValue("fake-token"),
    } as unknown as User;
    const authContextValue = {
      firebaseUser: mockUser,
      isAuthStateLoading: false,
      authError: undefined,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    };

    // Mock useFlags
    vi.mocked(launchdarklyReactClientSdk.useFlags).mockReturnValue({
      killSwitchEnableGoogleSignIn: true,
    });

    const mockedGetTrips = vi.mocked(tripService.getTrips);
    mockedGetTrips.mockResolvedValue({ data: [], error: undefined });

    render(
      <AuthContext.Provider value={authContextValue}>
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

  it("handles Google sign-in button click", async () => {
    // Mock AuthContext to simulate not logged in state
    const mockSignInWithGoogle = vi
      .fn()
      .mockResolvedValue({ user: { uid: "12345" } });
    const authContextValue = {
      firebaseUser: null,
      isAuthStateLoading: false,
      authError: undefined,
      signInWithGoogle: mockSignInWithGoogle,
      signOut: vi.fn(),
    };

    vi.mocked(launchdarklyReactClientSdk.useFlags).mockReturnValue({
      killSwitchEnableGoogleSignIn: true,
    });

    const mockAnalytics = {} as unknown as firebaseAnalytics.Analytics;
    vi.mocked(firebase.getFirebaseAnalytics).mockReturnValue(mockAnalytics);

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
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
    // Mock AuthContext with successful sign-in
    const mockSignInWithGoogle = vi
      .fn()
      .mockResolvedValue({ user: { uid: "12345" } });
    const authContextValue = {
      firebaseUser: null,
      isAuthStateLoading: false,
      authError: undefined,
      signInWithGoogle: mockSignInWithGoogle,
      signOut: vi.fn(),
    };

    // Mock useFlags to enable Google sign-in
    vi.mocked(launchdarklyReactClientSdk.useFlags).mockReturnValue({
      killSwitchEnableGoogleSignIn: true,
    });

    // Mock Firebase Analytics
    const mockAnalytics = {} as unknown as firebaseAnalytics.Analytics;
    vi.mocked(firebase.getFirebaseAnalytics).mockReturnValue(mockAnalytics);

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextValue}>
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
      expect(firebase.getFirebaseAnalytics).toHaveBeenCalled();
      expect(vi.mocked(firebaseAnalytics.logEvent)).toHaveBeenCalledWith(
        mockAnalytics,
        "login",
        {
          method: "Google",
        },
      );
    });
  });
});
