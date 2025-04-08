// AuthDisplay.test.tsx

import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AuthDisplay } from "@/user/components/AuthDisplay";
import { User } from "firebase/auth";

describe("AuthDisplay", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders SignInWithGoogle when user is null", () => {
    render(<AuthDisplay user={null} loading={false} error={undefined} />);
    expect(screen.getByText("Sign in with Google")).toBeDefined();
  });

  it("renders UserGreeting when user is not null", () => {
    const mockUser = { displayName: "John Doe" } as User;
    render(<AuthDisplay user={mockUser} loading={false} error={undefined} />);
    expect(screen.getByText("Hello, John Doe")).toBeDefined();
  });

  it("renders nothing when loading is true", () => {
    render(<AuthDisplay user={null} loading={true} error={undefined} />);
    expect(screen.queryByText("Sign in with Google")).toBeNull();
    expect(screen.queryByText("Hello, John Doe")).toBeNull();
  });
});
