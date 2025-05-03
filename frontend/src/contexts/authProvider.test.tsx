// frontend/src/contexts/authProvider.test.tsx

import { describe, expect, it, vi, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AuthProvider } from "./authProvider";
import { AuthContext } from "./authContext";
import { useContext } from "react";
import { User } from "firebase/auth";

// Mock the firebase hooks module
vi.mock("react-firebase-hooks/auth", () => ({
  useAuthState: vi.fn(),
  useSignInWithGoogle: vi.fn(),
  useSignOut: vi.fn(),
}));

// Mock firebase.ts
vi.mock("@/lib/firebase.ts", () => ({
  auth: {},
}));

// Import mocked modules
import {
  useAuthState,
  useSignInWithGoogle,
  useSignOut,
} from "react-firebase-hooks/auth";

// Test component to consume the context
const TestComponent = () => {
  const auth = useContext(AuthContext);

  return (
    <div>
      <div data-testid="user-state">
        {auth.firebaseUser ? "signed-in" : "signed-out"}
      </div>
      <div data-testid="loading-state">{String(auth.isAuthStateLoading)}</div>
      <div data-testid="error-state">
        {auth.authError ? "error" : "no-error"}
      </div>
      <button
        type="button"
        data-testid="sign-in"
        onClick={() => {
          void auth.signInWithGoogle();
        }}
      >
        Sign In
      </button>
      <button
        type="button"
        data-testid="sign-out"
        onClick={() => {
          void auth.signOut();
        }}
      >
        Sign Out
      </button>
    </div>
  );
};

/**
 * AuthProvider tests
 */
describe("AuthProvider", () => {
  const mockSignIn = vi.fn().mockResolvedValue({ user: { uid: "123" } });
  const mockSignOut = vi.fn().mockResolvedValue(true);

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();

    vi.mocked(useAuthState).mockReturnValue([null, false, undefined]);

    // useSignInWithGoogle returns [signInFunction, user, loading, error]
    vi.mocked(useSignInWithGoogle).mockReturnValue([
      mockSignIn,
      undefined,
      false,
      undefined,
    ]);

    // useSignOut returns [signOutFunction, loading, error]
    vi.mocked(useSignOut).mockReturnValue([mockSignOut, false, undefined]);
  });

  it("should provide auth context with initial values", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user-state").textContent).toBe("signed-out");
    expect(screen.getByTestId("loading-state").textContent).toBe("false");
    expect(screen.getByTestId("error-state").textContent).toBe("no-error");
  });

  it("should reflect authenticated state when user exists", () => {
    // Mock authenticated user
    const mockUser = { uid: "123", displayName: "Test User" } as User;
    vi.mocked(useAuthState).mockReturnValue([mockUser, false, undefined]);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    // Verify user state is signed in
    expect(screen.getByTestId("user-state").textContent).toBe("signed-in");
  });

  it("should reflect loading state", () => {
    // Mock loading state
    vi.mocked(useAuthState).mockReturnValue([null, true, undefined]);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    // Verify loading state is reflected
    expect(screen.getByTestId("loading-state").textContent).toBe("true");
  });

  it("should log error to console", () => {
    // Mock console.error
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    // Mock an error in auth state
    const error = new Error("Auth error");
    vi.mocked(useAuthState).mockReturnValue([null, false, error]);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    // Verify that console.error was called with the expected message
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Authentication error: ${error.message}`,
    );
  });

  it("should reflect error state", () => {
    // Mock console.error to avoid logging errors in tests
    vi.spyOn(console, "error").mockImplementation(() => {
      return;
    });
    // Mock an error in auth state
    const error = new Error("Auth error");
    vi.mocked(useAuthState).mockReturnValue([null, false, error]);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("error-state").textContent).toBe("error");
  });

  it("should call sign in method when triggered", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    screen.getByTestId("sign-in").click();
    expect(mockSignIn).toHaveBeenCalledTimes(1);
  });

  it("should call sign out method when triggered", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    screen.getByTestId("sign-out").click();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
