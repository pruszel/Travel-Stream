// SignOutButton.test.tsx

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { SignOutButton } from "@/user/components/SignOutButton";
import * as reactFirebaseHooksAuth from "react-firebase-hooks/auth";

describe("SignOutButton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("renders the sign-out button", () => {
    render(<SignOutButton />);
    expect(screen.getByText("Sign Out")).toBeDefined();
  });

  it("calls signOut when clicked", async () => {
    const mockSignOut = vi.fn().mockResolvedValue(undefined); // Mock a resolved promise

    vi.spyOn(reactFirebaseHooksAuth, "useSignOut").mockReturnValue([
      mockSignOut,
      false,
      undefined,
    ]);

    render(<SignOutButton />);
    const button = screen.getByText("Sign Out");
    fireEvent.click(button);

    expect(mockSignOut).toHaveBeenCalled();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
    await expect(mockSignOut.mock.results[0].value).resolves.toBeUndefined(); // Verify the promise resolved
  });
});
