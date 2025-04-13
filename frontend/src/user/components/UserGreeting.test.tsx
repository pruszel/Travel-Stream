// UserGreeting.test.tsx

import { describe, it, afterEach, expect } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { UserGreeting } from "@user/components/UserGreeting";
import { User } from "firebase/auth";

describe("UserGreeting", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the user's name", () => {
    const mockUser = { displayName: "John Doe" } as User;
    render(<UserGreeting user={mockUser} />);
    expect(screen.getByText("Hello, John Doe")).toBeDefined();
  });
});
