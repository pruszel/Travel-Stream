import { describe, afterEach, it, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AppContent } from "./AppContent.tsx";
import { IdTokenResult } from "firebase/auth";

const mockUser = {
  displayName: "John Doe",
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerId: "",
  providerData: [],
  refreshToken: "",
  tenantId: "",
  delete(): Promise<void> {
    return Promise.resolve();
  },
  getIdToken(): Promise<string> {
    return Promise.resolve("");
  },
  getIdTokenResult(): Promise<IdTokenResult> {
    return Promise.resolve({
      authTime: "",
      claims: {},
      expirationTime: "",
      issuedAtTime: "",
      signInProvider: "",
      token: "",
      signInSecondFactor: null,
    });
  },
  reload(): Promise<void> {
    return Promise.resolve();
  },
  toJSON(): object {
    return {};
  },
  email: "",
  phoneNumber: "",
  photoURL: "",
  uid: "",
};

describe("AppContent", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the default state", () => {
    render(<AppContent user={null} loading={false} error={undefined} />);
    expect(screen.getByText("Hello, World!")).toBeDefined();
  });

  it("renders the loading state", () => {
    render(<AppContent user={null} loading={true} error={undefined} />);
    expect(screen.queryByText("Hello, World!")).toBeNull();
  });

  it("renders the error state", () => {
    render(
      <AppContent
        user={null}
        loading={false}
        error={new Error("Test error")}
      />,
    );
    expect(screen.getByText("Error authenticating with Google:")).toBeDefined();
    expect(screen.getByText("Test error")).toBeDefined();
  });

  it("renders the sign in with Google button", () => {
    render(<AppContent user={null} loading={false} error={undefined} />);
    expect(
      screen.getByRole("button", { name: /Sign in with Google/i }),
    ).toBeDefined();
  });

  it("renders the user name", () => {
    render(<AppContent user={mockUser} loading={false} error={undefined} />);
    expect(screen.getByText("Hello, John Doe!")).toBeDefined();
  });

  it("renders the sign out button", () => {
    render(<AppContent user={mockUser} loading={false} error={undefined} />);
    expect(screen.getByRole("button", { name: /Sign Out/i })).toBeDefined();
  });
});
